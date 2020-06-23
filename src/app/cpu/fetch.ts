import {Inject, Injectable} from '@angular/core';
import {IFetch} from '../../core/interface/fetch';
import {IWord} from '../../core/interface';
import {TOKEN} from './tokens';


@Injectable()
export class ObservableFetch implements IFetch {


    constructor(
        @Inject(TOKEN.ABSTRACT.FETCH) private instance: IFetch
    ) {

    }

    fetch(): number {
        return this.instance.fetch();
    }

    fetchWord(): IWord {
        return this.instance.fetchWord();
    }
}
