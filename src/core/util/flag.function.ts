export function calcParity(a: number): boolean {
    a ^= a >> 4;
    a ^= a >> 2;
    return 0 !== ((a ^ a >> 1) & 1);
}

export function calcZero(a: number): boolean {
    return !a;
}

export function calcSign(a: number): boolean {
    return a > 127;
}
