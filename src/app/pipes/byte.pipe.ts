import {Pipe, PipeTransform} from '@angular/core';
import {BYTE_MAX} from "../../core/util";

function pad(string: string, length: number, char: string) {
    return string.length < length ? char.repeat(length - string.length) + string : string
}

@Pipe({
    name: 'byte'
})
export class BytePipe implements PipeTransform {

    transform(value: number, base?: number): string {
        const val = value & BYTE_MAX
        switch (base) {
            case 2:
                return pad(val.toString(base), 8, '0')
            case 8:
                return pad(val.toString(base), 3, '0')
            case 10:
                return pad(val.toString(base), 3, '0')
            case 16:
                return pad(val.toString(base), 2, '0')
            default:
                return val.toString();
        }

    }

}
