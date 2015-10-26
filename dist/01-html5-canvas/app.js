(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function($) {
    return $(function() {
      var CONSTANTS, Rect, boxSize, canvas, centerX, centerY, context, count, draw, frameCount, generateBoxes, inputChanged, rects, setup, windowResized;
      canvas = $("#myCanvas")[0];
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      context = canvas.getContext('2d');
      frameCount = 0;
      centerX = canvas.width / 2;
      centerY = canvas.height / (CONSTANTS = {
        RIGHT: 1,
        LEFT: 0,
        DEFAULT_BOX_SIZE: 25
      });
      boxSize = CONSTANTS.DEFAULT_BOX_SIZE;
      count = Math.floor(canvas.height / boxSize);
      rects = [];
      Rect = (function() {
        function Rect(context1, x, y, dir1) {
          this.context = context1;
          this.x = x;
          this.y = y;
          this.dir = dir1 != null ? dir1 : CONSTANTS.RIGHT;
          this.draw = bind(this.draw, this);
          this.generateRandomOffset = bind(this.generateRandomOffset, this);
          this.offsetY = 10;
          this.generateRandomOffset();
        }

        Rect.prototype.generateRandomOffset = function() {
          return this.randomOffsetX = Math.floor(Math.random() * 10.) + 1;
        };

        Rect.prototype.draw = function(size) {
          var offsetX;
          if (size == null) {
            size = boxSize;
          }
          offsetX = 75 * Math.sin(frameCount * 0.02) * this.randomOffsetX;
          if (offsetX <= centerX - 10 || offsetX >= centerX + 10) {
            this.generateRandomOffset();
          }
          context.fillStyle = "rgba(200,50,50,1)";
          context.strokeStyle = "rgba(20,0,120,0.6)";
          if (this.dir === CONSTANTS.RIGHT) {
            return context.fillRect(this.x + offsetX, this.y, size, size);
          } else {
            return context.fillRect(this.x - offsetX, this.y, size, size);
          }
        };

        return Rect;

      })();
      windowResized = function() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
        centerX = canvas.width / 2;
        centerY = canvas.height / generateBoxes();
        return console.log("window was resized");
      };
      inputChanged = function() {
        boxSize = $("#boxSizeInput").val();
        $("#boxSize").text(boxSize);
        return generateBoxes();
      };
      generateBoxes = function() {
        var dir, i, j, ref, results;
        rects = [];
        results = [];
        for (i = j = 0, ref = Math.floor(canvas.height / boxSize); 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          dir = CONSTANTS.LEFT;
          if (i % 2 === 0) {
            dir = CONSTANTS.RIGHT;
          }
          results.push(rects.push(new Rect(context, centerX, boxSize * i, dir)));
        }
        return results;
      };
      setup = function() {
        var boxSizeInput;
        boxSizeInput = $("#boxSizeInput");
        boxSizeInput.max = Math.floor(canvas.height);
        boxSizeInput.on("input", inputChanged);
        $("#boxSize").text(boxSize);
        $(window).on("resize", windowResized);
        return generateBoxes();
      };
      draw = function() {
        var j, len, rect;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (j = 0, len = rects.length; j < len; j++) {
          rect = rects[j];
          rect.draw();
        }
        frameCount++;
        return requestAnimationFrame(draw);
      };
      setup();
      return draw();
    });
  })(jQuery);

}).call(this);
