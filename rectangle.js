const { initShaders } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        // gl_PointSize = a_PointSize;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        // gl_FragColor = u_FragColor;
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

init((gl, canvas) => {

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        // TODO: xxx
        console.error('error loading')
        return
    }

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    const vertexBuffer = gl.createBuffer()

    const vertices = new Float32Array([
        - 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, - 0.5
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)


    // gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, 3)
    tick(gl, a_Position, u_FragColor, u_FragColor)

})

function init(render) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512

    document.body.appendChild(canvas)
    const gl = canvas.getContext('webgl')
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    render(gl, canvas)
}


function tick(gl, a_Position, a_PointSize, u_FragColor) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.vertexAttrib1f(a_PointSize, 20)
    gl.uniform4fv(u_FragColor, new Float32Array([1.0, 0.0, 0.0, 1.0]))
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}