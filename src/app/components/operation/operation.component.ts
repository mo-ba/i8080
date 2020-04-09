import {Component, Inject, OnInit} from '@angular/core';
import {TOKEN} from "../../cpu/tokens";
import {Observable} from "rxjs";
import {OperationT} from "../../../core/interface/operation";
import {REGISTER} from "../../../core/interface";
import {ControlService} from "../control/control.service";

export class RingBuffer<T> extends Array<T> {
    constructor(size: number) {
        super();
        this._size = size;
    }

    private _size: number;

    public get Size(): number {
        return this._size;
    }

    private shiftBack(length: number) {
        var overwrite = (this.length + length) - this.Size;

        if (overwrite > 0) {
            super.splice(0, overwrite);
        }
    }

    private shiftFor(length: number) {
        var overwrite = (this.length + length) - this.Size;

        if (overwrite > 0) {
            var startAt = this.length - overwrite;
            super.splice(startAt, overwrite);
        }
    }

    push(...items: T[]): number {
        this.shiftBack(items.length);
        return super.push(...items);
    }

    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat<U extends T[]>(...items: U[]): T[];
    /**
     * Combines two or more arrays.
     * @param items Additional items to add to the end of array1.
     */
    concat(...items: T[]): T[] {
        this.shiftBack(items.length);
        return super.concat(items);
    }

    /**
     * Removes elements from an array and, if necessary,
     * inserts new elements in their place, returning the deleted elements.
     * @param start The zero-based location in the array from which
     * to start removing elements.
     * @param deleteCount The number of elements to remove.
     * @param items Elements to insert into the array in place of the deleted elements.
     */
    splice(start: number, deleteCount?: number, ...items: T[]): T[] {
        var removed = super.splice(start, deleteCount);
        this.push(...items);
        return removed;
    }

    /**
     * Inserts new elements at the start of an array.
     * @param items  Elements to insert at the start of the Array.
     */
    unshift(...items: T[]): number {
        this.shiftFor(items.length);
        return super.unshift(...items);
    }
}

@Component({
    selector: 'app-operation',
    templateUrl: './operation.component.html',
    styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {
    buffer = new RingBuffer<OperationT>(20)
    public base: number;

    constructor(
        private controlService: ControlService,
        @Inject(TOKEN.OBSERVABLE.DECODE) private decodeOps: Observable<OperationT>,
    ) {
    }

    ngOnInit() {
        this.decodeOps.subscribe(value => {
            this.buffer.push(value)
        })

        this.controlService.getBase().subscribe(base =>
            this.base = base
        );
        this.controlService.getReset().subscribe(play => {
            this.buffer = new RingBuffer<OperationT>(20)
        })
    }

    register(register: REGISTER) {

        const registers = [
            'B',
            'C',
            'D',
            'E',
            'H',
            'L',
            'M',
            'A',
        ];
        return registers[register];
    }

    isSet(val: any): boolean {
        return val !== undefined && val !== null
    }
}
