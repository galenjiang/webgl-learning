const { initShaders } = window

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec2 a_TexCoord;
    varying vec2 v_TexCoord;
    void main() {
        gl_Position = a_Position;
        v_TexCoord = a_TexCoord;
    }
`

const FSHADER_SOURCE = `
    precision mediump float;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    varying vec2 v_TexCoord;
    void main() {
        // gl_FragColor = texture2D(u_Sampler0, v_TexCoord);
        // gl_FragColor = texture2D(u_Sampler1, v_TexCoord);
        gl_FragColor = texture2D(u_Sampler0, v_TexCoord) * texture2D(u_Sampler1, v_TexCoord);
    }
`

init((gl, canvas) => {

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        // TODO: xxx
        console.error('error loading')
        return
    }





    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord')
    // const a_Color = gl.getAttribLocation(gl.program, 'a_Color')

    const vertices = new Float32Array([
        -.5, 0.5,      0.0, 1.0,
        -0.5, -0.5,    0.0, 0.0,
        0.5, 0.5,      1.0, 1.0,
        0.5, -0.5,     1.0, 0.0,
    ])

    const buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const FSIZE = vertices.BYTES_PER_ELEMENT

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4 * FSIZE, 0)
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(a_TexCoord)
    // gl.enableVertexAttribArray(a_Color)


    Promise.all([
        loadTexture(gl, '/img/avatar.jpg', 'u_Sampler0', 0),
        loadTexture(gl, '/img/uvtest.png', 'u_Sampler1', 1),
    ])
        .then(() => {
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        })






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

function loadTexture(gl, src, sampler, index) {
    return new Promise((resolve) => {
        const texture = gl.createTexture()
        const u_Sampler = gl.getUniformLocation(gl.program, sampler)
        const image = new Image()
        image.addEventListener('load', () => {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            gl.activeTexture(gl[`TEXTURE${index}`])
            gl.bindTexture(gl.TEXTURE_2D, texture)
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
            gl.uniform1i(u_Sampler, index)
            resolve()
        })
        image.src = src
    })


}

function tick(gl, a_Position, a_PointSize, u_FragColor) {

}