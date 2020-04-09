import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {CpuModule} from "./cpu/cpu.module";
import {RegisterModule} from "./components/register/register.module";
import {MemoryModule} from "./components/memory/memory.module";
import {ControlModule} from "./components/control/control.module";
import {OperationModule} from "./components/operation/operation.module";

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [
                CpuModule,
                RegisterModule,
                MemoryModule,
                ControlModule,
                OperationModule,
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'i8080'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('i8080');
    });

    it('should render title', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('i8080');
    });
});
