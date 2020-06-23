import {Component, Inject, OnInit} from '@angular/core';
import {TOKEN} from './cpu/tokens';
import {IMemory, IProcessor} from '../core/interface';
import {toHighLow} from '../core/util';
import {ControlService} from './components/control/control.service';
import {Clock} from './cpu/clock';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'i8080';
    author = 'mb';

    activeTab = 'asm';

    constructor(
        private control: ControlService,
        private clock: Clock,
        @Inject(TOKEN.MEMORY) private memory: IMemory,
        @Inject(TOKEN.PROCESSOR) private processor: IProcessor,
    ) {
        const program = [
            // 21 * 19 = 399 = 256 + 143
            0x0e, 0x15,         // c = 21
            0x16, 0x13,         // d = 19

            //MULT:
            0x06, 0x00,         // b = 0
            0x1e, 0x09,         // e = 9


            //MULT0:
            0x79,               // a = c
            0x1f,               // rar
            0x4f,               // c = a
            0x1d,               // e--;
            0xca, 0x19, 0x00,   // if 0 -> jump DONE;
            0x78,               // a = c

            0xd2, 0x14, 0x00,   // if !0 -> jump  MULT1:
            0x82,               // a += d

            // MULT1:
            0x1f,               // rar
            0x47,               // b = a
            0xc3, 0x08, 0x00,   // jump  MULT0:

            // DONE:
            0xc5,               // PUSH B
            0x76,               // halt
        ];

        for (let i = 0; i < program.length; i++) {
            memory.store(toHighLow(i), program[i]);
        }

    }

    ngOnInit(): void {
        this.control.getReset().subscribe(play => {
            this.clock.pause();
            this.control.play(false);
        });
        this.control.getStepForward().subscribe(_ => {
            this.clock.tick();
        });
        this.control.getInterval().subscribe(interval => {
            this.clock.setIntervalTime(interval);
        });
        this.control.getPlay().subscribe(play => {
            if (play) {
                this.clock.continue();
            } else {
                this.clock.pause();
            }
        });
    }


    onTabClick(name: string) {
        this.activeTab = name;
    }
}
