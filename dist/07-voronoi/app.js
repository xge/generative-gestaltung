(function() {
  var BlendMover, COLORS, CONST, CellMover, CircleMover, Color, DEBUG, LineRenderer, N_POINTS, PointsOnlyRenderer, VoronoiRenderer, addPoint, bbox, canvas, ctx, currentMover, currentRenderer, diagram, drawLine, drawPoints, generateCircleBlendTargets, generatePoint, generatePoints, generateRandomBlendTargets, handleKeyPress, id, init, margin, points, render, renderDebug, showControls, t, takeTime;

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
              this.ctx.strokeStyle = COLORS.LINE;
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
        this.ctx.fillStyle = new Color(COLORS.POINT.r, COLORS.POINT.g, COLORS.POINT.b, 0.6 + Math.sin(i + t * 0.05) * 0.3);
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.05);
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
      this.ctx.strokeStyle = COLORS.LINE;
      return this.ctx.stroke();
    };

    LineRenderer.prototype.renderPoints = function(points) {
      var i, j, len, point, results, size;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        this.ctx.fillStyle = new Color(COLORS.POINT.r, COLORS.POINT.g, COLORS.POINT.b, 0.6 + Math.sin(i + t * 0.05) * 0.3);
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.05);
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
      var i, j, len, point, results;
      this.ctx.fillStyle = COLORS.FILL;
      this.ctx.fillRect(0, 0, this.width, this.height);
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        point.x += Math.sin(t / 100 + i) / 10;
        results.push(point.y += Math.sin(t / 100 + i) / 10);
      }
      return results;
    };

    PointsOnlyRenderer.prototype.renderPoints = function(points) {
      var i, j, len, point, results, size;
      results = [];
      for (i = j = 0, len = points.length; j < len; i = ++j) {
        point = points[i];
        this.ctx.fillStyle = new Color(COLORS.POINT.r, COLORS.POINT.g, COLORS.POINT.b, 0.6 + Math.sin(i + t * 0.05) * 0.3);
        this.ctx.beginPath();
        size = 4 + Math.sin(i + t * 0.05);
        this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
    };

    return PointsOnlyRenderer;

  })();

  Color = (function() {
    function Color(r1, g, b1, a) {
      this.r = r1;
      this.g = g;
      this.b = b1;
      this.a = a != null ? a : 1.0;
    }

    Color.prototype.toString = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };

    Color.blend = function(x, y, value) {
      return new Color(Math.round(x.r * (1 - value) + y.r * value), Math.round(x.g * (1 - value) + y.g * value), Math.round(x.b * (1 - value) + y.b * value), Math.round(x.a * (1 - value) + y.a * value));
    };

    return Color;

  })();

  BlendMover = (function() {
    var easeInOutSine;

    function BlendMover() {
      this.initialT = 1;
    }

    BlendMover.prototype.out = function(i, src, dest, act, per) {
      return console.debug(i, src, dest, act, per);
    };

    easeInOutSine = function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };

    BlendMover.prototype.blend = function(v0, v1, t) {
      return easeInOutSine(t, v0, v1 - v0, 100);
    };

    BlendMover.prototype.move = function(points) {
      var i, j, len, point;
      if (this.initialT <= 100) {
        for (i = j = 0, len = points.length; j < len; i = ++j) {
          point = points[i];
          if (point.x !== point.blend.destination.x) {
            point.x = this.blend(point.blend.source.x, point.blend.destination.x, this.initialT);
          }
          if (point.y !== point.blend.destination.y) {
            point.y = this.blend(point.blend.source.y, point.blend.destination.y, this.initialT);
          }
        }
      }
      this.initialT++;
    };

    return BlendMover;

  })();

  CircleMover = (function() {
    function CircleMover(width, height) {
      this.centerX = width / 2;
      this.centerY = height / 2;
      this.r = height / 4;
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
    STROKE: new Color(255, 255, 255, 0.2),
    FILL: new Color(20, 20, 20, 1.0),
    MOUSE: new Color(20, 40, 100, 0.3),
    LINE: new Color(255, 255, 255, 0.1),
    POINT: new Color(255, 255, 255, 0.9)
  };

  CONST = {
    N_POINTS: 37,
    INTERVAL: 25,
    INTRO_TIME: 0
  };

  DEBUG = {
    TIME: Date.now()
  };

  init = function() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.height = window.innerHeight - 124;
    canvas.width = window.innerWidth;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = COLORS.FILL;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height);
    currentMover = new CircleMover(canvas.width, canvas.height);
    CONST.INTRO_TIME = CONST.INTERVAL * CONST.N_POINTS;
    console.debug("debug::INTRO_TIME = " + CONST.INTRO_TIME);
    generatePoints(4);
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
    var x, y;
    x = Math.ceil(Math.random() * canvas.width);
    y = Math.ceil(Math.random() * canvas.height);
    return {
      x: x,
      y: y,
      c: color,
      blend: {
        source: {
          x: x,
          y: y
        },
        destination: {
          x: Math.ceil(Math.random() * canvas.width),
          y: Math.ceil(Math.random() * canvas.height)
        }
      }
    };
  };

  handleKeyPress = function(e) {
    switch (e.code) {
      case "KeyQ":
        return currentMover = new CellMover();
      case "KeyW":
        generateCircleBlendTargets();
        return currentMover = new BlendMover();
      case "KeyE":
        generateRandomBlendTargets();
        return currentMover = new BlendMover();
      case "KeyA":
        return currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height);
      case "KeyS":
        return currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height);
      case "KeyD":
        return currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
      case "BracketRight":
      case "NumpadAdd":
        if (points.length < CONST.N_POINTS) {
          return points.push(generatePoint(COLORS.FILL));
        }
        break;
      case "Slash":
      case "NumpadSubtract":
        if (points.length > 2) {
          return points.pop();
        }
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
      c: COLORS.MOUSE,
      blend: {}
    });
  };

  takeTime = function() {
    DEBUG.TIME = Date.now() - DEBUG.TIME;
    return console.debug("debug::TIME = " + (DEBUG.TIME / 1000) + "s");
  };

  showControls = function() {
    var control, j, len, ref, results;
    console.debug("debug::CONTROLS show");
    ref = document.getElementsByClassName("control");
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      control = ref[j];
      results.push(control.classList.add("open"));
    }
    return results;
  };

  renderDebug = function() {
    if (t === 1) {
      showControls();
      document.onkeypress = handleKeyPress;
    }
    currentMover.move(points, t);
    currentRenderer.render(points);
    currentRenderer.renderPoints(points);
    return t = requestAnimationFrame(renderDebug);
  };

  generateRandomBlendTargets = function() {
    var j, len, point, results;
    results = [];
    for (j = 0, len = points.length; j < len; j++) {
      point = points[j];
      point.blend.source = {
        x: point.x,
        y: point.y
      };
      results.push(point.blend.destination = {
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random()
      });
    }
    return results;
  };

  generateCircleBlendTargets = function() {
    var i, j, len, point, r, results;
    results = [];
    for (i = j = 0, len = points.length; j < len; i = ++j) {
      point = points[i];
      point.blend.source = {
        x: point.x,
        y: point.y
      };
      r = canvas.height / 4;
      results.push(point.blend.destination = {
        x: canvas.width / 2 + r * Math.cos(2 * (i + 1) * Math.PI / points.length),
        y: canvas.height / 2 + r * Math.sin(2 * (i + 1) * Math.PI / points.length)
      });
    }
    return results;
  };

  render = function() {
    if (t === 1) {
      takeTime();
      currentMover = new CellMover();
    }
    if ((CONST.INTRO_TIME < t && t < 2 * CONST.INTRO_TIME)) {
      if (t % CONST.INTERVAL === 0 && points.length < CONST.N_POINTS) {
        points.push(generatePoint(COLORS.FILL));
      }
    }
    if (t === 2 * CONST.INTRO_TIME) {
      takeTime();
      generateCircleBlendTargets();
      currentMover = new BlendMover();
    }
    if (t === 3 * CONST.INTRO_TIME) {
      takeTime();
      currentMover = new CellMover();
    }
    if (t === 5 * CONST.INTRO_TIME) {
      takeTime();
      generateCircleBlendTargets();
      currentMover = new BlendMover();
    }
    if (t === 6 * CONST.INTRO_TIME) {
      takeTime();
      currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height);
      currentMover = new CellMover();
    }
    if (t === 7 * CONST.INTRO_TIME) {
      takeTime();
      generateRandomBlendTargets();
      currentMover = new BlendMover();
    }
    if ((8 * CONST.INTRO_TIME < t && t < 9 * CONST.INTRO_TIME)) {
      if (t % CONST.INTERVAL === 0 && points.length > 2) {
        points.pop();
      }
    }
    if (t === 9 * CONST.INTRO_TIME) {
      takeTime();
      generateCircleBlendTargets();
      currentMover = new BlendMover();
    }
    if (t === 10 * CONST.INTRO_TIME - 100) {
      takeTime();
      currentMover = new CircleMover(canvas.width, canvas.height);
      currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height);
    }
    if ((10 * CONST.INTRO_TIME < t && t < 11 * CONST.INTRO_TIME)) {
      if (t % CONST.INTERVAL === 0 && points.length < CONST.N_POINTS) {
        points.push(generatePoint(COLORS.FILL));
      }
    }
    if (t === 11 * CONST.INTRO_TIME + 100) {
      takeTime();
      showControls();
      document.onkeypress = handleKeyPress;
    }
    currentMover.move(points, t);
    currentRenderer.render(points);
    currentRenderer.renderPoints(points);
    return t = requestAnimationFrame(render);
  };

  init();

}).call(this);
