import {Component, Inject} from '@angular/core';
import {TOKEN} from "./cpu/tokens";
import {IDecode, IExecute, IMemory, IProcessor, IRegister} from "../core/interface";
import {IFetch} from "../core/interface/fetch";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'i8080';

    constructor(
        @Inject(TOKEN.REGISTER) private register: IRegister,
        @Inject(TOKEN.MEMORY) private memory: IMemory,
        @Inject(TOKEN.FETCH) private fetch: IFetch,
        @Inject(TOKEN.DECODE) private decode: IDecode,
        @Inject(TOKEN.EXECUTE) private execute: IExecute,
        @Inject(TOKEN.PROCESSOR) private processor: IProcessor,
    ) {
        console.log(register)
        console.log(memory)
        console.log(fetch)
        console.log(decode)
        console.log(execute)
        console.log(processor)
    }

}
