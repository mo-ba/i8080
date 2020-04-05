import {HighLow} from "./register";

export interface IFetch {
    fetch(): number;

    fetchWord(): HighLow;
}
