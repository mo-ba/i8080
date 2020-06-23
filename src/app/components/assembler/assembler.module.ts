import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssemblerComponent} from './assembler.component';
import {MonacoEditorModule} from 'ngx-monaco-editor';
import {FormsModule} from '@angular/forms';
import {CpuModule} from '../../cpu/cpu.module';
import {PipesModule} from '../../pipes/pipes.module';


@NgModule({
    declarations: [
        AssemblerComponent,
    ],
    exports: [
        AssemblerComponent,
    ],
    imports: [
        CommonModule,
        MonacoEditorModule,
        FormsModule,
        CpuModule,
        PipesModule,
    ]
})
export class AssemblerModule {
}
