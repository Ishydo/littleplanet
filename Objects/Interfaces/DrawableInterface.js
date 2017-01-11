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

    // Fonction qui contiendra la logique de remplissage des buffers pour chaque enfant
    fillArrays() {
        throw TypeError("function fillArrays shouldn't be executed from abstract class DrawableInterface.");
    }

    // Fonction de création
    create(drawable) {
        if(!drawable) throw ReferenceError("Null Drawable cannot be init");

        // Initialisation des tableaux vides
        drawable.vertices = [];
        drawable.colors = [];
        drawable.indices = [];
        drawable.normals = [];

        // Méthode selon enfant de remplissage des tableaux
        this.fillArrays(drawable);

        // Entrée des valeurs dans les buffers
        drawable.vertexBuffer = getVertexBufferWithVertices(drawable.vertices);
        drawable.colorBuffer = getVertexBufferWithVertices(drawable.colors);
        drawable.normalsBuffer = getVertexBufferWithVertices(drawable.normals);
        drawable.indexBuffer = getIndexBufferWithIndices(drawable.indices);
    }
}
