function main() {
    let canvas = document.getElementById("my-canvas");

    //setupWebGL is defined in webgl-utils.js
    let gl = WebGLUtils.setupWebGL(canvas);
    
    // Use black RGB=(0,0,0) for the clear color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);
}

