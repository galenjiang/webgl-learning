const { initShaders, getWebGLContext } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main() {
        gl_Position = u_xformMatrix * a_Position;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }
`

init((gl, canvas) => {

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        // TODO: xxx
        console.error('error loading')
        return
    }

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    // const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation')
    const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    const vertexBuffer = gl.createBuffer()
    const ANGLE = 15.0 / 180 * Math.PI

    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.uniform4fv(u_Translation, new Float32Array([0.5, 0.5, 0.0, 0.0]))
    gl.uniformMatrix4fv(u_xformMatrix, false, new Float32Array([
        Math.cos(ANGLE), Math.sin(ANGLE), 0.0, 0.0,
        -Math.sin(ANGLE), Math.cos(ANGLE), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ]))
    gl.uniform4fv(u_FragColor, new Float32Array([1.0, 1.0, 0.0, 1.0]))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)

    // gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, 3)

})

function init(render) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512

    document.body.appendChild(canvas)
    const gl = getWebGLContext(canvas, true)
    // const gl = canvas.getContext('webgl')
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    render(gl, canvas)
}

