import Matrix3x3 from "./matrix";
export default class Vector3 {
    static readonly ONE: Vector3;
    static readonly ZERO: Vector3;
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    add(other: Vector3): this;
    mul(other: Vector3 | Matrix3x3): number | this;
}
