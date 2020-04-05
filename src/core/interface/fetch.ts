import {IWord} from "./word";

export interface IFetch {
    fetch(): number;

    fetchWord(): IWord;
}
