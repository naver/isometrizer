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
    SQRT_3,
} from "./constants";
import Orientation from "./utils/orientation";

export default class Panel {
    private _element: HTMLElement;

    private _length: number;
    private _maxLength: number;
    private _orientation: Orientation;
    private _rotation: string;
    private _offset: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };

    constructor(target: HTMLElement, maxLength: number, orientation: Orientation) {
        this._length = 0;
        this._maxLength = maxLength;
        this._orientation = orientation;

        target.style.transformStyle = "preserve-3d";

        this._element = document.createElement("div");
        this._element.style.position = "absolute";
        this._element.style.backfaceVisibility = "hidden";

        if (this._orientation.isHorizontal) {
            this._element.style.width = "100%";
            this._element.style.height = `${this._maxLength}px`;
        } else {
            this._element.style.width = `${this._maxLength}px`;
            this._element.style.height = "100%";
        }

        if (this._orientation.isHorizontal && this._orientation.isRight) {
            this._element.style.bottom = "0";
        } else {
            this._element.style.top = "0";
        }

        if (this._orientation.isVertical && this._orientation.isRight) {
            this._element.style.right = "0";
        } else {
            this._element.style.left = "0";
        }

        let xOrigin = 50;
        let yOrigin = 50;

        if (this._orientation.isHorizontal) {
            yOrigin = this._orientation.isLeft ? 0 : 100;
            this._rotation = this._orientation.isLeft ? "rotateX(90deg)" : "rotateX(-90deg)";
        } else {
            xOrigin = this._orientation.isLeft ? 0 : 100;
            this._rotation = this._orientation.isLeft ? "rotateY(-90deg)" : "rotateY(90deg)";
        }

        this._element.style.transformOrigin = `${xOrigin}% ${yOrigin}%`;

        target.appendChild(this._element);

        // space offset
        this._offset = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    }

    get offset() { return this._offset; }

    set background(val: string) { this._element.style.background = val; }

    public progress(float: number, scale: number, targetOrientation: Orientation): void {
        this._length = Number((float * this._maxLength).toFixed(4));

        const rotationModificator = 324.48 / 400;
        const length = this._length * scale * rotationModificator;

        // 옆면 추가로 인한 공간 차지 Offset 보강
        if (targetOrientation.isHorizontal) {
            this._offset.bottom = length;
        } else {
            this._offset.top = length / 2;
            this._offset.left = targetOrientation.isRight ? SQRT_3 * length / 2 : 0;
            this._offset.right = targetOrientation.isLeft ? SQRT_3 * length / 2 : 0;
        }
    }

    public update(): void {
        let scaleX = 1;
        let scaleY = 1;

        if (this._orientation.isVertical) {
            scaleX = this._length / this._maxLength;
        } else {
            scaleY = this._length / this._maxLength;
        }

        this._element.style.transform = `translateZ(${-this._length}px) ${this._rotation} scale(${scaleX}, ${scaleY})`;
    }
}
