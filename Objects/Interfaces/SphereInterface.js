/**
 * Created by alexandre on 20.12.2016.
 */


class SphereInterface extends DrawableInterface {
    constructor() {
        super();
        this.indexCnt = 0;

    }

    fillArrays(drawable) {
        this.clearBuffers()
        this.indexCnt = 0;
        this.createSphere(drawable);
    }

    //Subdivision function to generate the sphere with an icosahedron
  	fromOneToFourTriangles(v1, v2, v3, depth, drawable){
      //console.log(drawable.vertices.length)
      //console.log(drawable.colors);
  		//Declaration of temporary arrays for each subdivision
  		var v12 = [];   var v23 = [];   var v31 = [];
  		//If we arrived at the end of the recursive subdivision
  		if (depth == 0) {
  			//We store all the vertices, colors and indexes
  			drawable.vertices.push( v1[0], v1[1], v1[2] );
  			drawable.colors.push( drawable.r, drawable.g, drawable.b, drawable.a );
  			drawable.vertices.push( v2[0], v2[1], v2[2] );
  			drawable.colors.push( drawable.r, drawable.g, drawable.b, drawable.a );
  			drawable.vertices.push( v3[0], v3[1], v3[2] );
  			drawable.colors.push( drawable.r, drawable.g, drawable.b, drawable.a );
  			drawable.indices.push( this.indexCnt, this.indexCnt+1, this.indexCnt+2);
  			this.indexCnt += 3;
  		}else{
  			//If we are still subdividing
  			//We define 3 vectors per component (x,y,z) for each triangle based on the previous one
  			for (var i = 0; i < 3; i++) {
  				v12.push( (v1[i]+v2[i])/2.0 );
  				v23.push( (v2[i]+v3[i])/2.0 );
  				v31.push( (v3[i]+v1[i])/2.0 );
  			}
  			//We normalize the 3 new triangles based on the vectors
  			v12 = this.normalize(v12, drawable.radius);
  			v23 = this.normalize(v23, drawable.radius);
  			v31 = this.normalize(v31, drawable.radius);

  			//We subdivised our new triangles
  			this.fromOneToFourTriangles( v1, v12, v31, depth-1, drawable);
  			this.fromOneToFourTriangles( v2, v23, v12, depth-1, drawable);
  			this.fromOneToFourTriangles( v3, v31, v23, depth-1, drawable);
  			this.fromOneToFourTriangles( v12, v23, v31, depth-1, drawable);
  		}
  	}

  	//Function to normalize a vector
  	normalize(v, radius = 1.0){
  		var d = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
  		if (d!=0.0){
  		  v[0] = v[0]/ d * radius;
  		  v[1] = v[1]/ d * radius;
  		  v[2] = v[2]/ d * radius;
  		}
  		return v;
  	}

    createSphere(drawable) {

      //We define the components to draw the base icosahedron, see :
		//And we take into account the radius of each sphere.
		const X = 0.525731112119133696 * drawable.radius;
		const Z = 0.850650808352039932 * drawable.radius;
		//We create each base vertex
		var icosahedronvertex = [];
		icosahedronvertex.push(-X, 0.0, Z);
		icosahedronvertex.push(X, 0.0, Z);
		icosahedronvertex.push(-X, 0.0, -Z);
		icosahedronvertex.push(X, 0.0, -Z);
		icosahedronvertex.push(0.0, Z, X);
		icosahedronvertex.push(0.0, Z, -X);
		icosahedronvertex.push(0.0, -Z, X);
		icosahedronvertex.push(0.0, -Z, -X);
		icosahedronvertex.push(Z, X, 0.0);
		icosahedronvertex.push(-Z, X, 0.0);
		icosahedronvertex.push(Z, -X, 0.0);
		icosahedronvertex.push(-Z, -X, 0.0);
		//We create each base index
		var icosahedrontriangle = [];
		icosahedrontriangle.push(1,4,0);
		icosahedrontriangle.push(4,9,0);
		icosahedrontriangle.push(4,5,9);
		icosahedrontriangle.push(8,5,4);
		icosahedrontriangle.push(1,8,4);
		icosahedrontriangle.push(1,10,8);
		icosahedrontriangle.push(10,3,8);
		icosahedrontriangle.push(8,3,5);
		icosahedrontriangle.push(3,2,5);
		icosahedrontriangle.push(3,7,2);
		icosahedrontriangle.push(3,10,7);
		icosahedrontriangle.push(10,6,7);
		icosahedrontriangle.push(6,11,7);
		icosahedrontriangle.push(6,0,11);
		icosahedrontriangle.push(6,1,0);
		icosahedrontriangle.push(10,1,6);
		icosahedrontriangle.push(11,0,9);
		icosahedrontriangle.push(2,11,9);
		icosahedrontriangle.push(5,2,9);
		icosahedrontriangle.push(11,2,7);
		//Foreach point
		for (var i = 0; i < icosahedrontriangle.length; i+=3){
			//We create 3 empty vectors
			var v1 = [];
			var v2 = [];
			var v3 = [];
			//Retrive the base index
			var vertexIndexStart = icosahedrontriangle[i] * 3;
			//We define v1, a point/vector of the current triangle
			v1.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
			vertexIndexStart = icosahedrontriangle[i+1] * 3;
			//We define v2, a point/vector of the current triangle
			v2.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
			vertexIndexStart = icosahedrontriangle[i+2] * 3;
			//we define v3, a point/vector of the current triangle
			v3.push(icosahedronvertex[vertexIndexStart],
					icosahedronvertex[vertexIndexStart + 1],
					icosahedronvertex[vertexIndexStart + 2]);
      this.fromOneToFourTriangles(v1, v2, v3, drawable.divisions, drawable);
}

/*



      //  this.initIcosahedron(drawable)
        // console.log(this.indexCnt)


        var i, j;
        var n = drawable.divisions;

        var indexOfSouthPole = n * n + 1;

        //pole nord
        drawable.vertices.push(0.0, 0.0, drawable.radius);
        drawable.colors.push(.8, 0.8, .8, 1.0);

        for (i = 0; i < 360; i += 360 / n) {
            for (j = 180 / (n + 1); j < 180; j += 180 / (n + 1)) {
                drawable.vertices.push(
                    drawable.radius * Math.cos(glMatrix.toRadian(i)) * Math.sin(glMatrix.toRadian(j)),
                    drawable.radius * Math.sin(glMatrix.toRadian(i)) * Math.sin(glMatrix.toRadian(j)),
                    drawable.radius * Math.cos(glMatrix.toRadian(j))
                );
                drawable.colors.push(
                    drawable.r + (1.0 - drawable.r)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    drawable.g + (1.0 - drawable.g)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    drawable.b + (1.0 - drawable.b)*Math.abs(0.4*Math.cos(glMatrix.toRadian(j))),
                    drawable.a);
            }
        }

        //pole sud
        drawable.vertices.push(0.0, 0.0, -drawable.radius);
        drawable.colors.push(1.0, 1.0, 1.0, 1.0);

        //poles - triangles
        for (i = 0; i < n - 1; i++) {
            drawable.indices.push(0, i * n + 1, (i + 1) * n + 1);
            drawable.indices.push(
                indexOfSouthPole,
                (i + 1) * n,
                (i + 2) * n
            );
        }
        //join
        drawable.indices.push(0, n * (n - 1) + 1, 1);
        drawable.indices.push(indexOfSouthPole, n*n, n);

        //body - quads
        for (i = 0; i < n - 1; i++) {
            for (j = 1; j < n; j++) {
                drawable.indices.push(
                    (i * n) + j,
                    (i * n) + (j + 1),
                    ((i + 1) * n) + (j + 1)
                );

                drawable.indices.push(
                    (i * n) + j,
                    ((i + 1) * n) + j,
                    ((i + 1) * n) + (j + 1)
                );
            }
        }

        //join
        for(i = 1; i < n; i++) {
            drawable.indices.push(
                n*(n - 1) + i,
                n*(n - 1) + i + 1,
                i + 1
            );

            drawable.indices.push(
                n*(n - 1) + i,
                i,
                i + 1
            );
        }
*/

      //console.log("ok");
      //console.log("Vertices " + drawable.vertices.length);
      //console.log("Index " + drawable.indices.length);


    }

    //This method clears the buffer
  	clearBuffers()
  	{
  		if(this.vertexBuffer != null)
  		{
  			glContext.deleteBuffer(this.vertexBuffer);
  		}
  		if(this.colorBuffer != null)
  		{
  			glContext.deleteBuffer(this.colorBuffer);
  		}
  		if(this.indexBuffer != null)
  		{
  			glContext.deleteBuffer(this.indexBuffer);
  		}

  	}

}
