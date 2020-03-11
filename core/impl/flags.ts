import {IFlags} from "../interface/flags";


export const NO_FLAGS: IFlags = {
    carry: false,
    zero: false,
    sign: false,
    parity: false,
    aux: false,
};
export const SZAP_FLAGS: IFlags = {
    carry: false,
    zero: true,
    sign: true,
    parity: true,
    aux: true,
};
export const C_FLAGS: IFlags = {
    carry: true,
    zero: false,
    sign: false,
    parity: false,
    aux: false,
};
export const ALL_FLAGS: IFlags = {
    carry: true,
    zero: true,
    sign: true,
    parity: true,
    aux: true,
};
