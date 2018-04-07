var m = Math;

var canvas;
var ctx;

var c = {};

window.onresize = resizeCanvas;

window.onload = function() {
    canvas = d3.select("canvas#c");
    ctx = canvas.node().getContext("2d");
    
    resizeCanvas();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resizeCanvas() {
    c.pix_w = parseInt(d3.select("body").style("width"));
    c.pix_h = parseInt(d3.select("body").style("height"));
    
    c.blockSize = 2**(m.floor(m.log2(c.pix_h))-3);
    
    canvas.attr("width", c.pix_w);
    canvas.attr("height", c.pix_h);
    
    ctx.fillStyle="rgb(0,0,0)";
    ctx.rect(0, 0, c.pix_w, c.pix_h);
    ctx.fill();
    
    c.x_off = m.floor((c.pix_w % c.blockSize) / 2);
    c.y_off = m.floor((c.pix_h % c.blockSize) / 2);
    
    c.w = c.pix_w - c.pix_w % c.blockSize;
    c.h = c.pix_h - c.pix_h % c.blockSize
    
    c.b = new Array(c.h);
    for (var i=0; i < c.h; i++) {
        c.b[i] = new Array(c.w);
    }
    
    draw();
}

async function draw() {
    console.log("Block size is " + c.blockSize);
    for (var y = 0; y < c.h; y += c.blockSize) {
        for (var x = 0; x < c.w; x += c.blockSize) {
            ctx.strokeStyle = "rgb(255,255,255)";
            ctx.rect(x+c.x_off, y+c.y_off, c.blockSize, c.blockSize);
            ctx.stroke();
            await sleep(0.01);
        }
    }
    if (c.blockSize > 1) {
        c.blockSize = c.blockSize / 2;
        await sleep(100);
        draw();
    }
}