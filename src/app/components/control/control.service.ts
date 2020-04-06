import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable()
export class ControlService {

    private base$ = new BehaviorSubject<number>(16)
    private reset$ = new Subject<void>()

    constructor() {
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
}
