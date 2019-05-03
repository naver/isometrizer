/*
Copyright 2019-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import Matrix3x3 from "./matrix";
import {
    VECTOR_OPERAND_NOT_VALIDATED,
    VECTOR_PROPERTY_NOT_PROVIDED,
} from "../errors";

export default class Vector3 {
    static get ONE() { return new Vector3(1, 1, 1); }
    static get ZERO() { return new Vector3(0, 0, 0); }

    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        if (
            !(typeof x === "number" && !isNaN(x)) ||
            !(typeof y === "number" && !isNaN(y)) ||
            !(typeof z === "number" && !isNaN(z))
        ) throw Error(VECTOR_PROPERTY_NOT_PROVIDED);
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public add(other: Vector3) {
        if (other instanceof Vector3) {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        } else {
            throw new Error(VECTOR_OPERAND_NOT_VALIDATED);
        }
        return this;
    }

    public mul(other: Vector3 | Matrix3x3) {
        if (other instanceof Vector3) {
            return this.x * other.x + this.y * other.y + this.z * other.z;
        } else if (other instanceof Matrix3x3) {
            const origVals = [this.x, this.y, this.z];

            this.x = origVals[0] * other.values[0] +
                origVals[1] * other.values[1] +
                origVals[2] * other.values[2];
            this.y = origVals[0] * other.values[3] +
                origVals[1] * other.values[4] +
                origVals[2] * other.values[5];
            this.z = origVals[0] * other.values[6] +
                origVals[1] * other.values[7] +
                origVals[2] * other.values[8];
        } else if (typeof other === "number" && !isNaN(other)) {
            this.x *= other;
            this.y *= other;
            this.z *= other;
        } else {
            throw new Error(VECTOR_OPERAND_NOT_VALIDATED);
        }
        return this;
    }
}
