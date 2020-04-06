import {Component, Inject, OnInit} from '@angular/core';
import {TOKEN} from "../../cpu/tokens";
import {Observable} from "rxjs";
import {RegisterStatus} from "../../cpu/register";
import {IWord, REGISTER} from "../../../core/interface";
import {highLow} from "../../../core/util";
import {ControlService} from "../control/control.service";

@Component({
    selector: 'app-memory',
    templateUrl: './memory.component.html',
    styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit {
    registerStatus: RegisterStatus;
    memoryStatus: Array<Int8Array>;


    activeTab: string = 'program'
    public base: number;

    constructor(
        private controlService: ControlService,
        @Inject(TOKEN.OBSERVABLE.MEMORY) private memoryObs: Observable<Array<Int8Array>>,
        @Inject(TOKEN.OBSERVABLE.REGISTER) private registerObs: Observable<RegisterStatus>
    ) {
    }


    ngOnInit() {
        this.registerObs.subscribe(status => {
            this.registerStatus = status
        });
        this.memoryObs.subscribe(status => {
            this.memoryStatus = status
        });

        return this.controlService.getBase().subscribe(base =>
            this.base = base
        )
    }


    get hl(): IWord {
        return highLow(this.registerStatus[REGISTER.H], this.registerStatus[REGISTER.L])
    }

    onTabClick(name: string) {
        this.activeTab = name;
    }
}
