(function() {
  var Bullseye, Rekt, Sine,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Bullseye = (function() {
    function Bullseye(colors, canvas) {
      var color, k, len;
      this.canvas = canvas;
      this.draw = bind(this.draw, this);
      this.points = [];
      for (k = 0, len = colors.length; k < len; k++) {
        color = colors[k];
        this.points.push({
          x: this.canvas.width() / 2,
          y: this.canvas.height() / 2,
          color: "#" + color
        });
      }
      this.ctx = this.canvas.get(0).getContext('2d');
      this.draw();
    }

    Bullseye.prototype.draw = function() {
      var i, k, len, point, ref, results;
      ref = this.points;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        point = ref[i];
        this.ctx.fillStyle = point.color;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, this.canvas.width() / 2 - i * 50, 0, Math.PI * 2, true);
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
    };

    return Bullseye;

  })();

  Rekt = (function() {
    function Rekt(colors, canvas) {
      var color, k, len;
      this.canvas = canvas;
      this.draw = bind(this.draw, this);
      this.points = [];
      for (k = 0, len = colors.length; k < len; k++) {
        color = colors[k];
        this.points.push({
          x: this.canvas.width() / 2,
          y: this.canvas.height() / 2,
          color: "#" + color
        });
      }
      this.ctx = this.canvas.get(0).getContext('2d');
      this.draw();
    }

    Rekt.prototype.draw = function() {
      var i, k, len, point, ref, results, size;
      ref = this.points;
      results = [];
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        point = ref[i];
        this.ctx.fillStyle = point.color;
        size = this.canvas.width() - i * 100;
        this.ctx.beginPath();
        this.ctx.rect(i * 50, i * 50, size, size);
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
    };

    return Rekt;

  })();

  Sine = (function() {
    function Sine(colors, canvas) {
      var A, color, count, f, i, j, k, l, len, line, offsetX, offsetY, ref;
      this.canvas = canvas;
      this.draw = bind(this.draw, this);
      this.lines = [];
      count = 7;
      offsetX = this.canvas.width() / count;
      offsetY = this.canvas.width() / 2 - (colors.length / 2) * offsetX;
      A = 25;
      f = 1;
      for (j = k = 0, len = colors.length; k < len; j = ++k) {
        color = colors[j];
        line = {
          color: "#" + color,
          points: []
        };
        for (i = l = 0, ref = count + 1; 0 <= ref ? l <= ref : l >= ref; i = 0 <= ref ? ++l : --l) {
          line.points.push({
            x: i * offsetX,
            y: offsetY + j * offsetX + A * Math.sin(i * f)
          });
        }
        this.lines.push(line);
      }
      this.ctx = this.canvas.get(0).getContext('2d');
      this.draw();
    }

    Sine.prototype.draw = function() {
      var k, l, len, len1, line, point, ref, ref1, results;
      this.ctx.fillStyle = this.lines[this.lines.length - 1].color;
      this.ctx.rect(0, 0, this.canvas.width(), this.canvas.height());
      this.ctx.fill();
      ref = this.lines;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        line = ref[k];
        this.ctx.fillStyle = line.color;
        this.ctx.beginPath();
        this.ctx.lineTo(0, this.canvas.height());
        ref1 = line.points;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          point = ref1[l];
          this.ctx.lineTo(point.x, point.y);
        }
        this.ctx.lineTo(this.canvas.width(), this.canvas.height());
        this.ctx.closePath();
        results.push(this.ctx.fill());
      }
      return results;
    };

    return Sine;

  })();

  $(function() {
    var init;
    init = function(response) {
      var generator;
      generator = new Bullseye(response[0].colors, $("#tapeteBullseye"));
      generator.draw;
      generator = new Rekt(response[0].colors, $("#tapeteRekt"));
      generator.draw;
      generator = new Sine(response[0].colors, $("#tapeteSine"));
      return generator.draw;
    };
    return $.ajax({
      url: "http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=callback",
      dataType: "jsonp",
      jsonpCallback: "callback"
    }).done(init);
  });

}).call(this);
