import {Component, Inject, Input, OnInit, Renderer2} from '@angular/core';
import {TOKEN} from '../../../cpu/tokens';
import {Observable} from 'rxjs';
import {IMemory} from '../../../../core/interface';


@Component({
    selector: 'app-memory-page',
    templateUrl: './memory-page.component.html',
    styleUrls: ['./memory-page.component.scss']
})
export class MemoryPageComponent implements OnInit {


    @Input() page: number = 0;
    @Input() highlight: number = 0;
    @Input() byte: number = 16;

    memoryStatus: Array<Int8Array> = [];


    constructor(
        private renderer2: Renderer2,
        @Inject(TOKEN.OBSERVABLE.MEMORY) private memoryObs: Observable<Array<Int8Array>>,
        @Inject(TOKEN.MEMORY) private memory: IMemory,
    ) {
    }

    range(len) {
        return new Array(len).fill(null).map((_, i) => i);
    }

    ngOnInit() {
        this.memoryObs.subscribe(status => {
            this.memoryStatus = status;
        });
    }

    toByte(high: number, low: number): number {
        return low + (high << this.highShift());
    };

    getPage(): Int8Array {
        return this.memoryStatus ? this.memoryStatus[this.page] : new Int8Array();
    }

    content(high: number, low: number): number {
        const page = this.getPage();
        return page ? page[this.toByte(high, low)] : 0;
    }

    lowRange() {
        switch (this.byte) {
            case 2:
                return this.range(4);
            case 10:
                return this.range(8);
            default:
                return this.range(16);
        }
    }

    highRange() {
        switch (this.byte) {
            case 2:
                return this.range(64);
            case 10:
                return this.range(32);
            default:
                return this.range(16);
        }
    }


    highShift(): number {
        switch (this.byte) {
            case 2:
                return 2;
            case 10:
                return 3;
            default:
                return 4;
        }
    }


}
