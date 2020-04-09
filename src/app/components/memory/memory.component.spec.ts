import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MemoryComponent} from './memory.component';
import {MemoryPageModule} from "./memory-page/memory-page.module";
import {CpuModule} from "../../cpu/cpu.module";
import {ControlModule} from "../control/control.module";

describe('MemoryComponent', () => {
    let component: MemoryComponent;
    let fixture: ComponentFixture<MemoryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MemoryComponent],
            imports: [
                MemoryPageModule,
                CpuModule,
                ControlModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MemoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
