import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationComponent } from './operation.component';
import {PipesModule} from "../../pipes/pipes.module";



@NgModule({
  declarations: [OperationComponent],
  exports: [OperationComponent],
  imports: [
    CommonModule,
    PipesModule,
  ]
})
export class OperationModule { }
