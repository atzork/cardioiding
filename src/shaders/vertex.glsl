#version 100

attribute vec2 vertexPosition;

void main() {
    gl_Position = vec4(vertexPosition, 0, 1);
}