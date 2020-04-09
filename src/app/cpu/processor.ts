import {Injectable} from "@angular/core";
import {IProcessor} from "../../core/interface";
import {Clock} from "./clock";


@Injectable()
export class ObservableProcessor implements IProcessor {


    constructor(
        private instance: IProcessor,
        private clock: Clock,
    ) {
        clock.observable().subscribe(_ => {

            if (this.getStopped()) {
                clock.pause();
            }else{
                this.next()
            }
        })
    }

    getStopped(): boolean {
        return this.instance.getStopped();
    }

    next(): void {
        return this.instance.next();
    }
}
