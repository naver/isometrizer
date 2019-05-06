import Orientation from "./orientation";
export default class Transform {
    private _rotationDegree;
    private _matrix;
    private _float;
    constructor(orientation: Orientation, parentOrientation: Orientation);
    readonly changed: boolean;
    rotateTo(props: {
        normal: number;
        side: number;
    }): void;
    toString(): string;
    setScale(val: number): void;
    setFloat(val: number): void;
    reset(): void;
    private _calcRotationDegree(orientation, parentOrientation);
}
