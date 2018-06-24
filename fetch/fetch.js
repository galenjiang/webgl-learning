import fetchShader from '../utils/fetch-shader.js'
const { initShaders } = window



init(async(gl, canvas) => {
    
    const [VSHADER_SOURCE, FSHADER_SOURCE] = await fetchShader('/fetch/one-point.frag', '/fetch/one-point.vert')

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        // TODO: xxx
        console.error('error loading')
        return
    }

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    // gl.vertexAttrib4fv(a_Position, new Float32Array([0.5, 0.0, 0.0, 1.0]))
    // gl.vertexAttrib1f(a_PointSize, 20)
    // gl.drawArrays(gl.POINTS, 0, 1)

    const tick = drawTick()
    canvas.addEventListener('click', (e) => {
        mouseMoveHandler(e, (x, y) => {
            tick(gl, x, y, a_Position, a_PointSize, u_FragColor)
        })
    })

})

function init(render) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512

    document.body.appendChild(canvas)
    const gl = canvas.getContext('webgl')
    render(gl, canvas)
}

function mouseMoveHandler(e, fn) {
    const left = e.target.offsetLeft
    const top = e.target.offsetTop
    const width = e.target.offsetWidth
    const height = e.target.offsetHeight
    const x = -1 + (e.pageX - left) / width * 2
    const y = 1 - (e.pageY - top) / height * 2
    fn(x, y)
}

function drawTick() {
    const points = []
    const colors = []
    return (gl, x, y, a_Position, a_PointSize, u_FragColor) => {
        gl.clear(gl.COLOR_BUFFER_BIT)
        const point = new Float32Array([x, y, 0.0, 1.0])
        const color = new Float32Array([x / 2 + 0.5, y / 2 + 0.5, 0.0, 1.0])
        // const color = new Float32Array([0.5, 0.5, 0.0, 1.0])
        points.push(point)
        colors.push(color)



        points.forEach((p, i) => {
            gl.vertexAttrib4fv(a_Position, p)
            gl.vertexAttrib1f(a_PointSize, 20)
            gl.uniform4fv(u_FragColor, colors[i])
            gl.drawArrays(gl.POINTS, 0, 1)
        })

    }
}