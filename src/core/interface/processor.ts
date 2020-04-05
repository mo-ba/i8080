export interface IProcessor {
    next(): void;

    getStopped(): boolean;
}
