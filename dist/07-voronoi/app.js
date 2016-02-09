(function() {
  var N_POINTS, addPoint, bbox, canvas, ctx, diagram, drawLine, drawPoints, fil, generateCorners, generatePoint, generatePoints, id, init, lin, lines, margin, mou, points, render, str, t, voronoi;

  bbox = canvas = ctx = id = diagram = void 0;

  drawPoints = false;

  drawLine = true;

  points = [];

  lines = [];

  voronoi = new Voronoi;

  margin = t = N_POINTS = 0;

  str = 'rgba(255, 255, 255, 0.1)';

  fil = 'rgba(20, 20, 20, 1.0)';

  mou = 'rgba(20, 40, 100, 0.3)';

  lin = 'rgba(20, 40, 100, 0.5)';

  init = function() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.onclick = addPoint;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = fil;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    bbox = {
      left: 0,
      right: canvas.width,
      top: 0,
      bottom: canvas.height
    };
    N_POINTS = Math.ceil(canvas.width / 50);
    generatePoints(N_POINTS);
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

  addPoint = function(e) {
    var body, doc, eventDoc;
    if (event.pageX === null && event.clientX !== null) {
      eventDoc = event.target && event.target.ownerDocument || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;
      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }
    lines.push({
      x: event.pageX,
      y: event.pageY
    });
    points.push({
      x: event.pageX + 100 * Math.random(),
      y: event.pageY + 100 * Math.random(),
      c: mou
    });
    points.push({
      x: event.pageX,
      y: event.pageY,
      c: mou
    });
    return points.push({
      x: event.pageX - 100 * Math.random(),
      y: event.pageY - 100 * Math.random(),
      c: mou
    });
  };

  render = function() {
    var NEW, cell, halfEdge, halfEdges, i, j, k, l, len, len1, len2, len3, line, m, point, ref, size, v;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (t % 60 === 0) {
      NEW = 1;
      points.splice(0, NEW);
      i = 0;
      while (i < NEW) {
        if (points.length < N_POINTS) {
          points.push(generatePoint(fil));
        }
        i++;
      }
      generateCorners();
      voronoi.recycle(diagram);
      diagram = voronoi.compute(points, bbox);
      points.splice(points.length - 4, 4);
    }
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
        ctx.lineWidth = 1;
        ctx.strokeStyle = str;
        ctx.stroke();
      }
    }
    if (drawPoints) {
      for (l = 0, len2 = points.length; l < len2; l++) {
        point = points[l];
        ctx.fillStyle = str;
        size = 4;
        ctx.fillRect(point.x, point.y, size, size);
      }
    }
    if (drawLine && lines.length > 0) {
      ctx.beginPath();
      ctx.moveTo(lines[0].x, lines[0].y);
      for (m = 0, len3 = lines.length; m < len3; m++) {
        line = lines[m];
        ctx.lineTo(line.x, line.y);
      }
      ctx.lineWidth = 5;
      ctx.strokeStyle = lin;
      ctx.stroke();
    }
    ctx.restore();
    return t = requestAnimationFrame(render);
  };

  init();

}).call(this);
