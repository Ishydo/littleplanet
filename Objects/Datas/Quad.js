/**
 * Created by alexandre on 21.10.2016.
 */

class Quad extends Drawable {
    constructor(args = {}) {
        super(args);
        var {
            width = 1,
            height = 1,
            divisions = 1
            } = args;

        this._width = width;
        this._height = height;
        this._divisions = divisions;
    }

    get width() {return this._width}
    set width(w){this._width = w}
    get height() {return this._height}
    set height(h){this._height = h}
    get divisions() {return this._divisions}
    set divisions(d){this._divisions = d}
}