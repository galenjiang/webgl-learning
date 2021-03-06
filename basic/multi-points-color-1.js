const { initShaders } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute float a_PointSize;
    attribute vec4 a_Color;
    // varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = a_PointSize;
        // v_Color = a_Color;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform float u_Width;
    uniform float u_Height;
    void main() {
        gl_FragColor = vec4(gl_FragCoord.x / u_Width, 0.0, 0.0, 1.0);
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
    // const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    const u_Width = gl.getUniformLocation(gl.program, 'u_Width')
    const u_Height = gl.getUniformLocation(gl.program, 'u_Height')


    const verticesSizes = new Float32Array([
        -1.0, 1.0, 10.0, 1.0, 0.0, 0.0,
        -1.0, -1.0, 20.0, 0.0, 1.0, 0.0,
        1.0, 1.0, 30.0, 0.0, 0.0, 1.0,
        1.0, -1.0, 30.0, 0.0, 0.0, 1.0,
    ])

    const vertexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

    const FSIZE = verticesSizes.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 6 * FSIZE, 0)
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 6 * FSIZE, FSIZE * 2)
    // gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, FSIZE * 3)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(a_PointSize)
    // gl.enableVertexAttribArray(a_Color)

    gl.uniform1f(u_Width, gl.drawingBufferWidth)
    gl.uniform1f(u_Height, gl.drawingBufferHeight)



    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)


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