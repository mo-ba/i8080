import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlComponent} from './control.component';
import {ControlService} from "./control.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
    declarations: [ControlComponent],
    exports: [
        ControlComponent
    ],
    providers: [ControlService],
    imports: [
        CommonModule,
        FontAwesomeModule,
    ]
})
export class ControlModule {
}
