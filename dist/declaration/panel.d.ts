import Orientation from "./utils/orientation";
export default class Panel {
    private _element;
    private _length;
    private _maxLength;
    private _orientation;
    private _rotation;
    private _offset;
    constructor(target: HTMLElement, maxLength: number, orientation: Orientation);
    readonly offset: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    background: string;
    progress(float: number, scale: number, targetOrientation: Orientation): void;
    update(): void;
}
