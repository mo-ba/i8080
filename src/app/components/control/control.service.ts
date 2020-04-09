import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable()
export class ControlService {

    private base$ = new BehaviorSubject<number>(16);
    private reset$ = new Subject<void>();
    private stepForward$ = new Subject<void>();
    private play$ = new BehaviorSubject<boolean>(false);

    private interval = [5, 10, 20, 50, 100, 200, 400, 500, 500, 600, 700, 800, 900, 1000, 1250, 1500, 1750, 2000];

    private intervalIndex = Math.floor(this.interval.length / 2);

    private interval$ = new BehaviorSubject<number>(this.interval[this.intervalIndex]);

    constructor() {
    }

    faster() {
        this.intervalIndex = Math.max(0, Math.min(this.interval.length, --this.intervalIndex));
        this.interval$.next(this.interval[this.intervalIndex])
    }

    slower() {
        this.intervalIndex = Math.max(0, Math.min(this.interval.length, ++this.intervalIndex));
        this.interval$.next(this.interval[this.intervalIndex])
    }

    getInterval(): Observable<number> {
        return this.interval$.asObservable();
    }

    setBase(base: number) {
        this.base$.next(base);
    }

    getBase(): Observable<number> {
        return this.base$.asObservable();
    }

    reset() {
        this.reset$.next();
    }

    getReset(): Observable<void> {
        return this.reset$.asObservable();
    }

    stepForward() {
        this.stepForward$.next();
    }

    getStepForward(): Observable<void> {
        return this.stepForward$.asObservable();
    }

    play(play: boolean) {
        this.play$.next(play);
    }

    getPlay(): Observable<boolean> {
        return this.play$.asObservable();
    }
}
