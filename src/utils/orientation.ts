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
    ISO_LEFT, ISO_RIGHT, ISO_HORIZONTAL, ISO_VERTICAL, ISO_NONE,
} from "../constants";
import {
    ORIENTATION_NOT_SPECIFIED,
} from "../errors";

export default class Orientation {
    public static fromString(orientationStr: string) {
        const parseString = (str: string) => {
            switch (str) {
                case "vertical":
                    return new Orientation(ISO_VERTICAL);
                case "horizontal":
                    return new Orientation(ISO_HORIZONTAL);
                case "left":
                    return new Orientation(ISO_LEFT);
                case "right":
                    return new Orientation(ISO_RIGHT);
                default:
                    throw new Error(ORIENTATION_NOT_SPECIFIED);
            }
        };

        const orientations = orientationStr.split("|")
            .map(str => {
                let sanitizedStr = str.trim();

                sanitizedStr = sanitizedStr.toLowerCase();
                return parseString(sanitizedStr);
            });

        if (orientations.length < 0) throw new Error(ORIENTATION_NOT_SPECIFIED);

        const result = new Orientation(ISO_NONE);

        for (const orientation of orientations) {
            result.merge(orientation);
        }

        return result;
    }

    private _val: number;

    constructor(val: number) {
        if (val < 0 || val > 0b1111) throw Error(ORIENTATION_NOT_SPECIFIED);
        this._val = val;
    }

    get isLeft() { return (this._val & ISO_LEFT) > 0; }
    get isRight() { return (this._val & ISO_RIGHT) > 0; }
    get isHorizontal() { return (this._val & ISO_HORIZONTAL) > 0; }
    get isVertical() { return (this._val & ISO_VERTICAL) > 0; }
    get isSide() { return (this._val & (ISO_LEFT + ISO_RIGHT)) > 0; }
    get isNormal() { return (this._val & (ISO_HORIZONTAL + ISO_VERTICAL)) > 0; }
    get normal() { return new Orientation(this._val & (ISO_HORIZONTAL + ISO_VERTICAL)); }
    get side() { return new Orientation(this._val & (ISO_LEFT + ISO_RIGHT)); }

    public checkMutualExclusion() {
        // Mutual exclusion test
        if ((this.isHorizontal === this.isVertical)
            || (this.isLeft === this.isRight)) {
            throw Error(ORIENTATION_NOT_SPECIFIED);
        }
    }

    public has(other: Orientation) {
        return (this._val & other._val) > 0;
    }

    public match(other: Orientation) {
        return this._val === other._val;
    }

    public merge(other: Orientation) {
        this._val = this._val | other._val;
    }
}
