export declare const getElement: (queryOrElement: string | HTMLElement) => HTMLElement;
export declare const setWrapperSize: (element: HTMLElement, wrapper: HTMLElement) => void;
export declare const wrapElement: (element: HTMLElement, isLeaf?: boolean) => HTMLElement;
export interface ArrayLike<T> {
    length: number;
    [index: number]: T;
}
export declare function toArray<T>(iterable: ArrayLike<T>): T[];
