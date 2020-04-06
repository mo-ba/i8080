import {Component, Inject, OnInit} from '@angular/core';
import {TOKEN} from "../../cpu/tokens";
import {Observable} from "rxjs";
import {RegisterStatus} from "../../cpu/register";
import {IRegister, REGISTER} from "../../../core/interface";
import {toHighLow} from "../../../core/util";
import {ControlService} from "../control/control.service";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    status: RegisterStatus;
    REGISTER = REGISTER;
    base: number = 16;

    constructor(
        private controlService: ControlService,
        @Inject(TOKEN.OBSERVABLE.REGISTER) private registerObs: Observable<RegisterStatus>,
        @Inject(TOKEN.REGISTER) private register: IRegister,
    ) {
    }

    ngOnInit() {
        this.registerObs.subscribe(status => {
            this.status = status
        });

        this.controlService.getBase().subscribe(base =>
            this.base = base
        )
        this.controlService.getReset().subscribe(() => {
                this.register.setProgramCounter(toHighLow(0));
                this.register.setStackPointer(toHighLow(0xffff));
                this.register.storeX(REGISTER.B, toHighLow(0));
                this.register.storeX(REGISTER.D, toHighLow(0));
                this.register.storeX(REGISTER.H, toHighLow(0));
                this.register.storeX(REGISTER.PSW, toHighLow(0));
                this.register.setStopped(false);
            }
        )


    }

}
