import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MemoryPageComponent} from './memory-page.component';
import {CpuModule} from "../../../cpu/cpu.module";
import {PipesModule} from "../../../pipes/pipes.module";


@NgModule({
  declarations: [MemoryPageComponent],
  exports: [
    MemoryPageComponent
  ],
  imports: [
    CommonModule,
    CpuModule,
    PipesModule,
  ]
})
export class MemoryPageModule {
}
