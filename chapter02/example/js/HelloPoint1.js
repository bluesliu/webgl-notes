// 顶点着色器
var VSHADER_SOURCE = 
  'void main() {\n' +
  '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
  '  gl_PointSize = 20.0;\n' +                    // Set the point size
  '}\n';

// 片元着色器
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
  '}\n';


function main() {
    var canvas = document.getElementById('webgl');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // 创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (vertexShader == null) {
        console.log('unable to create shader');
        return null;
    }
    // 设置着色程序
    gl.shaderSource(vertexShader, VSHADER_SOURCE);
    // 编译着色器
    gl.compileShader(vertexShader);
    // 检查编译的结果
    var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(vertexShader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(vertexShader);
        return null;
    }

    // 创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // 设置着色程序
    gl.shaderSource(fragmentShader, FSHADER_SOURCE);
    // 编译着色器
    gl.compileShader(fragmentShader);
    // 检查编译的结果
    var compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(fragmentShader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(fragmentShader);
        return null;
    }

    // 创建程序对象
    var program = gl.createProgram();
    if (!program) {
        return null;
    }

    // 附加着色器对象
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // 链接程序对象
    gl.linkProgram(program);

    // 检查链接的结果
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }

    // 使用程序对象
    gl.useProgram(program);
    gl.program = program;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}