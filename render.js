function main() {
    // Program essentials
    let canvas = document.getElementById("my-canvas");
    let gl = WebGLUtils.setupWebGL(canvas);
    const program = gl.createProgram();
    let depth = 5;

    // create starting points, then gen the rest of the triangle via function
    let pointA = [-0.8, -0.6];
    let pointB = [ 0.7, -0.6];
    let pointC = [-.05,  0.7];
    let vertices = [];

    let needThreePoints = true;
    canvas.addEventListener('click', event => {
        if (needThreePoints){
            let x = 2 * event.offsetX / canvas.width - 1;
            let y = -1 + 2 * (canvas.height - event.offsetY) / canvas.height;

            vertices.push(x, y);
        }
    });

    let chooseButton = document.getElementById("choosePoints");
    chooseButton.addEventListener('click', event => {
        //context.clearRect(0, 0, canvas.width, canvas.height);
        vertices = [];
        });

    const depthSlider = document.getElementById("depth");
    depthSlider.addEventListener('change', event => {
        depth = event.target.value;
        console.log(depth);
        updateCanvas(program);
    });

    let updateCanvas = (prog) => {
        //gl.createProgram(prog);
        gl.useProgram(prog);

        vertices = vertices.concat(createTriangle(pointA, pointB, pointC, depth));

        // Use black RGB=(0,0,0) for the clear color
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
        gl.viewport(0, 0, canvas.width, canvas.height);

        // clear the color buffer
        gl.clear(gl.COLOR_BUFFER_BIT);

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

        gl.drawArrays(gl.TRIANGLES,
            0,  /* starting index in the array */
            vertices.length/2); /* number of vertices to draw */
        vertices = [];
    };

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then( updateCanvas );
}

/***
 * Generated a triangle with triangles
 *
 */
function createTriangle(pointA, pointB, pointC, depth){

    if (depth > 0){
        let midpointAB = [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
        let midpointAC = [(pointA[0] + pointC[0]) / 2, (pointA[1] + pointC[1]) / 2];
        let midpointBC = [(pointB[0] + pointC[0]) / 2, (pointB[1] + pointC[1]) / 2];

        let runA = createTriangle(pointA, midpointAB, midpointAC, depth-1);
        let runB = createTriangle(midpointAB, pointB, midpointBC, depth-1);
        let runC = createTriangle(midpointAC, midpointBC, pointC, depth-1);

        return runA.concat(runB.concat(runC));
    } else {
        return pointA.concat(pointB.concat(pointC));
    }
}
