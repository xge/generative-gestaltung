(function() {
  var LineRenderer, N_POINTS, PointsOnlyRenderer, VoronoiRenderer, addPoint, bbox, canvas, ctx, currentRenderer, diagram, drawLine, drawPoints, fil, generatePoint, generatePoints, handleKeyPress, id, init, lin, lines, margin, mou, pnt, points, render, str, t;

  VoronoiRenderer = (function() {
    function VoronoiRenderer(ctx1, width, height) {
      this.ctx = ctx1;
      this.voronoi = new Voronoi();
      this.bbox = {
        xl: 0,
        xr: width,
        yt: 0,
        yb: height
      };
    }

    VoronoiRenderer.prototype.render = function(points) {
      var cell, diagram, halfEdge, halfEdges, i, j, k, len, len1, point, ref, results, v;
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x += Math.sin(t / 100 + i) / 10;
        point.y += Math.sin(t / 100 + i) / 10;
      }
      this.voronoi.recycle(diagram);
      diagram = this.voronoi.compute(points, this.bbox);
      ref = diagram.cells;
      results = [];
      for (k = 0, len1 = ref.length; k < len1; k++) {
        cell = ref[k];
        halfEdges = cell.halfedges;
        if (halfEdges.length > 2) {
          v = halfEdges[0].getStartpoint();
          this.ctx.beginPath();
          this.ctx.moveTo(v.x, v.y);
          results.push((function() {
            var l, len2, results1;
            results1 = [];
            for (l = 0, len2 = halfEdges.length; l < len2; l++) {
              halfEdge = halfEdges[l];
              v = halfEdge.getEndpoint();
              this.ctx.lineTo(v.x, v.y);
              this.ctx.fillStyle = cell.site.c;
              this.ctx.fill();
              this.ctx.lineWidth = 1;
              this.ctx.strokeStyle = str;
              results1.push(this.ctx.stroke());
            }
            return results1;
          }).call(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    return VoronoiRenderer;

  })();

  LineRenderer = (function() {
    function LineRenderer(ctx1, width1, height1) {
      this.ctx = ctx1;
      this.width = width1;
      this.height = height1;
    }

    LineRenderer.prototype.render = function(points) {
      var i, j, k, len, len1, point;
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x += Math.sin(t / 100 + i) / 10;
        point.y += Math.sin(t / 100 + i) / 10;
      }
      this.ctx.fillStyle = fil;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (k = 0, len1 = points.length; k < len1; k++) {
        point = points[k];
        this.ctx.lineTo(point.x, point.y);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = str;
      return this.ctx.stroke();
    };

    return LineRenderer;

  })();

  PointsOnlyRenderer = (function() {
    function PointsOnlyRenderer(ctx1, width1, height1) {
      this.ctx = ctx1;
      this.width = width1;
      this.height = height1;
    }

    PointsOnlyRenderer.prototype.render = function(points) {
      var i, j, len, point;
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x += Math.sin(t / 100 + i) / 10;
        point.y += Math.sin(t / 100 + i) / 10;
      }
      this.ctx.fillStyle = fil;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    return PointsOnlyRenderer;

  })();

  bbox = canvas = ctx = id = diagram = currentRenderer = void 0;

  drawPoints = true;

  drawLine = false;

  points = [];

  lines = [];

  margin = t = N_POINTS = 0;

  str = 'rgba(255, 255, 255, 0.2)';

  fil = 'rgba(20, 20, 20, 1.0)';

  mou = 'rgba(20, 40, 100, 0.3)';

  lin = 'rgba(20, 40, 100, 0.5)';

  pnt = 'rgba(255, 255, 255, 0.5)';

  init = function() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.onclick = addPoint;
    document.onkeypress = handleKeyPress;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = fil;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
    N_POINTS = Math.ceil(canvas.width / 40);
    generatePoints(N_POINTS);
    return render();
  };

  generatePoints = function(n) {
    var i, results;
    i = 0;
    results = [];
    while (i < n) {
      points.push(generatePoint(fil));
      results.push(i++);
    }
    return results;
  };

  generatePoint = function(color) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      c: color
    };
  };

  handleKeyPress = function(e) {
    switch (e.code) {
      case "KeyV":
        return currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height);
      case "KeyL":
        return currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height);
      case "KeyN":
      case "KeyP":
        return currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
    }
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
    return points.push({
      x: event.pageX,
      y: event.pageY,
      c: mou
    });
  };

  render = function() {
    var i, j, k, len, len1, line, point, size;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    currentRenderer.render(points);
    if (drawPoints) {
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        ctx.fillStyle = pnt;
        ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.01);
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    if (drawLine && lines.length > 0) {
      ctx.beginPath();
      ctx.moveTo(lines[0].x, lines[0].y);
      for (k = 0, len1 = lines.length; k < len1; k++) {
        line = lines[k];
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
