import {Subject} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class Clock {

    private subject$ = new Subject<void>();
    private paused = false;


    private intervalTime = 100000
    private handle: any;


    constructor() {
        this.setPulse();
    }


    setIntervalTime(value: number) {
        console.log('setIntervalTime')
        this.intervalTime = value;
        if(!this.paused){
            this.setPulse()
        }
    }

    setPulse() {
        console.log('setPulse')
        clearInterval(this.handle);
        this.handle = setInterval(() => {
            this.subject$.next()
        }, this.intervalTime)

    }

    observable() {
        return this.subject$.asObservable()
    }

    pause() {
        clearInterval(this.handle)
        this.paused = true
    }

    continue() {
        this.paused = false
        this.setPulse();
    }

    tick() {
        if (this.paused) {
            this.subject$.next()
        }
    }
}
