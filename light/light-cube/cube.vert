attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;
uniform mat4 u_vm;
uniform mat4 u_mm;
uniform mat4 u_vmm; // 逆转置矩阵
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection; // normalized
varying vec4 v_Color;
void main() {
    gl_Position = u_vm * u_mm * a_Position;
    vec3 n = normalize(vec3(u_vmm * a_Normal)); // 法向量也要进行旋转

    float nDotL = max(dot(n, u_LightDirection), 0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDotL;
    v_Color = vec4(diffuse, a_Color.a);
}