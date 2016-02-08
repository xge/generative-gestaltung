(function() {
  var bbox, canvas, ctx, diagram, fil, generateCorners, generatePoint, generatePoints, id, init, margin, points, render, str, voronoi;

  bbox = void 0;

  canvas = void 0;

  ctx = void 0;

  id = void 0;

  diagram = void 0;

  points = [];

  voronoi = new Voronoi;

  margin = 0;

  str = '#eee';

  fil = '#36f';

  init = function() {
    var n;
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = fil;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.1;
    bbox = {
      left: 0,
      right: canvas.width,
      top: 0,
      bottom: canvas.height
    };
    n = Math.ceil(canvas.width / 10);
    generatePoints(n);
    return render();
  };

  generatePoints = function(n) {
    var i, results;
    i = 0;
    results = [];
    while (i < n - 4) {
      points.push(generatePoint(fil));
      results.push(i++);
    }
    return results;
  };

  generateCorners = function() {
    points.push({
      x: 0,
      y: 0,
      c: fil
    });
    points.push({
      x: canvas.width,
      y: 0,
      c: fil
    });
    points.push({
      x: canvas.width,
      y: canvas.height,
      c: fil
    });
    return points.push({
      x: 0,
      y: canvas.height,
      c: fil
    });
  };

  generatePoint = function(color) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      c: color
    };
  };

  render = function() {
    var NEW, cell, halfEdge, halfEdges, i, j, k, len, len1, ref, v;
    NEW = 2;
    points.splice(0, NEW);
    i = 0;
    while (i < NEW) {
      points.push(generatePoint(fil));
      i++;
    }
    generateCorners();
    voronoi.recycle(diagram);
    diagram = voronoi.compute(points, bbox);
    points.splice(points.length - 4, 4);
    ctx.save();
    ref = diagram.cells;
    for (j = 0, len = ref.length; j < len; j++) {
      cell = ref[j];
      halfEdges = cell.halfedges;
      v = halfEdges[0].getStartpoint();
      ctx.beginPath();
      ctx.moveTo(v.x, v.y);
      for (k = 0, len1 = halfEdges.length; k < len1; k++) {
        halfEdge = halfEdges[k];
        v = halfEdge.getEndpoint();
        ctx.lineTo(v.x, v.y);
        ctx.fillStyle = cell.site.c;
        ctx.fill();
        ctx.strokeStyle = str;
        ctx.stroke();
      }
    }
    ctx.restore();
    return window.setTimeout(render, 200);
  };

  init();

}).call(this);
