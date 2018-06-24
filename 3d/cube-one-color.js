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

    var vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
     ]);
   
     var colors = new Float32Array([     // Colors
       0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
       0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
       1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
       1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
       1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
       0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
     ]);

    const size = vertices.BYTES_PER_ELEMENT

    // const vm = new Matrix4()
    // vm.setLookAt(0.2, 0.25, 0.25, 0, 0, -1, 0, 1, 0)
    // const mm = new Matrix4()
    // mm.setRotate(-10, 0, 0, 1)
    // const vmm = vm.multiply(mm)


    const u_m = gl.getUniformLocation(gl.program, 'u_m')


    initBuffer(vertices, 'a_Position')
    initBuffer(colors, 'a_Color')

    
    const indexs = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back

    ])
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

    function initBuffer(data, variantName) {
        const location = gl.getAttribLocation(gl.program, variantName)
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 3 * size, 0 * size)
        gl.enableVertexAttribArray(location)
    }

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

