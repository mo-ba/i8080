import {Inject, Injectable} from '@angular/core';
import {IProcessor} from '../../core/interface';
import {Clock} from './clock';
import {TOKEN} from './tokens';


@Injectable()
export class ObservableProcessor implements IProcessor {


    constructor(
        @Inject(TOKEN.ABSTRACT.PROCESSOR) private instance: IProcessor,
        private clock: Clock,
    ) {
        clock.observable().subscribe(_ => {

            if (this.getStopped()) {
                clock.pause();
            } else {
                this.next();
            }
        });
    }

    getStopped(): boolean {
        return this.instance.getStopped();
    }

    next(): void {
        return this.instance.next();
    }
}
