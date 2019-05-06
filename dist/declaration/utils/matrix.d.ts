export default class Matrix3x3 {
    static readonly ZERO: Matrix3x3;
    static readonly ONE: Matrix3x3;
    private _values;
    readonly values: number[];
    constructor(values: number[]);
    mul(other: Matrix3x3): this;
    rotateX(degree: number): void;
    rotateY(degree: number): void;
    rotateZ(degree: number): void;
    scale(props?: {
        x: number;
        y: number;
        z: number;
    }): void;
    toString4x4(): string;
    match(other: Matrix3x3): boolean;
    private _multiply3x3(other);
    private _degToRad(degree);
}
