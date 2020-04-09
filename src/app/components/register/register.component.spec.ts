import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterComponent} from './register.component';
import {CpuModule} from "../../cpu/cpu.module";
import {TOKEN} from "../../cpu/tokens";
import {IRegister, REGISTER} from "../../../core/interface";
import {PipesModule} from "../../pipes/pipes.module";
import {ControlModule} from "../control/control.module";

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let register: IRegister;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [
                CpuModule,
                PipesModule,
                ControlModule,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        register = TestBed.get(TOKEN.REGISTER);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();

        register.store(REGISTER.D, 42)
    });
});
