class Sphere extends Drawable {
    constructor(args = {}) {
        super(args);
        var {
            radius = 1,
            divisions = 0
            } = args;

        this._radius = radius;
        this._divisions = divisions;
    }

    get radius() {return this._radius}
    set radius(r) {this._radius = r}
    get divisions() {return this._divisions}
    set divisions(d){this._divisions = d}
}
