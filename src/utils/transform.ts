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
import Orientation from "./orientation";
import { ISO_NONE } from "../constants";

export default class Transform {
    private _rotationDegree: {
        normal: {
            x: number; y: number; z: number;
        },
        side: {
            x: number; y: number; z: number;
        },
    };
    private _matrix: Matrix3x3;
    private _float: number;

    constructor(orientation: Orientation, parentOrientation: Orientation) {
        this._rotationDegree = this._calcRotationDegree(orientation, parentOrientation);

        // default values
        this._matrix = Matrix3x3.ONE;
        this._float = 0;
    }

    get changed() { return !(this._matrix.match(Matrix3x3.ONE) && this._float === 0); }

    public rotateTo(props: {
        normal: number;
        side: number;
    }) {
        const normal = props.normal;
        const side = props.side;

        // rotate in order of Z-Y-X
        const degreeZ = normal * this._rotationDegree.normal.z + side * this._rotationDegree.side.z;
        const degreeY = normal * this._rotationDegree.normal.y + side * this._rotationDegree.side.y;
        const degreeX = normal * this._rotationDegree.normal.x + side * this._rotationDegree.side.x;

        this._matrix.rotateZ(degreeZ);
        this._matrix.rotateY(degreeY);
        this._matrix.rotateX(degreeX);
    }

    public toString() {
        if (!this.changed) {
            return "none";
        } else {
            return `matrix3d(${this._matrix.toString4x4()}) translateZ(${this._float.toFixed(4)}px)`;
        }
    }

    public setScale(val: number) {
        this._matrix.scale({x: val, y: val, z: val});
    }

    public setFloat(val: number) {
        this._float = val;
    }

    public reset() {
        this._matrix = Matrix3x3.ONE;
    }

    private _calcRotationDegree(orientation: Orientation, parentOrientation: Orientation) {
        const rotations = {
            normal: {x: 0, y: 0, z: 0},
            side: {x: 0, y: 0, z: 0},
        };

        // Don't rotate
        if (orientation.match(new Orientation(ISO_NONE))) return rotations;

        if (parentOrientation.match(new Orientation(ISO_NONE))) {
            rotations.normal.x = orientation.isHorizontal ? 55 : -35;
            if (orientation.isVertical) {
                rotations.side.y = orientation.isLeft ? -45 : 45;
            } else {
                rotations.side.z = orientation.isLeft ? 45 : -45;
            }
        } else if (parentOrientation.isHorizontal) {
            if (orientation.isHorizontal) {
                rotations.side.z = parentOrientation.isRight ? 90 : -90;
            } else {
                rotations.normal.x = -90;
                if (!parentOrientation.side.match(orientation.side)) {
                    rotations.side.y = parentOrientation.isRight ? -90 : 90;
                }
            }
        } else if (parentOrientation.isVertical) {
            if (orientation.isVertical) {
                rotations.side.y = parentOrientation.isRight ? -90 : 90;
            } else {
                rotations.normal.x = 90;
                if (!parentOrientation.side.match(orientation.side)) {
                    rotations.side.z = parentOrientation.isRight ? 90 : -90;
                }
            }
        }

        return rotations;
    }
}
