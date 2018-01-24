function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js, it returns a WebGLRenderingContext
    let gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( (prog) => {

        gl.useProgram(prog);
    // Use black RGB=(0,0,0) for the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
    gl.viewport(0, 0, canvas.width, canvas.height);

    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    // create starting points, then gen the rest of the triangle via function
    var vertices = [-0.8, -0.6,  0.7, -0.6,  -0.5, 0.7];
    createGasket(vertices, 5000);

    // create a buffer
    // noinspection JSAnnotator
    let vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);

    // copy the vertices data
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    // obtain a reference to the shader variable (on the GPU)
    // noinspection JSAnnotator
    let posAttr = gl.getAttribLocation(prog, "vertexPos");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr,
        2,         /* number of components per attribute, in our case (x,y) */
        gl.FLOAT,  /* type of each attribute */
        false,     /* does not require normalization */
        0,         /* stride: number of bytes between the beginning of consecutive attributes */
        0);        /* the offset (in bytes) to the first component in the attribute array */

    gl.drawArrays(gl.POINTS,
        0,  /* starting index in the array */
        vertices.length/2); /* number of vertices to draw */
});
}

/***
 * Generates a seirpinski's triangle with points given three initial points and a number of points to generate further
 * @param points an array of vertex coords
 * @param pointNum in count, the number of points to gen
 */
function createGasket(points, pointNum){
    // Create point inside triangle
    var P = [];
    P[0] = 1/3*points[0] + 1/3*points[2] + 1/3*points[4];
    P[1] = 1/3*points[1] + 1/3*points[3] + 1/3*points[5];

    for(var count = 0; count < pointNum; count++){
        var take = Math.floor(Math.random()*10 % 3);
        var V = [points[take*2], points[take*2+1]];

        var Q = [];
        Q[0] = (P[0] + V[0]) / 2;
        Q[1] = (P[1] + V[1]) / 2;

        points.push(Q[0]);
        points.push(Q[1]);

        P = Q;
    }
}

