import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BytePipe} from "./byte.pipe";
import { BoolPipe } from './bool.pipe';


@NgModule({
    declarations: [
        BytePipe,
        BoolPipe,
    ],
    exports: [
        BytePipe,
        BoolPipe,
    ],
    imports: [
        CommonModule
    ]
})
export class PipesModule {
}
