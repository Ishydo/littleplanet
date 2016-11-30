/* A planet object class */
class Planet{
	constructor(name, radius, color, sub, x, y, z)
	{
		this.name = name;
		this.radius = radius;
		this.color = color;
		//Initialisation of the buffers within the object for the render area
		this.vertexBuffer = null;
		this.indexBuffer = null;
		this.colorBuffer = null;


		this.x = x;
		this.y = y;
		this.z = z;

		//Static definition of the subdivision of the perimeter of the planet to creater the various points for the verticies
		this._subdivision = sub;

		//Creation of a model view matrix specific for the object
		this.mvMatrix = mat4.create();



		//Call of the initialisation method
		this.init();

	}


	//Getter/setter for division
	set subdivision(div){
		this._subdivision = div;
		this.init();
	}

	get subdivision(){
		return this._subdivision;
	}

	//Subdivision function to generate the sphere with an icosahedron
	fromOneToFourTriangles(v1, v2, v3, depth){
		//Declaration of temporary arrays for each subdivision
		var v12 = [];   var v23 = [];   var v31 = [];
		//If we arrived at the end of the recursive subdivision
		if (depth == 0) {
			//We store all the vertices, colors and indexes
			this.vertices.push( v1[0], v1[1], v1[2] );
			this.colors.push( this.color.r, this.color.g, this.color.b, 1.0 );
			this.vertices.push( v2[0], v2[1], v2[2] );
			this.colors.push( this.color.r, this.color.g, this.color.b, 1.0 );
			this.vertices.push( v3[0], v3[1], v3[2] );
			this.colors.push( this.color.r, this.color.g, this.color.b, 1.0 );
			this.indices.push( this.indexCnt, this.indexCnt+1, this.indexCnt+1, this.indexCnt+2, this.indexCnt+2, this.indexCnt );
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
			v12 = this.normalize(v12, this.radius);
			v23 = this.normalize(v23, this.radius);
			v31 = this.normalize(v31, this.radius);

			//We subdivised our new triangles
			this.fromOneToFourTriangles( v1, v12, v31, depth-1);
			this.fromOneToFourTriangles( v2, v23, v12, depth-1);
			this.fromOneToFourTriangles( v3, v31, v23, depth-1);
			this.fromOneToFourTriangles( v12, v23, v31, depth-1);
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


	//Initialisation method of a planet object
	init()
	{

		this.clearBuffers();

		//Initialisation of the arrays used to construct the object
		this.indices = [];
		this.vertices = [];
		this.colors = [];

		//We define the index "count" at 0
		this.indexCnt = 0;


		//Initialisation of the icosahedron
		this.initIcosahedron();

		console.log(this.colors);

		//We create the buffers on the GPU
		this.vertexBuffer = getVertexBufferWithVertices(this.vertices);
		this.colorBuffer = getVertexBufferWithVertices(this.colors);
		this.indexBuffer = getIndexBufferWithIndices(this.indices);



	}


	//Initialisation of the icosahedron
	initIcosahedron(){
		//We define the components to draw the base icosahedron, see :
		//And we take into account the radius of each sphere.
		const X = 0.525731112119133696 * this.radius;
		const Z = 0.850650808352039932 * this.radius;
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
			//We start the recursive subdivision of the selected triangle
			this.fromOneToFourTriangles(v1, v2, v3, this._subdivision);
		}
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


	//Draw method of the planet object
	draw(mvMatrix)
	{
		//Resets the local model view matrix
		mat4.identity(this.mvMatrix);
		//Translates the mv matrix
		mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(this.x, this.y, this.z));
		//Multiplies the model View matrix of the object with the view matrix of the scene
		mat4.multiply(this.mvMatrix, this.mvMatrix, mvMatrix);

		glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, this.mvMatrix);
		//Transfer of the vertices for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);

		glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
		//Transfer of the colors for the planet
		glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
		glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
		//Transfer the indexes for the planet
		glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		//We draw the icosahedron as lines
		glContext.drawElements(glContext.LINES, this.indices.length, glContext.UNSIGNED_SHORT,0);

	}
}
