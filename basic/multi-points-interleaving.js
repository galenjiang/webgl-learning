const { initShaders } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    void main() {
        gl_Position = a_Position;
        // gl_PointSize = 10.0;
        gl_PointSize = a_PointSize;
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


    const verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ])

    const vertexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

    const FSIZE = verticesSizes.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * FSIZE, 0)
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * FSIZE, FSIZE * 2)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(a_PointSize)



    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.vertexAttrib1f(a_PointSize, 20)
    gl.uniform4fv(u_FragColor, new Float32Array([1.0, 0.0, 0.0, 1.0]))
    gl.drawArrays(gl.POINTS, 0, 3)


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

}