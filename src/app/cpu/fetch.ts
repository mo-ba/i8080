import {Injectable} from "@angular/core";
import {IFetch} from "../../core/interface/fetch";
import {IWord} from "../../core/interface";


@Injectable()
export class ObservableFetch implements IFetch {


    constructor(private instance: IFetch) {

    }

    fetch(): number {
        return this.instance.fetch();
    }

    fetchWord(): IWord {
        return this.instance.fetchWord();
    }
}
