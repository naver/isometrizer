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
import {
    MATRIX_VALUE_NOT_PROVIDED,
    MATRIX_SHOULD_MUTIPLIED_WITH_OTHER_MATRIX,
} from "../errors";

const MATRIX_SIDE = 3;
const MATRIX_SIZE = 9;

// This class supposes that scale and traslation is already applied
export default class Matrix3x3 {
    static get ZERO() {
        return new Matrix3x3([
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ]);
    }

    static get ONE() {
        return new Matrix3x3([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]);
    }

    private _values: number[];

    get values() { return this._values; }

    constructor(values: number[]) {
        if (!values) throw new Error(MATRIX_VALUE_NOT_PROVIDED);
        if (!values.length) throw new Error(MATRIX_VALUE_NOT_PROVIDED);
        if (values.length !== MATRIX_SIZE) throw new Error(MATRIX_VALUE_NOT_PROVIDED);

        this._values = values;
    }

    public mul(other: Matrix3x3) {
        if (other instanceof Matrix3x3) {
            this._multiply3x3(other);
        } else {
            throw new Error(MATRIX_SHOULD_MUTIPLIED_WITH_OTHER_MATRIX);
        }
        return this;
    }

    public rotateX(degree: number) {
        const rad = this._degToRad(degree);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const rotateMatrix = new Matrix3x3([
            1, 0, 0,
            0, cos, -sin,
            0, sin, cos,
        ]);

        this.mul(rotateMatrix);
    }

    public rotateY(degree: number) {
        const rad = this._degToRad(degree);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const rotateMatrix = new Matrix3x3([
            cos, 0, sin,
            0, 1, 0,
            -sin, 0, cos,
        ]);

        this.mul(rotateMatrix);
    }

    public rotateZ(degree: number) {
        const rad = this._degToRad(degree);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const rotateMatrix = new Matrix3x3([
            cos, -sin, 0,
            sin, cos, 0,
            0, 0, 1,
        ]);

        this.mul(rotateMatrix);
    }

    public scale(props = {x: 1, y: 1, z: 1}) {
        const scaleX = props.x || 1;
        const scaleY = props.y || 1;
        const scaleZ = props.z || 1;

        this._values[0] *= scaleX;
        this._values[4] *= scaleY;
        this._values[8] *= scaleZ;
    }

    public toString4x4() {
        const values = [
            this._values[0], this._values[3], this._values[6],
            this._values[1], this._values[4], this._values[7],
            this._values[2], this._values[5], this._values[8],
        ];

        const v = values.map((value: number) => value.toFixed(4));

        return `${v[0]}, ${v[1]}, ${v[2]}, 0, ${v[3]}, ${v[4]}, ${v[5]}, 0, ${v[6]}, ${v[7]}, ${v[8]}, 0, 0, 0, 0, 1`;
    }

    // Check deep equality
    public match(other: Matrix3x3) {
        let flag = true;

        for (let i = 0; i < this._values.length; i += 1) {
            if (this._values[i] !== other._values[i]) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    // other * this
    private _multiply3x3(other: Matrix3x3) {
        const result = Matrix3x3.ZERO;

        for (let i = 0; i < MATRIX_SIZE; i += 1) {
            const rowNum = Math.floor(i / MATRIX_SIDE);
            const colNum = i % MATRIX_SIDE;

            for (let j = 0; j < MATRIX_SIDE; j += 1) {
                const indexThis = j * MATRIX_SIDE + colNum;
                const indexOther = rowNum * MATRIX_SIDE + j;

                result.values[i] += this._values[indexThis] * other._values[indexOther];
            }
        }
        this._values = result.values;
    }

    private _degToRad(degree: number) {
        return degree * Math.PI / 180;
    }
}
