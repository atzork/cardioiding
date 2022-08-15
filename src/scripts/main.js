import {loadShaders} from "./resources.js";

init()

function init() {
    loadShaders()
        .then((shaders) => start(shaders))
        .catch((e) => console.error(`Shaders loading error`, e))
}

function start([vertexShaderSource, fragmentShaderSource]) {
    const gl = document.getElementById('canvas').getContext('webgl');
    if (!gl) {
        console.error('WebGl does not supported!!')
        return
    }
    gl.canvas.width = gl.canvas.clientWidth
    gl.canvas.height = gl.canvas.clientHeight

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader))
        return;
    }

    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader))
        return;
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        return;
    }

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    const vertexArray = [
        0.0, 0.5,
        0.5, -0.5,
        -0.5, -0.5
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW)

    const positionAttribute = gl.getAttribLocation(program, 'vertexPosition')
    gl.vertexAttribPointer(
        positionAttribute,
        2,
        gl.FLOAT,
        false,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0 * Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(positionAttribute)

    gl.clearColor(.75, .9, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
}