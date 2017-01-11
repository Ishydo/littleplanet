/**
 * Created by alexandre on 28.09.2016.
 */

class DrawableInterface {
    constructor() {
        if (new.target === DrawableInterface) {
            throw new TypeError("Cannot construct DrawableInterface instances directly (abstract class)");
        }
    }

    update(drawable) {
        if(!drawable) throw ReferenceError("Null Drawable cannot be updated");
        //Defines the position matrix of the object
        mat4.identity(drawable.mvMatrix);
        mat4.translate(drawable.mvMatrix, drawable.mvMatrix, vec3.fromValues(drawable.x, drawable.y, drawable.z));
    }

    /**
     * This is where the drawing logic of the children will be
     */
    fillArrays() {
        throw TypeError("function fillArrays shouldn't be executed from abstract class DrawableInterface.");
    }

    create(drawable) {
        if(!drawable) throw ReferenceError("Null Drawable cannot be init");
        drawable.vertices = [];
        drawable.colors = [];
        drawable.indices = [];
        drawable.normals = [];

        this.fillArrays(drawable);

        //console.log(drawable.normals.length, drawable.normals)

        //Converts the values to buffers
        drawable.vertexBuffer = getVertexBufferWithVertices(drawable.vertices);
        drawable.colorBuffer = getVertexBufferWithVertices(drawable.colors);
        drawable.normalsBuffer = getVertexBufferWithVertices(drawable.normals);
        drawable.indexBuffer = getIndexBufferWithIndices(drawable.indices);
    }
}
