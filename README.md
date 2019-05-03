# Isometrizer
Isometrizer turns your DOM elements into isometric projection

![MAP DEMO](./asset/map.gif)

# Introduction

Isometrizer is a Javascript library that has features like

- 4 projection types combining
  - `ISO_VERTICAL` or `ISO_HORIZONTAL`
  - `ISO_LEFT` or `ISO_RIGHT`
- Hierarchical flotation of childs
- Rotating specific child
- Side / Top plane drawing

# Usage
```js
new Isometrizer(
    el: HTMLElement | string,
    options: {
        spacing: number,
        orientation: number
    }
)
```
- `el` is an DOM element or element query string and options provides configuration.
- `options` consists of:
    - `spacing`: Default spacing for child floatation, in px (default: 40)
    - `orientation`: Element rotate direction (default: ISO_VERTICAL | ISO_RIGHT)

# Methods
Instance of `Isometrizer` provides 3 methods you can use.

#### `on()`
Immediately turns into isometric projection.

#### `off()`
Immediately turns into original projection.

#### `progress(props)`
Progressively turns into isometric projection.

You can combine other libraries like [mojs](https://github.com/legomushroom/mojs), or `requestAnimationFrame()` to animate rotation.

##### props
- All following props are from `0`(off) to `1`(on)
- `normal`: rotate direction `ISO_HORIZONTAL` or `ISO_VERTICAL`
- `side`: rotate direction `ISO_LEFT` or `ISO_RIGHT`
- `scale`: scales from 1 to sqrt(2)
- `float`: floats all childs from 0 to their own spacing
- `childNormal`: rotate direction `ISO_HORIZONTAL` or `ISO_VERTICAL` of childs
- `childSide`: rotate direction `ISO_LEFT` or `ISO_RIGHT` of childs

# Contributing
## Installing
```
npm install
```

## Running the tests
### Linting
```
npm run lint
```

## Building
```
npm run build
npm run demo:build
```
