import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CpuModule} from "./cpu/cpu.module";
import {RegisterModule} from "./components/register/register.module";
import {MemoryModule} from "./components/memory/memory.module";
import {ControlModule} from "./components/control/control.module";
import {OperationModule} from "./components/operation/operation.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        CpuModule,
        RegisterModule,
        MemoryModule,
        ControlModule,
        OperationModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
