import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AssemblerComponent} from './assembler.component';

import {FormsModule} from '@angular/forms';
import {CpuModule} from '../../cpu/cpu.module';
import {PipesModule} from '../../pipes/pipes.module';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';


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
