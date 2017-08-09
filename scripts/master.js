/**
 * Created by Theodore on 3/3/2017.
 */

let canvas = undefined;
let gl = undefined;

$(function() {

    canvas = document.getElementById("canvas");

    window.onresize = function() {
        console.log("window resized");
        resizeCanvas();
    };


    gl = initWebGL(canvas);

    // Only continue if WebGL is available and working
    if (!gl) {
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    resizeCanvas();


});

function initWebGL(canvas) {
    gl = null;

    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
    }

    return gl;
}

function resizeCanvas() {
    if ($(window).height() > 1080 || $(window).width() > 1920) {
        $(canvas).css("height", "100vh");
        $(canvas).css("width", "100vw");
        canvas.height = Math.round($(window).height() / 2);
        canvas.width = Math.round($(window).width() / 2);
    } else {
        $(canvas).css("height", "");
        $(canvas).css("width", "");
        canvas.height = $(window).height();
        canvas.width = $(window).width();
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
}


