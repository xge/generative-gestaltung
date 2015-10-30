(function() {
  var CRCLS, MoireLine, RandomBoxes, Spline,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RandomBoxes = (function() {
    var Rect;

    function RandomBoxes(canvas1, context1) {
      this.canvas = canvas1;
      this.context = context1;
      this.tearDown = bind(this.tearDown, this);
      this.draw = bind(this.draw, this);
      this.setUpAndStart = bind(this.setUpAndStart, this);
      this.generateBoxes = bind(this.generateBoxes, this);
      this.inputChanged = bind(this.inputChanged, this);
      this.canvasResized = bind(this.canvasResized, this);
      this.frameCount = 0;
      this.now = Date.now();
      this.then = Date.now();
      this.interval = 1000 / 30;
      this.delta = 0;
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / (this.CONSTANTS = {
        RIGHT: 1,
        LEFT: 0,
        DEFAULT_BOX_SIZE: 25
      });
      this.boxSize = this.CONSTANTS.DEFAULT_BOX_SIZE;
      this.count = Math.floor(this.canvas.height / this.boxSize);
      this.rects = [];
    }

    RandomBoxes.prototype.canvasResized = function(newCanvas) {
      this.canvas = newCanvas;
      this.centerX = this.canvas.width / 2;
      this.centerY = this.canvas.height / 2;
      return this.generateBoxes();
    };

    RandomBoxes.prototype.inputChanged = function(e) {
      this.boxSize = e.target.value;
      $("#boxSize").text(this.boxSize);
      return this.generateBoxes();
    };

    RandomBoxes.prototype.generateBoxes = function() {
      var dir, i, j, ref, results;
      this.rects = [];
      results = [];
      for (i = j = 0, ref = Math.floor(this.canvas.height / this.boxSize); 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        dir = this.CONSTANTS.LEFT;
        if (i % 2 === 0) {
          dir = this.CONSTANTS.RIGHT;
        }
        results.push(this.rects.push(new Rect(this.context, this.centerX, this.boxSize * i, dir)));
      }
      return results;
    };

    RandomBoxes.prototype.setUpAndStart = function() {
      var boxSizeInput;
      $("#controls form").append("<div id=\"random-boxes\" class=\"form-group\">\n    <label for=\"boxSize\">Box size: <span id=\"boxSize\"></span></label><br />\n    <input class=\"form-control\" type=\"range\" value=\"25\" min=\"5\" max=\"1080\" id=\"boxSizeInput\" /><br />\n</div>");
      boxSizeInput = $("#boxSizeInput");
      boxSizeInput.max = Math.floor(this.canvas.height);
      boxSizeInput.on("input", this.inputChanged);
      this.boxSize = boxSizeInput.val();
      $("#boxSize").text(this.boxSize);
      this.generateBoxes();
      return this.draw();
    };

    RandomBoxes.prototype.draw = function() {
      var j, len, rect, ref;
      this.rafId = requestAnimationFrame(this.draw);
      this.now = Date.now();
      this.delta = this.now - this.then;
      if (this.delta > this.interval) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ref = this.rects;
        for (j = 0, len = ref.length; j < len; j++) {
          rect = ref[j];
          rect.draw(this.frameCount, this.centerX, this.centerY, this.boxSize);
        }
        this.frameCount++;
        return this.then = this.now - (this.delta % this.interval);
      }
    };

    RandomBoxes.prototype.tearDown = function() {
      $("#boxSizeInput").off("input");
      $("#random-boxes").remove();
      return window.cancelAnimationFrame(this.rafId);
    };

    Rect = (function() {
      function Rect(context1, x1, y1, dir1) {
        this.context = context1;
        this.x = x1;
        this.y = y1;
        this.dir = dir1 != null ? dir1 : 1;
        this.draw = bind(this.draw, this);
        this.generateRandomOffset = bind(this.generateRandomOffset, this);
        this.offsetY = 10;
        this.generateRandomOffset();
      }

      Rect.prototype.generateRandomOffset = function() {
        return this.randomOffsetX = Math.floor(Math.random() * 15.) + 1;
      };

      Rect.prototype.draw = function(frameCount, centerX, centerY, size) {
        var offsetX;
        offsetX = 75 * Math.sin(frameCount * 0.02) * this.randomOffsetX;
        if (offsetX <= centerX - 10 || offsetX >= centerX + 10) {
          this.generateRandomOffset();
        }
        this.context.fillStyle = "rgba(200,50,50,1)";
        this.context.strokeStyle = "rgba(20,0,120,0.6)";
        if (this.dir > 0) {
          return this.context.fillRect(this.x + offsetX, this.y, size, size);
        } else {
          return this.context.fillRect(this.x - offsetX, this.y, size, size);
        }
      };

      return Rect;

    })();

    return RandomBoxes;

  })();

  MoireLine = (function() {
    function MoireLine(canvas1, context1) {
      this.canvas = canvas1;
      this.context = context1;
      this.tearDown = bind(this.tearDown, this);
      this.drawSine = bind(this.drawSine, this);
      this.draw = bind(this.draw, this);
      this.setUpAndStart = bind(this.setUpAndStart, this);
      this.canvasResized = bind(this.canvasResized, this);
      this.frameCount = 0;
    }

    MoireLine.prototype.canvasResized = function(canvas1) {
      this.canvas = canvas1;
    };

    MoireLine.prototype.setUpAndStart = function() {
      this.context.strokeStyle = "black";
      return this.draw();
    };

    MoireLine.prototype.draw = function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.beginPath();
      this.drawSine(this.frameCount);
      this.context.stroke();
      this.context.closePath();
      this.frameCount++;
      return this.rafId = requestAnimationFrame(this.draw);
    };

    MoireLine.prototype.drawSine = function(t) {
      var x, y;
      y = this.canvas.height / 2;
      x = 0;
      this.context.moveTo(x, y);
      while (x <= this.canvas.width) {
        x += this.canvas.width / t;
        y = this.canvas.height / 2 + (this.canvas.height / 2 - 50) * Math.sin(x);
        this.context.lineTo(x, y);
      }
    };

    MoireLine.prototype.tearDown = function() {
      return window.cancelAnimationFrame(this.rafId);
    };

    return MoireLine;

  })();

  CRCLS = (function() {
    var Circle;

    function CRCLS(canvas1, context1) {
      this.canvas = canvas1;
      this.context = context1;
      this.tearDown = bind(this.tearDown, this);
      this.createCircleAtMousePos = bind(this.createCircleAtMousePos, this);
      this.draw = bind(this.draw, this);
      this.setUpAndStart = bind(this.setUpAndStart, this);
      this.canvasResized = bind(this.canvasResized, this);
      this.frameCount = 0;
      this.circles = [];
      this.circles.push(new Circle(this.canvas.width / 2, this.canvas.height / 2, this.canvas, this.context));
    }

    CRCLS.prototype.canvasResized = function(canvas1) {
      this.canvas = canvas1;
    };

    CRCLS.prototype.setUpAndStart = function() {
      $("body").prepend("<div id=\"headline\">$(canvas).on 'click', () -> rain()</div>");
      $(this.canvas).on("click", this.createCircleAtMousePos);
      return this.draw();
    };

    CRCLS.prototype.draw = function() {
      var circle, j, len, ref;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ref = this.circles;
      for (j = 0, len = ref.length; j < len; j++) {
        circle = ref[j];
        circle.draw();
        circle.resize();
      }
      this.circles = this.circles.filter(function(circle) {
        return circle.radius < circle.maxRadius;
      });
      this.frameCount++;
      return this.rafId = requestAnimationFrame(this.draw);
    };

    CRCLS.prototype.createCircleAtMousePos = function(e) {
      return this.circles.push(new Circle(e.pageX, e.pageY, this.canvas, this.context));
    };

    CRCLS.prototype.tearDown = function() {
      $(this.canvas).off("click");
      $("#headline").remove();
      return window.cancelAnimationFrame(this.rafId);
    };

    Circle = (function() {
      function Circle(x1, y1, canvas1, context1) {
        this.x = x1;
        this.y = y1;
        this.canvas = canvas1;
        this.context = context1;
        this.radius = 0;
        this.maxRadius = 250 + (this.canvas.height / 2) * Math.random();
      }

      Circle.prototype.draw = function() {
        this.context.strokeStyle = "rgb(" + (0 + this.radius) + "," + (0 + this.radius) + "," + (0 + this.radius) + ")";
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.context.closePath();
        return this.context.stroke();
      };

      Circle.prototype.resize = function() {
        if (this.radius > this.maxRadius) {
          this.radius = 0;
        }
        return this.radius++;
      };

      return Circle;

    })();

    return CRCLS;

  })();

  Spline = (function() {
    function Spline(canvas1, context1) {
      this.canvas = canvas1;
      this.context = context1;
      this.tearDown = bind(this.tearDown, this);
      this.draw = bind(this.draw, this);
      this.clear = bind(this.clear, this);
      this.brushSizeInput = bind(this.brushSizeInput, this);
      this.fillStyleInput = bind(this.fillStyleInput, this);
      this.setUpAndStart = bind(this.setUpAndStart, this);
      this.canvasResized = bind(this.canvasResized, this);
      this.frameCount = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.TO_RADIANS = Math.PI / 360;
      this.fillStyle = "magenta";
      this.brushSize = 20;
    }

    Spline.prototype.canvasResized = function(canvas1) {
      this.canvas = canvas1;
    };

    Spline.prototype.setUpAndStart = function() {
      $("#controls form").append("<div id=\"spline\">\n    <div class=\"form-group\">\n        <label for=\"fillStyleInput\">FillStyle</label>\n        <input class=\"form-control\" type=\"text\" value=\"magenta\" id=\"fillStyleInput\" />\n    </div>\n    <div class=\"form-group\">\n        <label for=\"brushSizeInput\">Brush size</label>\n        <input class=\"form-control\" type=\"number\" value=\"20\" min=\"5\" max=\"50\" id=\"brushSizeInput\" />\n    </div>\n</div>");
      $("#fillStyleInput").on("input", this.fillStyleInput);
      $("#brushSizeInput").on("input", this.brushSizeInput);
      this.clear("white");
      return this.draw();
    };

    Spline.prototype.fillStyleInput = function(e) {
      return this.fillStyle = e.target.value;
    };

    Spline.prototype.brushSizeInput = function(e) {
      return this.brushSize = e.target.value;
    };

    Spline.prototype.clear = function(style) {
      if (style == null) {
        style = "rgba(255,255,255,0.03)";
      }
      this.context.save();
      this.context.fillStyle = style;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      return this.context.restore();
    };

    Spline.prototype.draw = function() {
      var x, y;
      this.clear();
      this.offsetX += 2;
      this.offsetY += 1 + Math.random() * Math.random();
      x = Math.sin(this.canvas.width + this.offsetX * this.TO_RADIANS) * this.canvas.width / 2;
      y = Math.sin(this.canvas.height + this.offsetY * this.TO_RADIANS) * this.canvas.height / 2;
      this.context.fillStyle = this.fillStyle;
      this.circle(x, y, this.brushSize);
      this.frameCount++;
      return this.rafId = requestAnimationFrame(this.draw);
    };

    Spline.prototype.circle = function(x, y, w) {
      this.context.beginPath();
      this.context.arc(this.canvas.width / 2 + x, this.canvas.height / 2 + y, w, 0, Math.PI * 2, true);
      this.context.closePath();
      return this.context.fill();
    };

    Spline.prototype.tearDown = function() {
      $("#spline").remove();
      return window.cancelAnimationFrame(this.rafId);
    };

    return Spline;

  })();

  $(function() {
    var canvas, context, currentVis, form, j, len, visual, visuals;
    canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    currentVis = 0;
    visuals = [
      {
        id: 0,
        name: "Random Boxes",
        fn: new RandomBoxes(canvas, context)
      }, {
        id: 1,
        name: "Moirée Line",
        fn: new MoireLine(canvas, context)
      }, {
        id: 2,
        name: "CRCLS",
        fn: new CRCLS(canvas, context)
      }, {
        id: 3,
        name: "Spline",
        fn: new Spline(canvas, context)
      }
    ];
    $(window).on("resize", function() {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      return visuals[currentVis].fn.canvasResized(canvas);
    });
    form = $("#controls form");
    form.prepend("<div class=\"form-group\">\n    <label for=\"visuals\">Select visual:</label>\n    <select class=\"form-control\" id=\"visuals\"></select>\n</form>");
    for (j = 0, len = visuals.length; j < len; j++) {
      visual = visuals[j];
      form.find("select").append("<option value=" + visual.id + ">" + visual.name + "</option>");
    }
    form.find("select").on("input", function() {
      visuals[currentVis].fn.tearDown();
      currentVis = form.find("select").val();
      return visuals[currentVis].fn.setUpAndStart();
    });
    return visuals[currentVis].fn.setUpAndStart();
  });

}).call(this);
