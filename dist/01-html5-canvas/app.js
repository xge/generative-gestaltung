(function() {
  var RandomBoxes,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  RandomBoxes = (function() {
    var Rect;

    function RandomBoxes(canvas1, context1) {
      this.canvas = canvas1;
      this.context = context1;
      this.draw = bind(this.draw, this);
      this.setUpAndStart = bind(this.setUpAndStart, this);
      this.generateBoxes = bind(this.generateBoxes, this);
      this.inputChanged = bind(this.inputChanged, this);
      this.canvasResized = bind(this.canvasResized, this);
      this.frameCount = 0;
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
      this.generateBoxes();
      return console.log("window was resized");
    };

    RandomBoxes.prototype.inputChanged = function() {
      this.boxSize = $("#boxSizeInput").val();
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
      $("body").prepend("<div id=\"controls\" style=\"position: relative; z-index: 9999;\">\n    <form name=\"controls\">\n        <label for=\"boxSize\">Box size: <span id=\"boxSize\"></span></label><br />\n        <input type=\"range\" value=\"25\" min=\"5\" max=\"1080\" id=\"boxSizeInput\" />\n    </form>\n</div>");
      boxSizeInput = $("#boxSizeInput");
      boxSizeInput.max = Math.floor(this.canvas.height);
      boxSizeInput.on("input", this.inputChanged);
      $("#boxSize").text(this.boxSize);
      this.generateBoxes();
      return this.draw();
    };

    RandomBoxes.prototype.draw = function() {
      var j, len, rect, ref;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ref = this.rects;
      for (j = 0, len = ref.length; j < len; j++) {
        rect = ref[j];
        rect.draw(this.frameCount, this.centerX, this.centerY, this.boxSize);
      }
      this.frameCount++;
      return requestAnimationFrame(this.draw);
    };

    Rect = (function() {
      function Rect(context1, x, y, dir1) {
        this.context = context1;
        this.x = x;
        this.y = y;
        this.dir = dir1 != null ? dir1 : 1;
        this.draw = bind(this.draw, this);
        this.generateRandomOffset = bind(this.generateRandomOffset, this);
        this.offsetY = 10;
        this.generateRandomOffset();
      }

      Rect.prototype.generateRandomOffset = function() {
        return this.randomOffsetX = Math.floor(Math.random() * 10.) + 1;
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

  $(function() {
    var canvas, context, visuals;
    canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    visuals = [new RandomBoxes(canvas, context)];
    $(window).on("resize", function() {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      return visuals[0].canvasResized(canvas);
    });
    return visuals[0].setUpAndStart(canvas);
  });

}).call(this);
