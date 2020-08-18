// 顶点着色器
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 20.0;\n' +
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

    var a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log('未能获取 a_Position 的存储位置');
        return;
    }
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    canvas.onmousedown = function(evt) {
        click(evt, gl, canvas, a_Position);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];

function click(evt, gl, canvas, a_Position) {
    var x = evt.clientX;
    var y = evt.clientY;
    var rect = evt.target.getBoundingClientRect();
    x = ((x-rect.left) - canvas.width/2) / (canvas.width/2);
    y = (canvas.height/2-(y-rect.top) )/ (canvas.height/2);
    g_points.push(x);
    g_points.push(y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_points.length;
    for(var i=0; i<len; i+=2) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}