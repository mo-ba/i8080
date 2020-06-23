import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasePipe, BytePipe} from './byte.pipe';
import {BoolPipe} from './bool.pipe';


@NgModule({
    declarations: [
        BytePipe,
        BasePipe,
        BoolPipe,
    ],
    exports: [
        BytePipe,
        BoolPipe,
        BasePipe,
    ],
    imports: [
        CommonModule
    ]
})
export class PipesModule {
}
