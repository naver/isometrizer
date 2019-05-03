/*
Copyright (c) 2019-present NAVER Corp.
isometrizer JavaScript library
isometrizer project is licensed under the MIT license


@version 0.0.1
All-in-one packaged file for ease use of 'isometrizer' with below dependencies.
- 
NOTE: This is not an official distribution file and is only for user convenience.

*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Isometrizer = factory());
}(this, function () { 'use strict';

    var SELECTOR_NOT_SPECIFIED = "Element selector is not specified";
    var ORIENTATION_NOT_SPECIFIED = "Orientation is not correctly specified for Isometrizer";
    var MATRIX_VALUE_NOT_PROVIDED = "Values for matrix is not provided";
    var MATRIX_SHOULD_MUTIPLIED_WITH_OTHER_MATRIX = "Multiplyee for matrix should be another matrix";

    var MATRIX_SIDE = 3;
    var MATRIX_SIZE = 9;

    var Matrix3x3 = function () {
      function Matrix3x3(values) {
        if (!values) throw new Error(MATRIX_VALUE_NOT_PROVIDED);
        if (!values.length) throw new Error(MATRIX_VALUE_NOT_PROVIDED);
        if (values.length !== MATRIX_SIZE) throw new Error(MATRIX_VALUE_NOT_PROVIDED);
        this._values = values;
      }

      var __proto = Matrix3x3.prototype;
      Object.defineProperty(Matrix3x3, "ZERO", {
        get: function () {
          return new Matrix3x3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Matrix3x3, "ONE", {
        get: function () {
          return new Matrix3x3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "values", {
        get: function () {
          return this._values;
        },
        enumerable: true,
        configurable: true
      });

      __proto.mul = function (other) {
        if (other instanceof Matrix3x3) {
          this._multiply3x3(other);
        } else {
          throw new Error(MATRIX_SHOULD_MUTIPLIED_WITH_OTHER_MATRIX);
        }

        return this;
      };

      __proto.rotateX = function (degree) {
        var rad = this._degToRad(degree);

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var rotateMatrix = new Matrix3x3([1, 0, 0, 0, cos, -sin, 0, sin, cos]);
        this.mul(rotateMatrix);
      };

      __proto.rotateY = function (degree) {
        var rad = this._degToRad(degree);

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var rotateMatrix = new Matrix3x3([cos, 0, sin, 0, 1, 0, -sin, 0, cos]);
        this.mul(rotateMatrix);
      };

      __proto.rotateZ = function (degree) {
        var rad = this._degToRad(degree);

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var rotateMatrix = new Matrix3x3([cos, -sin, 0, sin, cos, 0, 0, 0, 1]);
        this.mul(rotateMatrix);
      };

      __proto.scale = function (props) {
        if (props === void 0) {
          props = {
            x: 1,
            y: 1,
            z: 1
          };
        }

        var scaleX = props.x || 1;
        var scaleY = props.y || 1;
        var scaleZ = props.z || 1;
        this._values[0] *= scaleX;
        this._values[4] *= scaleY;
        this._values[8] *= scaleZ;
      };

      __proto.toString4x4 = function () {
        var values = [this._values[0], this._values[3], this._values[6], this._values[1], this._values[4], this._values[7], this._values[2], this._values[5], this._values[8]];
        var v = values.map(function (value) {
          return value.toFixed(4);
        });
        return v[0] + ", " + v[1] + ", " + v[2] + ", 0, " + v[3] + ", " + v[4] + ", " + v[5] + ", 0, " + v[6] + ", " + v[7] + ", " + v[8] + ", 0, 0, 0, 0, 1";
      };

      __proto.match = function (other) {
        var flag = true;

        for (var i = 0; i < this._values.length; i += 1) {
          if (this._values[i] !== other._values[i]) {
            flag = false;
            break;
          }
        }

        return flag;
      };

      __proto._multiply3x3 = function (other) {
        var result = Matrix3x3.ZERO;

        for (var i = 0; i < MATRIX_SIZE; i += 1) {
          var rowNum = Math.floor(i / MATRIX_SIDE);
          var colNum = i % MATRIX_SIDE;

          for (var j = 0; j < MATRIX_SIDE; j += 1) {
            var indexThis = j * MATRIX_SIDE + colNum;
            var indexOther = rowNum * MATRIX_SIDE + j;
            result.values[i] += this._values[indexThis] * other._values[indexOther];
          }
        }

        this._values = result.values;
      };

      __proto._degToRad = function (degree) {
        return degree * Math.PI / 180;
      };

      return Matrix3x3;
    }();

    var SQRT_2 = Math.sqrt(2);
    var SQRT_3 = Math.sqrt(3);
    var ISO_NONE = 0;
    var ISO_LEFT = 1;
    var ISO_RIGHT = 2;
    var ISO_VERTICAL = 4;
    var ISO_HORIZONTAL = 8;
    var ISO_DEFAULT_SPACING = 40;
    var ISO_DEFAULT_ORIENTATION = ISO_VERTICAL | ISO_RIGHT;
    var ISO_DEFAULT_SIDE_COLOR = "grey";
    var ISO_DEFAULT_TOP_COLOR = "lightgrey";

    var Orientation = function () {
      function Orientation(val) {
        if (val < 0 || val > 15) throw Error(ORIENTATION_NOT_SPECIFIED);
        this._val = val;
      }

      var __proto = Orientation.prototype;

      Orientation.fromString = function (orientationStr) {
        var parseString = function (str) {
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

        var orientations = orientationStr.split("|").map(function (str) {
          var sanitizedStr = str.trim();
          sanitizedStr = sanitizedStr.toLowerCase();
          return parseString(sanitizedStr);
        });
        if (orientations.length < 0) throw new Error(ORIENTATION_NOT_SPECIFIED);
        var result = new Orientation(ISO_NONE);

        for (var _i = 0, orientations_1 = orientations; _i < orientations_1.length; _i++) {
          var orientation = orientations_1[_i];
          result.merge(orientation);
        }

        return result;
      };

      Object.defineProperty(__proto, "isLeft", {
        get: function () {
          return (this._val & ISO_LEFT) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "isRight", {
        get: function () {
          return (this._val & ISO_RIGHT) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "isHorizontal", {
        get: function () {
          return (this._val & ISO_HORIZONTAL) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "isVertical", {
        get: function () {
          return (this._val & ISO_VERTICAL) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "isSide", {
        get: function () {
          return (this._val & ISO_LEFT + ISO_RIGHT) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "isNormal", {
        get: function () {
          return (this._val & ISO_HORIZONTAL + ISO_VERTICAL) > 0;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "normal", {
        get: function () {
          return new Orientation(this._val & ISO_HORIZONTAL + ISO_VERTICAL);
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "side", {
        get: function () {
          return new Orientation(this._val & ISO_LEFT + ISO_RIGHT);
        },
        enumerable: true,
        configurable: true
      });

      __proto.checkMutualExclusion = function () {
        if (this.isHorizontal === this.isVertical || this.isLeft === this.isRight) {
          throw Error(ORIENTATION_NOT_SPECIFIED);
        }
      };

      __proto.has = function (other) {
        return (this._val & other._val) > 0;
      };

      __proto.match = function (other) {
        return this._val === other._val;
      };

      __proto.merge = function (other) {
        this._val = this._val | other._val;
      };

      return Orientation;
    }();

    var Transform = function () {
      function Transform(orientation, parentOrientation) {
        this._rotationDegree = this._calcRotationDegree(orientation, parentOrientation);
        this._matrix = Matrix3x3.ONE;
        this._float = 0;
      }

      var __proto = Transform.prototype;
      Object.defineProperty(__proto, "changed", {
        get: function () {
          return !(this._matrix.match(Matrix3x3.ONE) && this._float === 0);
        },
        enumerable: true,
        configurable: true
      });

      __proto.rotateTo = function (props) {
        var normal = props.normal;
        var side = props.side;
        var degreeZ = normal * this._rotationDegree.normal.z + side * this._rotationDegree.side.z;
        var degreeY = normal * this._rotationDegree.normal.y + side * this._rotationDegree.side.y;
        var degreeX = normal * this._rotationDegree.normal.x + side * this._rotationDegree.side.x;

        this._matrix.rotateZ(degreeZ);

        this._matrix.rotateY(degreeY);

        this._matrix.rotateX(degreeX);
      };

      __proto.toString = function () {
        if (!this.changed) {
          return "none";
        } else {
          return "matrix3d(" + this._matrix.toString4x4() + ") translateZ(" + this._float.toFixed(4) + "px)";
        }
      };

      __proto.setScale = function (val) {
        this._matrix.scale({
          x: val,
          y: val,
          z: val
        });
      };

      __proto.setFloat = function (val) {
        this._float = val;
      };

      __proto.reset = function () {
        this._matrix = Matrix3x3.ONE;
      };

      __proto._calcRotationDegree = function (orientation, parentOrientation) {
        var rotations = {
          normal: {
            x: 0,
            y: 0,
            z: 0
          },
          side: {
            x: 0,
            y: 0,
            z: 0
          }
        };
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
      };

      return Transform;
    }();

    var Panel = function () {
      function Panel(target, maxLength, orientation) {
        this._length = 0;
        this._maxLength = maxLength;
        this._orientation = orientation;
        target.style.transformStyle = "preserve-3d";
        this._element = document.createElement("div");
        this._element.style.position = "absolute";
        this._element.style.backfaceVisibility = "hidden";

        if (this._orientation.isHorizontal) {
          this._element.style.width = "100%";
          this._element.style.height = this._maxLength + "px";
        } else {
          this._element.style.width = this._maxLength + "px";
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

        var xOrigin = 50;
        var yOrigin = 50;

        if (this._orientation.isHorizontal) {
          yOrigin = this._orientation.isLeft ? 0 : 100;
          this._rotation = this._orientation.isLeft ? "rotateX(90deg)" : "rotateX(-90deg)";
        } else {
          xOrigin = this._orientation.isLeft ? 0 : 100;
          this._rotation = this._orientation.isLeft ? "rotateY(-90deg)" : "rotateY(90deg)";
        }

        this._element.style.transformOrigin = xOrigin + "% " + yOrigin + "%";
        target.appendChild(this._element);
        this._offset = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };
      }

      var __proto = Panel.prototype;
      Object.defineProperty(__proto, "offset", {
        get: function () {
          return this._offset;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "background", {
        set: function (val) {
          this._element.style.background = val;
        },
        enumerable: true,
        configurable: true
      });

      __proto.progress = function (float, scale, targetOrientation) {
        this._length = Number((float * this._maxLength).toFixed(4));
        var rotationModificator = 324.48 / 400;
        var length = this._length * scale * rotationModificator;

        if (targetOrientation.isHorizontal) {
          this._offset.bottom = length;
        } else {
          this._offset.top = length / 2;
          this._offset.left = targetOrientation.isRight ? SQRT_3 * length / 2 : 0;
          this._offset.right = targetOrientation.isLeft ? SQRT_3 * length / 2 : 0;
        }
      };

      __proto.update = function () {
        var scaleX = 1;
        var scaleY = 1;

        if (this._orientation.isVertical) {
          scaleX = this._length / this._maxLength;
        } else {
          scaleY = this._length / this._maxLength;
        }

        this._element.style.transform = "translateZ(" + -this._length + "px) " + this._rotation + " scale(" + scaleX + ", " + scaleY + ")";
      };

      return Panel;
    }();

    var getElement = function (queryOrElement) {
      if (typeof queryOrElement === "string") {
        return document.querySelector(queryOrElement);
      } else if (queryOrElement.nodeType > 0) {
        return queryOrElement;
      } else {
        throw new Error(SELECTOR_NOT_SPECIFIED);
      }
    };
    var setWrapperSize = function (element, wrapper) {
      var bbox = element.getBoundingClientRect();
      wrapper.style.width = bbox.width + "px";
      wrapper.style.height = bbox.height + "px";
    };
    var wrapElement = function (element, isLeaf) {
      if (isLeaf === void 0) {
        isLeaf = false;
      }

      var wrapper = document.createElement("div");
      var elStyle = getComputedStyle(element);
      var isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

      if (elStyle.position === "absolute" || elStyle.position === "fixed") {
        wrapper.style.position = elStyle.position;
        wrapper.style.top = elStyle.top;
        wrapper.style.left = elStyle.left;
      } else {
        wrapper.style.position = "relative";
      }

      if (elStyle.display !== "inline" && elStyle.display !== "content" && elStyle.display !== "unset") {
        wrapper.style.display = elStyle.display;
      }

      wrapper.style.backfaceVisibility = "hidden";
      wrapper.style.overflow = "visible";
      wrapper.style.willChange = "transform";
      wrapper.style.pointerEvents = elStyle.pointerEvents;
      setWrapperSize(element, wrapper);
      element.parentElement.replaceChild(wrapper, element);
      wrapper.appendChild(element);

      if (!isLeaf) {
        element.style.transformStyle = "preserve-3d";
      }

      element.style.overflow = "visible";

      if (!isFirefox) {
        element.style.willChange = "transform";
      }

      element.style.position = "absolute";
      element.style.top = "0";
      element.style.left = "0";
      element.style.right = "0";
      return wrapper;
    };
    function toArray(iterable) {
      return [].slice.call(iterable);
    }

    var IsoLayer = function () {
      function IsoLayer(el, parent, defaultSpacing) {
        this._element = el;
        this._parent = parent;
        this._childs = [];
        this._orientation = parent.orientation;
        var wrapSpacing = el.getAttribute("iso-wrap-spacing");
        this._isWrapper = wrapSpacing !== null;
        this._isLeaf = el.getAttribute("iso-no-spacing") !== null || this._isWrapper;

        if (this._isWrapper) {
          this._spacing = Number(wrapSpacing) || defaultSpacing;
        } else if (!this._isLeaf) {
          var spacing = el.getAttribute("iso-spacing");
          this._spacing = spacing !== null ? Number(spacing) : defaultSpacing;
        } else {
          this._spacing = 0;
        }

        var rotations = el.getAttribute("iso-rotation");

        if (rotations !== null) {
          this._orientation = Orientation.fromString(rotations);

          if (!this._orientation.isNormal) {
            this._orientation.merge(parent.orientation.normal);
          }

          if (!this._orientation.isSide) {
            this._orientation.merge(parent.orientation.side);
          }
        }

        this._transform = new Transform(this._orientation, this._parent.orientation);
        this._wrapper = wrapElement(this._element, this._isLeaf);

        if (!this._isLeaf) {
          this._wrapper.style.transformStyle = "preserve-3d";
        }

        this._setTransformOrigin();

        if (this._shouldTraverse()) {
          this._findChilds(defaultSpacing);
        }

        if (this._childs.length <= 0) this._isLeaf = true;
        this._panels = this._makePanel();
      }

      var __proto = IsoLayer.prototype;
      Object.defineProperty(__proto, "orientation", {
        get: function () {
          return this._orientation;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "wrapper", {
        get: function () {
          return this._wrapper;
        },
        enumerable: true,
        configurable: true
      });

      __proto.progress = function (float, normal, side, scale, maxBbox) {
        this._transform.reset();

        this._transform.setFloat(float * this._spacing);

        if (!this._orientation.match(this._parent.orientation)) {
          this._transform.rotateTo({
            normal: normal,
            side: side
          });
        }

        var additionalOffset = {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        };

        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
          var panel = _a[_i];
          panel.progress(float, scale, this._orientation);
          var panelOffset = panel.offset;
          additionalOffset.top = additionalOffset.top || panelOffset.top;
          additionalOffset.bottom = additionalOffset.bottom || panelOffset.bottom;
          additionalOffset.left = additionalOffset.left || panelOffset.left;
          additionalOffset.right = additionalOffset.right || panelOffset.right;
        }

        var bbox = this._element.getBoundingClientRect();

        if (bbox.top - additionalOffset.top < maxBbox.top) {
          maxBbox.top = bbox.top - additionalOffset.top;
        }

        if (bbox.bottom + additionalOffset.bottom > maxBbox.bottom) {
          maxBbox.bottom = bbox.bottom + additionalOffset.bottom;
        }

        if (bbox.left - additionalOffset.left < maxBbox.left) {
          maxBbox.left = bbox.left - additionalOffset.left;
        }

        if (bbox.right + additionalOffset.right > maxBbox.right) {
          maxBbox.right = bbox.right - additionalOffset.right;
        }

        for (var _b = 0, _c = this._childs; _b < _c.length; _b++) {
          var child = _c[_b];
          child.progress(float, normal, side, scale, maxBbox);
        }
      };

      __proto.update = function () {
        var isFirefox = navigator.userAgent.indexOf("Firefox") > 0;

        if (!isFirefox) {
          if (this._isLeaf) {
            if (this._transform.changed) {
              this._wrapper.style.transformStyle = "preserve-3d";
            } else {
              this._wrapper.style.transformStyle = "flat";
            }
          }
        } else {
          this._wrapper.style.transformStyle = "preserve-3d";
        }

        this._wrapper.style.transform = this._transform.toString();

        for (var _i = 0, _a = this._panels; _i < _a.length; _i++) {
          var panel = _a[_i];
          panel.update();
        }
      };

      __proto.addParallelLayer = function (layer) {
        this._wrapper.appendChild(layer.wrapper);

        this._childs.push(layer);
      };

      __proto.getAllChildLayers = function () {
        var layers = [];

        for (var _i = 0, _a = this._childs; _i < _a.length; _i++) {
          var child = _a[_i];
          layers.push(child);
          layers.push.apply(layers, child.getAllChildLayers());
        }

        return layers;
      };

      __proto._makePanel = function () {
        var element = this._element;
        var spacing = this._spacing;
        var orientation = this._orientation;
        var topBackground = element.getAttribute("iso-top-background");
        var sideBackground = element.getAttribute("iso-side-background");
        var sideLengthStr = element.getAttribute("iso-side-length");
        var hasPanel = topBackground !== null || sideBackground !== null || sideLengthStr !== null;
        var sideLength = sideLengthStr ? Number(sideLengthStr) : Number(spacing);
        var panels = [];

        if (hasPanel) {
          topBackground = topBackground || ISO_DEFAULT_TOP_COLOR;
          sideBackground = sideBackground || ISO_DEFAULT_SIDE_COLOR;
          var topPanelOrientation = orientation.isHorizontal ? new Orientation(ISO_HORIZONTAL | ISO_RIGHT) : new Orientation(ISO_HORIZONTAL | ISO_LEFT);
          var sidePanelOrientation = orientation.isLeft ? new Orientation(ISO_VERTICAL | ISO_RIGHT) : new Orientation(ISO_VERTICAL | ISO_LEFT);
          var topPanel = new Panel(element, sideLength, topPanelOrientation);
          var sidePanel = new Panel(element, sideLength, sidePanelOrientation);
          topPanel.background = topBackground;
          sidePanel.background = sideBackground;
          panels.push(topPanel);
          panels.push(sidePanel);
        }

        return panels;
      };

      __proto._findChilds = function (defaultSpacing) {
        var isParallel = this._element.getAttribute("iso-parallel") !== null;
        if (!this._element.children[0]) return;

        if (isParallel) {
          var parentLayer = new IsoLayer(this._element.children[0], this, defaultSpacing);

          this._childs.push(parentLayer);

          while (this._element.children[1]) {
            var layer = new IsoLayer(this._element.children[1], parentLayer, defaultSpacing);
            parentLayer.addParallelLayer(layer);
            parentLayer = layer;
          }
        } else {
          for (var _i = 0, _a = toArray(this._element.children); _i < _a.length; _i++) {
            var child = _a[_i];
            var layer = new IsoLayer(child, this, defaultSpacing);

            this._childs.push(layer);
          }
        }
      };

      __proto._shouldTraverse = function () {
        var tag = this._element.tagName.toLowerCase();

        if (this._isWrapper) {
          return false;
        }

        if (this._isLeaf) {
          return false;
        }

        if (tag === "a") {
          return false;
        }

        if (tag === "iframe") {
          return false;
        }

        return true;
      };

      __proto._setTransformOrigin = function () {
        var orientation = this._orientation;
        var parentOrientation = this._parent.orientation;
        var xOrigin = 0;
        var yOrigin = 0;

        if (parentOrientation.isVertical && parentOrientation.isLeft) {
          xOrigin = 100;
        }

        if (parentOrientation.isHorizontal) {
          if (orientation.isHorizontal) {
            xOrigin = 50;
            yOrigin = 50;
          } else {
            xOrigin = parentOrientation.isRight ? 100 : 0;
            yOrigin = 100;
          }
        }

        this._wrapper.style.transformOrigin = xOrigin + "% " + yOrigin + "%";
      };

      return IsoLayer;
    }();

    var Isometrizer = function () {
      function Isometrizer(el, options) {
        if (options === void 0) {
          options = {
            spacing: ISO_DEFAULT_SPACING,
            orientation: ISO_DEFAULT_ORIENTATION
          };
        }

        this._element = getElement(el);
        this._prevProgress = {
          normal: 0,
          side: 0,
          scale: 0,
          float: 0,
          childNormal: 0,
          childSide: 0
        };
        this._defaultSpacing = options.spacing || ISO_DEFAULT_SPACING;
        this._orientation = new Orientation(options.orientation || ISO_DEFAULT_ORIENTATION);
        this._wrapper = wrapElement(this._element);
        this._element.style.transformStyle = "preserve-3d";
        this._wrapper.style.willChange = "transform";
        this._layers = this._findLayers();
        this._allLayers = this._getAllLayers();
        this.off();
      }

      var __proto = Isometrizer.prototype;
      Object.defineProperty(Isometrizer, "ISO_LEFT", {
        get: function () {
          return ISO_LEFT;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Isometrizer, "ISO_RIGHT", {
        get: function () {
          return ISO_RIGHT;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Isometrizer, "ISO_HORIZONTAL", {
        get: function () {
          return ISO_HORIZONTAL;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(Isometrizer, "ISO_VERTICAL", {
        get: function () {
          return ISO_VERTICAL;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(__proto, "orientation", {
        get: function () {
          return this._orientation;
        },
        enumerable: true,
        configurable: true
      });

      __proto.on = function () {
        this.progress({
          normal: 1,
          side: 1,
          scale: 1,
          float: 1,
          childNormal: 1,
          childSide: 1
        });
        return this;
      };

      __proto.off = function () {
        this.progress({
          normal: 0,
          side: 0,
          scale: 0,
          float: 0,
          childNormal: 0,
          childSide: 0
        });
        return this;
      };

      __proto.progress = function (props) {
        if (props === void 0) {
          props = this._prevProgress;
        }

        props.normal = props.normal || this._prevProgress.normal;
        props.side = props.side || this._prevProgress.side;
        props.scale = props.scale || this._prevProgress.scale;
        props.float = props.float || this._prevProgress.float;
        props.childNormal = props.childNormal || this._prevProgress.childNormal;
        props.childSide = props.childSide || this._prevProgress.childSide;
        var THRESHOLD = 0.001;
        if (props.normal < THRESHOLD) props.normal = 0;
        if (props.side < THRESHOLD) props.side = 0;
        if (props.scale < THRESHOLD) props.scale = 0;
        if (props.float < THRESHOLD) props.float = 0;
        if (props.childNormal < THRESHOLD) props.childNormal = 0;
        if (props.childSide < THRESHOLD) props.childSide = 0;

        var parentBbox = this._wrapper.getBoundingClientRect();

        var originalBbox = this._element.getBoundingClientRect();

        var maxBbox = {
          top: originalBbox.top,
          bottom: originalBbox.bottom,
          left: originalBbox.left,
          right: originalBbox.right
        };

        var calculatedScale = this._calcScale(props.scale);

        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
          var layer = _a[_i];
          layer.progress(props.float, props.childNormal, props.childSide, calculatedScale, maxBbox);
        }

        this._rotate({
          normal: props.normal,
          side: props.side,
          scale: props.scale
        });

        for (var _b = 0, _c = this._allLayers; _b < _c.length; _b++) {
          var layer = _c[_b];
          layer.update();
        }

        this._resize(parentBbox, maxBbox);

        this._prevProgress.normal = props.normal;
        this._prevProgress.side = props.side;
        this._prevProgress.scale = props.scale;
        this._prevProgress.float = props.float;
        this._prevProgress.childNormal = props.childNormal;
        this._prevProgress.childSide = props.childSide;
        return this;
      };

      __proto._resize = function (originalBbox, maxBbox) {
        maxBbox.width = maxBbox.right - maxBbox.left;
        maxBbox.height = maxBbox.bottom - maxBbox.top;
        var parentElement = this._wrapper;
        var marginTop = originalBbox.top - maxBbox.top;
        var marginBottom = maxBbox.bottom - originalBbox.bottom;
        var leftDiff = originalBbox.left - maxBbox.left;
        var rightDiff = maxBbox.right - originalBbox.right;
        var widthDiff = Math.max(leftDiff, 0) - Math.max(rightDiff, 0);
        var marginRight = Math.max(leftDiff + (rightDiff < 0 ? rightDiff : 0), 0);
        var marginLeft = Math.max(rightDiff + (leftDiff < 0 ? leftDiff : 0), 0);
        parentElement.style.marginRight = marginRight + "px";
        parentElement.style.marginLeft = marginLeft + "px";
        parentElement.style.marginTop = marginTop + "px";
        parentElement.style.marginBottom = marginBottom + "px";
        parentElement.style.transform = "translateX(" + widthDiff + "px)";
      };

      __proto._findLayers = function () {
        var layers = [];

        for (var _i = 0, _a = toArray(this._element.children); _i < _a.length; _i++) {
          var child = _a[_i];
          var layer = new IsoLayer(child, this, this._defaultSpacing);
          layers.push(layer);
        }

        return layers;
      };

      __proto._getAllLayers = function () {
        var layers = [];

        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
          var layer = _a[_i];
          layers.push(layer);
          layers.push.apply(layers, layer.getAllChildLayers());
        }

        return layers;
      };

      __proto._rotate = function (props) {
        var normal = props.normal;
        var side = props.side;
        var scale = props.scale;
        var transform = new Transform(this._orientation, new Orientation(ISO_NONE));
        transform.setScale(this._calcScale(scale));
        transform.rotateTo({
          normal: normal,
          side: side
        });
        this._element.style.transform = transform.toString();
      };

      __proto._calcScale = function (val) {
        var maxScale = SQRT_2;
        var scaleAmount = 1 + val * (maxScale - 1);
        return scaleAmount;
      };

      return Isometrizer;
    }();

    return Isometrizer;

}));
//# sourceMappingURL=isomterizer.pkgd.js.map
