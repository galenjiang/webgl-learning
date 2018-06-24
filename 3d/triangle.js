import fetchShader from '../utils/fetch-shader.js'
const { initShaders } = window



init(async(gl, canvas) => {
    
    const [VSHADER_SOURCE, FSHADER_SOURCE] = await fetchShader('/3d/triangle.vert', '/3d/triangle.frag')

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('error loading')
        return
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const data = new Float32Array([
        // pisition         rgb
        0.0, 0.5, -0.2,       1.0, 0.0, 0.0,
        -0.5, -0.5, -0.2,     0.0, 1.0, 0.0,
        0.5, -0.5, -0.2,      0.0, 0.0, 1.0,
        
        // pisition         rgb
        0.0, -0.5, -0.5,       1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5,     0.0, 1.0, 0.0,
        0.5, 0.5, -0.5,      0.0, 0.0, 1.0,
        
        // pisition         rgb
        0.0, 0.5, -0.8,       1.0, 0.0, 0.0,
        -0.5, -0.5, -0.8,     0.0, 1.0, 0.0,
        0.5, -0.5, -0.8,      0.0, 0.0, 1.0,
    ])
    const size = data.BYTES_PER_ELEMENT

    // const vm = new Matrix4()
    // vm.setLookAt(0.2, 0.25, 0.25, 0, 0, -1, 0, 1, 0)
    // const mm = new Matrix4()
    // mm.setRotate(-10, 0, 0, 1)
    // const vmm = vm.multiply(mm)

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
    const a_Color = gl.getAttribLocation(gl.program, 'a_Color')
    // const u_vm = gl.getUniformLocation(gl.program, 'u_vm')
    // const u_mm = gl.getUniformLocation(gl.program, 'u_mm')
    const u_vmm = gl.getUniformLocation(gl.program, 'u_vmm')

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * size, 0 * size)
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * size, 3 * size)
    gl.enableVertexAttribArray(a_Position)
    gl.enableVertexAttribArray(a_Color)

    // gl.uniformMatrix4fv(u_vm, false, vm.elements)
    // gl.uniformMatrix4fv(u_mm, false, mm.elements)


    var Control = function() {
        this.far = 1
        this.x = 0.00001
        this.y = 0.00001
        this.z = 0.00001
        this.rz = 0.00001
        this.fov = 45
    };
      
    var c = new Control();
    var gui = new dat.GUI();
    const far = gui.add(c, 'far', 0, 25.0001)
    const fov = gui.add(c, 'fov', 0, 180)
    const x = gui.add(c, 'x', -1, 1)
    const y = gui.add(c, 'y', -1, 1)
    const z = gui.add(c, 'z', -1, 1)
    const rz = gui.add(c, 'rz', -50, 50)


    function draw() {
        
        let vmm = new Matrix4()
        vmm
            .ortho(-1.0, 1.0, -1.0, 1.0, 0.0, c.far)
            .lookAt(c.x, c.y, c.z, 0.0, 0.0, -1.0, 0, 1, 0)
            .rotate(c.rz, 0, 0, 1)
        
        // vmm
        //     .perspective(c.fov, 1, 0.001, c.far)
        //     .lookAt(c.x, c.y, c.z, 0.0, 0.0, -1.0, 0, 1, 0)
        //     .rotate(c.rz, 0, 0, 1)
        gl.uniformMatrix4fv(u_vmm, false, vmm.elements)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 9)
    }

    draw()

    far.onChange((value) => {

        draw()
    })

    x.onChange((value) => {

        draw()
    })
    y.onChange((value) => {

        draw()
    })

    z.onChange((value) => {

        draw()
    })

    rz.onChange((value) => {

        draw()
    })

    fov.onChange((value) => {

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

