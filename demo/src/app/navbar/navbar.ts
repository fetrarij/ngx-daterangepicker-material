import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { StyleManager } from '../style-manager';
import { ThemePickerModule } from '../theme-picker/theme-picker';
import { ThemeStorage } from '../theme-picker/theme-storage/theme-storage';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.html',
    styleUrls: ['./navbar.scss'],
})
export class NavBar {}

@NgModule({
    imports: [CommonModule, HttpClientModule, MatButtonModule, MatMenuModule, RouterModule, ThemePickerModule],
    exports: [NavBar],
    declarations: [NavBar],
    providers: [StyleManager, ThemeStorage],
})
export class NavBarModule {}
