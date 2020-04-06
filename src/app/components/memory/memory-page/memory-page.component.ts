import {
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {TOKEN} from "../../../cpu/tokens";
import {Observable} from "rxjs";
import {IMemory} from "../../../../core/interface";
import {toHighLow} from "../../../../core/util";


@Component({
    selector: 'app-memory-page',
    templateUrl: './memory-page.component.html',
    styleUrls: ['./memory-page.component.scss']
})
export class MemoryPageComponent implements OnInit {


    @Input() page: number = 0
    @Input() highlight: number = 0
    @Input() byte: number = 16
    memoryStatus: Array<Int8Array> = [];

    @ViewChild('table', {static: false})
    table: ElementRef<HTMLElement>

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
            this.memoryStatus = status
        });
    }

    toByte(high: number, low: number): number {
        return low + (high << this.highShift())
    };

    content(high: number, low: number) {
        return this.memoryStatus[this.page][this.toByte(high, low)]
    }

    lowRange() {
        switch (this.byte) {
            case 2:
                return this.range(4)
            case 10:
                return this.range(8)
            default:
                return this.range(16)
        }
    }

    highRange() {
        switch (this.byte) {
            case 2:
                return this.range(64)
            case 10:
                return this.range(32)
            default:
                return this.range(16)
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
