attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 u_m;
varying vec4 v_Color;
void main() {
    gl_Position = u_m * a_Position;
    v_Color = a_Color;
}