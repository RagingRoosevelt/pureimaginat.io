/**
 * Created by Theodore on 3/8/2017.
 */

let canvas = undefined;

$(function() {

    canvas = document.getElementById("canvas");

    window.onresize = function() {
        console.log("window resized");
        resizeCanvas();
    };

    resizeCanvas();
       
});

function resizeCanvas() {$(canvas).css("height", "100vh");
    $(canvas).css("width", "100vw");
    
    aspectRatio = ($(window).height() / $(window).width());
    
    canvas.width = 18;
    canvas.height = canvas.width * aspectRatio;
    
    var viewRange;  
    if (aspectRatio > (2/3)) {
        viewRange = {xmin: -2, 
                     xmax: 1, 
                     ymin: - 0.5 * 3 * aspectRatio, 
                     ymax: 0.5 * 3 * aspectRatio
                     };
    } else {
        viewRange = {xmin: -(2/3) * 2 / aspectRatio, 
                     xmax: (1/3) * 2 / aspectRatio, 
                     ymin: -1, 
                     ymax: 1
                     };
    }

    ctx = canvas.getContext("2d");
    
    drawMandlebrot(ctx, 
                   viewRange,
                   2,
                   10);
           
    /*
    while (2 * canvas.width < $(window).width()) {
        canvas.width *= 2;
        canvas.height *= 2;
        
        drawMandlebrot(ctx, 
                   viewRange,
                   2,
                   10);
      
        setTimeout(function() { canvas.width *= 2; canvas.height *= 2; drawMandlebrot(ctx, viewRange, radiusConvergence, maxIterations); }, 1000);
    }
    */
}

function newZ(z, c) {
    return z.pow(2).add(c)
}

function drawMandlebrot(ctx, viewRange, radiusConvergence, maxIterations) {
    console.log(canvas.width + "x" + canvas.height + " started (radius=" + radiusConvergence + ", maxIter=" + maxIterations + ")...");

    var preCanvas = document.createElement('canvas');
    preCanvas.width = canvas.width;
    preCanvas.height = canvas.height;
    var prectx = preCanvas.getContext('2d');
    
    var c, z, counter;
    for (var cx = 0; cx < canvas.width; cx += 1) {
        for (var cy = 0; cy < canvas.height; cy += 1) {
            var x = (cx / canvas.width) * (viewRange.xmax - viewRange.xmin) + viewRange.xmin;
            var y = (cy / canvas.height) * (viewRange.ymax - viewRange.ymin) + viewRange.ymin;
            
            c = new Complex([x,y]);
            z = new Complex(0);
            counter = 0;
            while (z.abs() < radiusConvergence && counter < maxIterations) {
                z = newZ(z,c);
                counter += 1;
            }
            prectx.fillStyle = iterations2color(counter, maxIterations);
            prectx.strokeStyle = iterations2color(counter, maxIterations);
            prectx.fillRect( cx, cy, 1, 1);
        }
    }    
        
    ctx.putImageData(prectx.getImageData(0,0,preCanvas.width,preCanvas.height), 0, 0);
    
    //ctx.font = "16px Arial";
    //ctx.fill = "#00000000"
    //ctx.fillText(canvas.width + "x" + canvas.height,1,15);
    
    //ctx.renderAll();
    
    console.log("\t ... done");
                   
    if (canvas.width < $(window).width() && true) {
        setTimeout(function() { canvas.width *= 2; canvas.height *= 2; drawMandlebrot(ctx, viewRange, radiusConvergence, maxIterations); }, 1000);
    } else if (maxIterations < 100) {
        setTimeout(function() { drawMandlebrot(ctx, viewRange, radiusConvergence, maxIterations + 5); }, 1000);
    }
}

function iterations2color(iter, maxIter) {
    return "hsl(0, 0%, " + 100*(maxIter-iter)/maxIter + "%)"
}