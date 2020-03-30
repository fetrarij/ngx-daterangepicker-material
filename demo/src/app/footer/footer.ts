import { Component, NgModule } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.html',
    styleUrls: ['./footer.scss'],
})
export class Footer {
    version = environment.version;
}

@NgModule({
    exports: [Footer],
    declarations: [Footer],
})
export class FooterModule {}
