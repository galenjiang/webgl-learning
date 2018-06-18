const { initShaders } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    // uniform vec4 u_Translation;
    uniform float u_CosB, u_SinB;
    void main() {
        // gl_Position = a_Position + u_Translation;
        // gl_Position = a_Position;

        gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
        gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
        gl_Position.z = 0.0;
        gl_Position.w = 1.0;
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
    // const u_Translation = gl.getUniformLocation(gl.program, 'u_Translation')
    const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB')
    const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    const vertexBuffer = gl.createBuffer()
    const ANGLE = 90.0 / 180 * Math.PI

    const vertices = new Float32Array([
        0.0, 0.5, -0.5, 0.0, 0.5, 0.0
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.uniform4fv(u_Translation, new Float32Array([0.5, 0.5, 0.0, 0.0]))
    gl.uniform1f(u_CosB, Math.cos(ANGLE))
    gl.uniform1f(u_SinB, Math.sin(ANGLE))
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
    const gl = canvas.getContext('webgl')
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    render(gl, canvas)
}

