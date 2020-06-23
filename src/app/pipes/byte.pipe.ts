import {Pipe, PipeTransform} from '@angular/core';
import {BYTE_MAX} from '../../core/util';

function pad(str: string, length: number, char: string) {
    return str.length < length ? (char.repeat(length - str.length)) + str : str;
}

@Pipe({
    name: 'byte'
})
export class BytePipe implements PipeTransform {

    transform(value: number, base?: number): number {
        // tslint:disable-next-line:no-bitwise
        return value & BYTE_MAX;
    }
}

@Pipe({
    name: 'base'
})
export class BasePipe implements PipeTransform {

    transform(value: number, base?: number): string {
        switch (base) {
            case 2:
                return pad(value.toString(base), 8, '0');
            case 8:
                return pad(value.toString(base), 3, '0');
            case 10:
                return pad(value.toString(base), 3, '0');
            case 16:
                return pad(value.toString(base), 2, '0');
            default:
                return value.toString();
        }

    }

}
