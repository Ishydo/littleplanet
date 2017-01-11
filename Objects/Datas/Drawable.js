class Drawable {
    constructor(args = {}) {
        var {
            x = 0,
            y = 0,
            z = 0,
            r = 1,
            g = 1,
            b = 1,
            a = 1,
            } = args;

        this._x = x;
        this._y = y;
        this._z = z;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;

        //Initialisation of the buffers within the object
        this._vertexBuffer = null;
        this._indexBuffer = null;
        this._colorBuffer = null;
        this._normalsBuffer = null;
        //Initialisation of the arrays used to construct the object
        this._indices = [];
        this._vertices = [];
        this._colors = [];
        this._normals = [];

        //Creation of a movement matrix specific for the object
        this._mvMatrix = mat4.create();
        this._nMatrix = mat4.create(); // ftl

        if (new.target === Drawable) {
            throw new TypeError("Cannot construct Drawable instances directly (abstract class)");
        }
    }

    get x   ()      {return this._x}
    set x   (x)     {
        this._x = x;
    }
    get y   ()      {return this._y}
    set y   (y)     {
        this._y = y;
    }
    get z   ()      {return this._z}
    set z   (z)     {
        this._z = z;
    }
    get r   ()      {return this._r}
    set r   (r)     {this._r = r}
    get g   ()      {return this._g}
    set g   (g)     {this._g = g}
    get b   ()      {return this._b}
    set b   (b)     {this._b = b}
    get a   ()      {return this._a}
    set a   (a)     {this._a = a}
    get vertexBuffer    ()      {return this._vertexBuffer}
    set vertexBuffer    (v)     {this._vertexBuffer = v}
    get indexBuffer     ()      {return this._indexBuffer}
    set indexBuffer     (i)     {this._indexBuffer = i}
    get colorBuffer     ()      {return this._colorBuffer}
    set colorBuffer     (c)     {this._colorBuffer = c}
    get normalsBuffer     ()      {return this._normalsBuffer}
    set normalsBuffer     (c)     {this._normalsBuffer = c}
    get indices         ()      {return this._indices}
    set indices         (i)     {this._indices = i}
    get vertices        ()      {return this._vertices}
    set vertices        (v)     {this._vertices = v}
    get normals        ()      {return this._normals}
    set normals        (v)     {this._normals = v}
    get colors          ()      {return this._colors}
    set colors          (c)     {this._colors = c}
    get mvMatrix        ()      {return this._mvMatrix}
    set mvMatrix        (m)     {this._mvMatrix = m}
    get nMatrix        ()      {return this._nMatrix} // ftl
    set nMatrix        (m)     {this._nMatrix = m} // ftl

    getColors   ()  {return {r: this._r, g: this._g, b: this.b, a: this._a}}
    setColors   (...args)  {
        var {r = this._r, g = this._g, b = this._b, a = this._a} = args;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }
    getPos     ()  {return{x: this._x, y: this._y, z: this._z}}
    setPos   (...args)  {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    setPosFromVec (v) {
        this._x = v[0];
        this._y = v[1];
        this._z = v[2];
    }
    getPosAsVec () {
        return vec3.fromValues(this._x, this._y, this._z);
    }

    draw(parent) {
        var mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, parent, this._mvMatrix);
        glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

        // These 4 lines ftl
        mat4.copy(this.nMatrix, this.mvMatrix);
        mat4.invert(this.nMatrix, this.nMatrix);
        mat4.transpose(this.nMatrix, this.nMatrix);//We calculate the transposed matrix
        glContext.uniformMatrix4fv(prg.nMatrixUniform, false, this.nMatrix);//And send it to the gpu


        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._vertexBuffer);
        glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);

        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._normalsBuffer);
        glContext.vertexAttribPointer(prg.vertexNormalAttribute, 3, glContext.FLOAT, false, 0, 0);


        glContext.bindBuffer(glContext.ARRAY_BUFFER, this._colorBuffer);
        glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
        glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

        glContext.drawElements(glContext.TRIANGLES, this.indices.length, glContext.UNSIGNED_SHORT, 0);
    }
}
