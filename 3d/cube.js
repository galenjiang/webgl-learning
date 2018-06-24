import fetchShader from '../utils/fetch-shader.js'
const { initShaders } = window



init(async(gl, canvas) => {
    
    const [VSHADER_SOURCE, FSHADER_SOURCE] = await fetchShader('/3d/cube.vert', '/3d/cube.frag')

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('error loading')
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)

    const vertices = new Float32Array([
        
        // pisition         rgb
        1.1, 1.1, 1.1,      1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,     1.0, 0.0, 1.0,
        -1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
        1.0, -1.0, 1.0,     1.0, 1.0, 0.0,
        1.0, -1.0, -1.0,    0.0, 1.0, 0.0,
        1.0, 1.0, -1.0,     0.0, 1.0, 1.0,
        -1.0, 1.0, -1.0,    0.0, 0.0, 1.0,
        -1.0, -1.0, -1.0,   0.0, 0.0, 0.0,

    ])

    const indexs = new Uint8Array([
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5,

    ])
    const size = vertices.BYTES_PER_ELEMENT

    // const vm = new Matrix4()
    // vm.setLookAt(0.2, 0.25, 0.25, 0, 0, -1, 0, 1, 0)
    // const mm = new Matrix4()
    // mm.setRotate(-10, 0, 0, 1)
    // const vmm = vm.multiply(mm)

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    const u_m = gl.getUniformLocation(gl.program, 'u_m')


    const verticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * size, 0 * size)
    gl.enableVertexAttribArray(a_Position)
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * size, 3 * size)
    gl.enableVertexAttribArray(a_Color)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexs, gl.STATIC_DRAW)


    var Control = function() {
        this.rx = 0.00001
        this.ry = 0.00001
        this.rz = 0.00001
    };
      
    var c = new Control();
    var gui = new dat.GUI();

    const rx = gui.add(c, 'rx', -100, 100)
    const ry = gui.add(c, 'ry', -100, 100)
    const rz = gui.add(c, 'rz', -100, 100)



    function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        const m = new Matrix4()
            .setPerspective(30, 1, 1, 100)
            .lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
            .rotate(c.rx, 1.0, 0.0, 0.0)
            .rotate(c.ry, 0.0, 1.0, 0.0)
            .rotate(c.rz, 0.0, 0.0, 1.0)

        gl.uniformMatrix4fv(u_m, false, m.elements)

        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)

    }

    draw()

    rx.onChange(() => {
        draw()
    })
    ry.onChange(() => {
        draw()
    })
    rz.onChange(() => {
        draw()
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

