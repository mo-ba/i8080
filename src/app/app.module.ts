import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CpuModule} from "./cpu/cpu.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CpuModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
