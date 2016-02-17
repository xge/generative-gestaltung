(function() {
  var COLORS, CellMover, CircleMover, LineRenderer, MoveToCircleMover, N_POINTS, PointsOnlyRenderer, VoronoiRenderer, addPoint, bbox, canvas, ctx, currentMover, currentRenderer, diagram, drawLine, drawPoints, generatePoint, generatePoints, handleKeyPress, id, init, margin, points, render, t;

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
      var cell, diagram, halfEdge, halfEdges, j, len, ref, results, v;
      this.voronoi.recycle(diagram);
      diagram = this.voronoi.compute(points, this.bbox);
      ref = diagram.cells;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        halfEdges = cell.halfedges;
        if (halfEdges.length > 2) {
          v = halfEdges[0].getStartpoint();
          this.ctx.beginPath();
          this.ctx.moveTo(v.x, v.y);
          results.push((function() {
            var k, len1, results1;
            results1 = [];
            for (k = 0, len1 = halfEdges.length; k < len1; k++) {
              halfEdge = halfEdges[k];
              v = halfEdge.getEndpoint();
              this.ctx.lineTo(v.x, v.y);
              this.ctx.fillStyle = cell.site.c;
              this.ctx.fill();
              this.ctx.lineWidth = 1;
              this.ctx.strokeStyle = COLORS.STROKE;
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

    VoronoiRenderer.prototype.renderPoints = function(points) {
      var i, j, len, point, results, size;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        this.ctx.fillStyle = COLORS.POINT;
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.1);
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.closePath();
        results.push(this.ctx.fill());
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
      var j, len, point;
      this.ctx.fillStyle = COLORS.FILL;
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (j = 0, len = points.length; j < len; j++) {
        point = points[j];
        this.ctx.lineTo(point.x, point.y);
      }
      this.ctx.closePath();
      this.ctx.strokeStyle = COLORS.STROKE;
      return this.ctx.stroke();
    };

    LineRenderer.prototype.renderPoints = function(points) {
      var i, j, len, point, results, size;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        this.ctx.fillStyle = COLORS.POINT;
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.1);
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
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
      this.ctx.fillStyle = COLORS.FILL;
      return this.ctx.fillRect(0, 0, this.width, this.height);
    };

    PointsOnlyRenderer.prototype.renderPoints = function(points) {
      var i, j, len, point, results, size;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        this.ctx.fillStyle = COLORS.POINT;
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.1);
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
    };

    return PointsOnlyRenderer;

  })();

  MoveToCircleMover = (function() {
    function MoveToCircleMover() {
      this.centerX = window.innerWidth / 2;
      this.centerY = window.innerHeight / 2;
      this.r = window.innerHeight / 4;
    }

    MoveToCircleMover.prototype.blend = function(x, y, t) {
      var range;
      x = Math.ceil(x);
      y = Math.ceil(y);
      t = Math.ceil(t);
      range = Math.max(x, y) - Math.min(x, y);
      return Math.min(x, y) + t * (range / 100);
    };

    MoveToCircleMover.prototype.move = function(points, t) {
      var i, j, len, newX, newY, point, results;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        newX = this.centerX + this.r * Math.cos(2 * (i + 1) * Math.PI / points.length);
        point.x = this.blend(point.x, newX, t % 10);
        newY = this.centerY + this.r * Math.sin(2 * (i + 1) * Math.PI / points.length);
        results.push(point.y = this.blend(point.y, newY, t % 10));
      }
      return results;
    };

    return MoveToCircleMover;

  })();

  CircleMover = (function() {
    function CircleMover() {
      this.centerX = window.innerWidth / 2;
      this.centerY = window.innerHeight / 2;
      this.r = window.innerHeight / 4;
    }

    CircleMover.prototype.move = function(points) {
      var i, j, len, point, results;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x = this.centerX + this.r * Math.cos(2 * (i + 1) * Math.PI / points.length);
        results.push(point.y = this.centerY + this.r * Math.sin(2 * (i + 1) * Math.PI / points.length));
      }
      return results;
    };

    return CircleMover;

  })();

  CellMover = (function() {
    function CellMover() {}

    CellMover.prototype.move = function(points) {
      var i, j, len, point;
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x += Math.sin(t / 100 + i) / 10;
        point.y += Math.sin(t / 100 + i) / 10;
      }
      return points;
    };

    return CellMover;

  })();

  bbox = canvas = ctx = id = diagram = currentRenderer = currentMover = void 0;

  drawPoints = true;

  drawLine = false;

  points = [];

  margin = t = N_POINTS = 0;

  COLORS = {
    STROKE: 'rgba(255, 255, 255, 0.2)',
    FILL: 'rgba(20, 20, 20, 1.0)',
    MOUSE: 'rgba(20, 40, 100, 0.3)',
    LINE: 'rgba(20, 40, 100, 0.5)',
    POINT: 'rgba(255, 255, 255, 0.5)'
  };

  init = function() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.onclick = addPoint;
    document.onkeypress = handleKeyPress;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = COLORS.FILL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height);
    currentMover = new CircleMover();
    N_POINTS = 50;
    points.push(generatePoint(COLORS.FILL));
    points.push(generatePoint(COLORS.FILL));
    return render();
  };

  generatePoints = function(n) {
    var i, results;
    i = 0;
    results = [];
    while (i < n) {
      points.push(generatePoint(COLORS.FILL));
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
      case "KeyQ":
        return currentMover = new CellMover();
      case "KeyW":
        return currentMover = new CircleMover();
      case "KeyE":
        return currentMover = new MoveToCircleMover();
      case "KeyA":
        return currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height);
      case "KeyS":
        return currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height);
      case "KeyD":
        return currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
    }
  };

  addPoint = function(event) {
    var body, doc, eventDoc;
    if (event.pageX === null && event.clientX !== null) {
      eventDoc = event.target && event.target.ownerDocument || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;
      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
    }
    return points.push({
      x: event.pageX,
      y: event.pageY,
      c: COLORS.MOUSE
    });
  };

  render = function() {
    var INTERVAL, INTRO_TIME;
    INTERVAL = 25;
    INTRO_TIME = 25 * N_POINTS;
    if (t === 1) {
      console.debug(Date.now());
      currentMover = new CellMover();
    }
    if (t > INTRO_TIME && t < 2 * INTRO_TIME) {
      if (t % INTERVAL === 0 && points.length < N_POINTS) {
        points.push(generatePoint(COLORS.FILL));
      }
    }
    if (t === 2 * INTRO_TIME) {
      console.debug(Date.now());
      currentMover = new MoveToCircleMover();
    }
    if (t === 2 * INTRO_TIME + 100) {
      console.debug(Date.now());
      currentMover = new CircleMover();
    }
    if (t === 3 * INTRO_TIME) {
      console.debug(Date.now());
      currentMover = new CellMover();
    }
    if (t === 4 * INTRO_TIME) {
      console.debug(Date.now());
      currentMover = new CircleMover();
    }
    if (t === 5 * INTRO_TIME) {
      console.debug(Date.now());
      currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
      currentMover = new CellMover();
    }
    currentMover.move(points, t);
    currentRenderer.render(points);
    currentRenderer.renderPoints(points);
    return t = requestAnimationFrame(render);
  };

  init();

}).call(this);
