var m = Math;

var canvas;
var ctx;

var d = {};
var map = {
    xScale: undefined,
    xRange: 3,
    xMin: -1,
    yScale: undefined,
    yRange: undefined,
    yMin: undefined,
    x: function(x){return this.xRange * x * this.xScale + this.xMin;},
    y: function(y){return this.yRange * y * this.yScale + this.yMin;},
    init: function(w, h) {
        this.xScale = 1 / w;
        this.yScale = 1 / h;
        this.yRange = 3 * h / w;
        this.yMin = - this.yRange / 2;
    },
    color: function(iter, maxIter) {
        return 'hsl(' + m.round(180 * iter / maxIter) + ', 100%, 50%)'
    }
}

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
    d.pix_w = parseInt(d3.select("body").style("width"));
    d.pix_h = parseInt(d3.select("body").style("height"));
    
    d.blockSize = 2**(m.floor(m.log2(d.pix_h))-3);
    
    canvas.attr("width", d.pix_w);
    canvas.attr("height", d.pix_h);
    
    ctx.fillStyle="rgb(0,0,0)";
    ctx.rect(0, 0, d.pix_w, d.pix_h);
    ctx.fill();
    
    d.x_off = m.floor((d.pix_w % d.blockSize) / 2);
    d.y_off = m.floor((d.pix_h % d.blockSize) / 2);
    
    d.w = d.pix_w - d.pix_w % d.blockSize;
    d.h = d.pix_h - d.pix_h % d.blockSize
    
    d.b = new Array(d.h);
    for (var i=0; i < d.h; i++) {
        d.b[i] = new Array(d.w);
    }
    
    map.init(d.w, d.h);
    
    draw();
}

async function draw() {
    console.log("Block size is " + d.blockSize);
    var iter = 0;
    var maxIter = 50;
    var tol = 0.0001;
    
    for (var y = 0; y < d.h; y += d.blockSize) {
        for (var x = 0; x < d.w; x += d.blockSize) {
            iter = countIterations(0.5 * (x+d.blockSize), 0.5 * (y+d.blockSize), tol, maxIter);

            //console.log('(' + x + ', ' + y + ') or (' + map.x(x) + ', ' + map.y(y) + '): ' + iter);
            ctx.fillStyle = map.color(iter, maxIter);
            
            ctx.fillRect(x+d.x_off, y+d.y_off, d.blockSize, d.blockSize);
            await sleep(0.01);
        
        }
    }
    //return;
    if (d.blockSize > 1) {
        d.blockSize = d.blockSize / 2;
        await sleep(100);
        draw();
    }
}

function countIterations(x, y, tol, maxIter) {
    maxIter = maxIter || 100;
    tol = tol || 0.1
    
    var p = Complex(0, 0);
    var c = Complex(map.x(x), map.y(y));
    var oldP = undefined;
    
    var count = 0;
    while ((oldP == undefined || p.sub(oldP).l2norm() > tol) && count < maxIter) {
        oldP = p.copy();
        p = p.sq().add(c);
        count += 1;
    }
    return count;
}

function Complex(re, im) {
    var me = {}
    me.im = im;
    me.re = re;
    
    me.add = function(other) {
        if (other.re && other.im) {
            return Complex(me.re + other.re, me.im + other.im);
        } else {
            return Complex(me.re + other, me.im);
        }
    }
    me.sub = function(other) {
        if (other.re && other.im) {
            return Complex(me.re - other.re, me.im - other.im);
        } else {
            return Complex(me.re - other.re, me.im);
        }
    }
    me.mult = function(other) {
        if (other.re && other.im) {
            return Complex(me.re * other.re - me.im * other.im, me.re*other.im + me.im * other.im);
        } else {
            return Complex(me.re * other, me.im * other);
        }
    }
    me.div = function(other) {
        if (other.re && other.im) {
            var t = 1/(other.re**2 + other.im**2);
            return Complex(t*(me.re * other.re + me.im * other.im), t*(me.im * other.re - me.re * other.im));
        } else {
            return Complex(me.re / other, me.im / other);
        }
    }
    me.eq = function(other) {
        return me.re == other.re && me.im == other.im;
    }
    me.l2norm = function() {
        return m.sqrt(me.im**2 + me.re**2)
    }
    me.sq = function() {
        return Complex(me.re * me.re - me.im * me.im, me.re * me.im + me.im * me.im);
    }
    me.copy = function() {
        return Complex(me.re, me.im);
    }
    me.toString = function() {
        return '' + me.re + '+' + me.im + 'i';
    }
    return me;
}