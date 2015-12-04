(function() {
  var Color;

  Color = (function() {
    function Color(r, g, b1, a1) {
      this.r = r;
      this.g = g;
      this.b = b1;
      this.a = a1 != null ? a1 : 1.0;
    }

    Color.prototype.toString = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };

    Color.blend = function(x, y, value) {
      return new Color(Math.round(x.r * (1 - value) + y.r * value), Math.round(x.g * (1 - value) + y.g * value), Math.round(x.b * (1 - value) + y.b * value), Math.round(x.a * (1 - value) + y.a * value));
    };

    return Color;

  })();

  $(function() {
    var THRESHOLD, a, b, canvas, clear, context, drawLoop, generators, init, queue, t, update;
    canvas = canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    THRESHOLD = 0.00001;
    t = 0;
    a = 0;
    b = 1;
    generators = [];
    init = function() {
      var i, j;
      for (i = j = 0; j <= 10; i = ++j) {
        generators.push(new Color(Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random())));
      }
      return drawLoop();
    };
    clear = function() {
      return context.clearRect(0, 0, canvas.width, canvas.height);
    };
    update = function() {
      var delta;
      delta = Math.sin(t * 0.01);
      context.fillStyle = Color.blend(generators[a], generators[b], delta).toString();
      context.fillRect(0, 0, canvas.width, canvas.height);
      if (delta > 1 - THRESHOLD) {
        a = (a + 2) < generators.length ? a + 2 : 0;
      }
      if (delta < -1 + THRESHOLD) {
        return b = (b + 2) < generators.length ? b + 2 : 1;
      }
    };
    queue = function() {
      return t = requestAnimationFrame(drawLoop);
    };
    drawLoop = function() {
      clear();
      update();
      return queue();
    };
    return init();
  });

}).call(this);
