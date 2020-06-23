import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MemoryComponent} from './memory.component';
import {MemoryPageModule} from './memory-page/memory-page.module';
import {CpuModule} from '../../cpu/cpu.module';


@NgModule({
    declarations: [MemoryComponent],
    imports: [
        CommonModule,
        MemoryPageModule,
        CpuModule,
    ],
    exports: [MemoryComponent],
})
export class MemoryModule {
}
