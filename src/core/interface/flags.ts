export interface IFlags {
    readonly  carry: boolean;
    readonly zero: boolean;
    readonly sign: boolean;
    readonly parity: boolean;
    readonly aux: boolean;
}

export const NO_FLAGS: IFlags = {
    carry: false,
    zero: false,
    sign: false,
    parity: false,
    aux: false,
};
