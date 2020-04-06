import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegisterComponent} from './register.component';
import {CpuModule} from "../../cpu/cpu.module";
import {PipesModule} from "../../pipes/pipes.module";


@NgModule({
  declarations: [RegisterComponent],
  exports: [
    RegisterComponent
  ],
    imports: [
        CpuModule,
        CommonModule,
        PipesModule,
    ]
})
export class RegisterModule {
}
