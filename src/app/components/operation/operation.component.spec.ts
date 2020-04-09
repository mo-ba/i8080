import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationComponent} from './operation.component';
import {PipesModule} from "../../pipes/pipes.module";
import {CpuModule} from "../../cpu/cpu.module";
import {ControlModule} from "../control/control.module";

describe('OperationComponent', () => {
    let component: OperationComponent;
    let fixture: ComponentFixture<OperationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OperationComponent],
            imports: [
                PipesModule,
                CpuModule,
                ControlModule,
            ]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OperationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
