import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AssemblerComponent} from "./assembler.component";



@NgModule({
  declarations: [
    AssemblerComponent,
  ],
  exports: [
    AssemblerComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class AssemblerModule { }
