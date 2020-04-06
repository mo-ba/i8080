import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ControlService} from "./control.service";
import {Observable} from "rxjs";

import * as icon from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent implements OnInit {

  faPlay = icon.faPlay
  faPause = icon.faPause
  faRedo = icon.faRedo
  faStepForward = icon.faStepForward

  faForward = icon.faForward
  faBackward = icon.faBackward

  bytes = [2, 10, 16];

  constructor(private controlService: ControlService) { }

  getBase():Observable<number>{
    return this.controlService.getBase()
  }
  ngOnInit() {
  }


  onByte(base: number) {
    this.controlService.setBase(base)
  }

  onReset() {
    this.controlService.reset()
  }
}
