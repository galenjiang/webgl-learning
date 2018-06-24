const { initShaders, getWebGLContext, Matrix4 } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
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


    const state = draw(gl)


    let lastTime = null
    let delta = 0
    requestAnimationFrame(tick)
    // gl.clear(gl.COLOR_BUFFER_BIT)
    // gl.drawArrays(gl.POINTS, 0, 3)

    function tick(time) {
        if (lastTime) {
            delta = time - lastTime
        } else {
            delta = 0
        }
        lastTime = time

        state(delta)
        requestAnimationFrame(tick)
    }


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

function draw(gl) {
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    const vertexBuffer = gl.createBuffer()


    const vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_Position)

    const modelMatrix = new Matrix4()
    return (delta) => {

        const ANGLE = 45.0  // 45 deg / s

        const angle = delta / 1000 * ANGLE
        gl.clear(gl.COLOR_BUFFER_BIT)


        modelMatrix.rotate(angle, 0, 0, 1)
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)
        gl.uniform4fv(u_FragColor, new Float32Array([1.0, 1.0, 0.0, 1.0]))
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
    
    }
}