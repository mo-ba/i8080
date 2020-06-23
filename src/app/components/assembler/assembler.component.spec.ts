import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AssemblerComponent} from './assembler.component';
import {CpuModule} from '../../cpu/cpu.module';
import {PipesModule} from '../../pipes/pipes.module';

describe('AssemblerComponent', () => {
    let component: AssemblerComponent;
    let fixture: ComponentFixture<AssemblerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssemblerComponent],
            imports: [
                CpuModule,
                PipesModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssemblerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
