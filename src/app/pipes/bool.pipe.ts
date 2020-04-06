import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bool'
})
export class BoolPipe implements PipeTransform {

    transform(value: boolean, ...args: any[]): number {
        return value ? 1 : 0;
    }

}
