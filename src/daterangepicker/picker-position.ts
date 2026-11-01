import { NgZone, Renderer2 } from '@angular/core';
import { DaterangepickerComponent } from './daterangepicker.component';

// The directive inputs used to place the calendar, read at each call so changes are picked up.
export interface PickerPositionOptions {
  opens: string;
  drops: string;
  appendToBody: boolean;
  topLayer: boolean;
}

// Places the calendar of a DaterangepickerDirective next to its input, and keeps it there while it is open.
export class PickerPosition {
  private resizeObserver: ResizeObserver | null = null;
  private stopWindowListeners: (() => void) | null = null;

  constructor(
    private document: Document,
    private renderer: Renderer2,
    private zone: NgZone,
    private element: HTMLElement,
    private host: HTMLElement,
    private picker: DaterangepickerComponent,
    private options: () => PickerPositionOptions
  ) {}

  // Puts the calendar in the top layer with topLayer, under <body> with appendToBody, or next to the input.
  place(): void {
    const container = this.container();
    // Without the Popover API (old browsers), topLayer falls back to the behavior without it.
    const topLayer = this.options().topLayer && typeof container.showPopover === 'function';
    const appendToBody = this.options().appendToBody && !topLayer;
    if (appendToBody && this.host.parentNode !== this.document.body) {
      this.renderer.appendChild(this.document.body, this.host);
    } else if (!appendToBody && this.host.parentNode === this.document.body && this.element.parentNode) {
      this.renderer.insertBefore(this.element.parentNode, this.host, this.element.nextSibling);
    }
    if (topLayer) {
      // The top layer shows the calendar above the whole page, so no parent can clip it.
      this.renderer.setAttribute(container, 'popover', 'manual');
      if (!container.matches(':popover-open')) {
        container.showPopover();
      }
    } else {
      this.close();
      this.renderer.removeAttribute(container, 'popover');
    }
  }

  // Takes the calendar out of the top layer when it closes.
  close(): void {
    const container = this.container();
    if (this.inTopLayer(container) && container.matches(':popover-open')) {
      container.hidePopover();
    }
  }

  update(): void {
    const { opens, drops } = this.options();
    const container = this.container();
    // In <body> or in the top layer, the calendar is placed in viewport coordinates.
    const fixed = this.isFixed(container);
    // Set first: the width is measured in the final layout.
    this.renderer.setStyle(container, 'position', fixed ? 'fixed' : '');
    // The -10px margin from the styles assumes the in-flow position; when fixed, start right under the input.
    this.renderer.setStyle(container, 'margin-top', fixed ? '0' : '');
    // Viewport coordinates: they stay right when a parent is scrolled (issue #466).
    const input = this.element.getBoundingClientRect();
    const width = container.offsetWidth;
    // Align with the border box: clientWidth leaves out the input borders.
    let left: number;
    if (opens === 'left') {
      left = input.right - width;
    } else if (opens === 'center') {
      left = input.left + input.width / 2 - width / 2;
    } else if (opens === 'right') {
      left = input.left;
    } else {
      left = input.left + input.width / 2 - width / 2;
      if (left < 0) {
        left = input.left;
      }
    }
    // Keep the calendar inside the window (issue #542).
    const viewportWidth = this.document.documentElement.clientWidth;
    left = Math.max(0, Math.min(left, viewportWidth - width));

    const dropsUp = drops === 'up' || (drops === 'auto' && this.lacksRoomBelow(input, container));
    if (drops === 'auto') {
      // The template class says "auto": set the real direction for the opening animation.
      this.renderer[dropsUp ? 'addClass' : 'removeClass'](container, `drops-up-${opens}`);
      this.renderer[dropsUp ? 'removeClass' : 'addClass'](container, `drops-down-${opens}`);
    }

    let top: number | null = null;
    if (dropsUp) {
      top = input.top - container.offsetHeight;
    } else if (fixed) {
      top = input.bottom;
    }

    const origin = this.containerOrigin(container, fixed);
    this.renderer.setStyle(container, 'top', top === null ? 'auto' : top - origin.y + 'px');
    this.renderer.setStyle(container, 'left', left - origin.x + 'px');
    this.renderer.setStyle(container, 'right', 'auto');
  }

  // While open, follow size changes (Custom range, issue #385) and, when fixed, scrolling.
  watch(): void {
    this.unwatch();
    const view = this.document.defaultView;
    if (!this.picker.isShown || !view) {
      return;
    }
    // Outside Angular: moving the calendar needs no change detection.
    this.zone.runOutsideAngular(() => {
      const update = (): void => (this.picker.isShown ? this.update() : this.unwatch());
      if (typeof view.ResizeObserver !== 'undefined') {
        this.resizeObserver = new view.ResizeObserver(update);
        this.resizeObserver.observe(this.container());
      }
      if (this.isFixed(this.container())) {
        // Capture also catches the scroll of any parent, not only of the page.
        view.addEventListener('scroll', update, true);
        view.addEventListener('resize', update);
        this.stopWindowListeners = () => {
          view.removeEventListener('scroll', update, true);
          view.removeEventListener('resize', update);
        };
      }
    });
  }

  unwatch(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.stopWindowListeners?.();
    this.stopWindowListeners = null;
  }

  // Stops watching and removes the calendar from <body>, where Angular would not remove it.
  destroy(): void {
    this.unwatch();
    this.close();
    if (this.host.parentNode === this.document.body) {
      this.renderer.removeChild(this.document.body, this.host);
    }
  }

  private container(): HTMLElement {
    return this.picker.pickerContainer.nativeElement;
  }

  // place() sets the popover attribute only when the browser has the Popover API.
  private inTopLayer(container: HTMLElement): boolean {
    return container.hasAttribute('popover');
  }

  private isFixed(container: HTMLElement): boolean {
    return this.inTopLayer(container) || this.options().appendToBody;
  }

  // With drops="auto", open up when the calendar does not fit below the input and there is more room above (issue #136).
  private lacksRoomBelow(input: DOMRect, container: HTMLElement): boolean {
    const below = this.document.documentElement.clientHeight - input.bottom;
    return container.offsetHeight > below && input.top > below;
  }

  // Where the calendar's containing block starts, in viewport coordinates, so top and left can be converted to it.
  private containerOrigin(container: HTMLElement, fixed: boolean): { x: number; y: number } {
    if (fixed) {
      return { x: 0, y: 0 };
    }
    const view = this.document.defaultView;
    for (let parent = container.parentElement; parent; parent = parent.parentElement) {
      const style = view.getComputedStyle(parent);
      if (style.position !== 'static' || style.transform !== 'none') {
        if (parent === this.document.body || parent === this.document.documentElement) {
          break;
        }
        const rect = parent.getBoundingClientRect();
        return {
          x: rect.left + parent.clientLeft - parent.scrollLeft,
          y: rect.top + parent.clientTop - parent.scrollTop
        };
      }
    }
    // No positioned parent: the calendar is placed relative to the page.
    return { x: -view.scrollX, y: -view.scrollY };
  }
}
