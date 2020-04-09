import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlComponent } from './control.component';
import {PipesModule} from "../../pipes/pipes.module";
import {CpuModule} from "../../cpu/cpu.module";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {ControlService} from "./control.service";

describe('ControlComponent', () => {
  let component: ControlComponent;
  let fixture: ComponentFixture<ControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlComponent ],
      providers: [
          ControlService,
      ],
      imports: [
          FontAwesomeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
