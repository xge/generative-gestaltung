(function() {
  var Color, Emitter, Field, Helper, Particle, Vector,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Helper = (function() {
    function Helper() {}

    Helper.clamp = function(value, min, max) {
      if (min == null) {
        min = 1;
      }
      if (max == null) {
        max = 10;
      }
      return Math.min(Math.max(value, min), max);
    };

    return Helper;

  })();

  Vector = (function() {
    function Vector(x1, y1) {
      this.x = x1 != null ? x1 : 0;
      this.y = y1 != null ? y1 : 0;
      this.getAngle = bind(this.getAngle, this);
      this.getLength = bind(this.getLength, this);
      this.add = bind(this.add, this);
    }

    Vector.prototype.add = function(vector) {
      this.x += vector.x;
      return this.y += vector.y;
    };

    Vector.prototype.getLength = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.getAngle = function() {
      return Math.atan2(this.y, this.x);
    };

    Vector.fromAngle = function(angle, length) {
      return new Vector(length * Math.cos(angle), length * Math.sin(angle));
    };

    return Vector;

  })();

  Color = (function() {
    function Color(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a != null ? a : 1.0;
    }

    Color.prototype.toString = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };

    Color.blend = function(x, y, value) {
      value = Helper.clamp(0, 1, value);
      return new Color(Math.round(x.r * (1 - value) + y.r * value), Math.round(x.g * (1 - value) + y.g * value), Math.round(x.b * (1 - value) + y.b * value), Math.round(x.a * (1 - value) + y.a * value));
    };

    return Color;

  })();

  Field = (function() {
    function Field(position1, mass) {
      this.position = position1;
      this.setMass = bind(this.setMass, this);
      this.setMass(mass);
    }

    Field.prototype.setMass = function(mass1) {
      this.mass = mass1 != null ? mass1 : 100;
      return this.drawColor = this.mass < 0 ? "#f00" : "#0f0";
    };

    return Field;

  })();

  Emitter = (function() {
    function Emitter(position1, velocity1, spread) {
      this.position = position1;
      this.velocity = velocity1;
      this.spread = spread != null ? spread : Math.PI / 32;
      this.emitParticle = bind(this.emitParticle, this);
      this.drawColor = "#f0f";
    }

    Emitter.prototype.emitParticle = function() {
      var angle, length, position, velocity;
      angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
      length = this.velocity.getLength();
      position = new Vector(this.position.x, this.position.y);
      velocity = Vector.fromAngle(angle, length);
      return new Particle(position, velocity);
    };

    return Emitter;

  })();

  Particle = (function() {
    Particle.color = new Color(129, 129, 129);

    function Particle(position1, velocity1, acceleration, size) {
      this.position = position1 != null ? position1 : new Vector(0, 0);
      this.velocity = velocity1 != null ? velocity1 : new Vector(0, 0);
      this.acceleration = acceleration != null ? acceleration : new Vector(0, 0);
      this.size = size != null ? size : 20;
      this.calculateForces = bind(this.calculateForces, this);
      this.move = bind(this.move, this);
      this.originalSize = this.size;
    }

    Particle.prototype.move = function() {
      this.velocity.add(this.acceleration);
      return this.position.add(this.velocity);
    };

    Particle.prototype.calculateForces = function(fields) {
      var field, force, i, len, totalAccelerationX, totalAccelerationY, vectorX, vectorY;
      totalAccelerationX = 0;
      totalAccelerationY = 0;
      for (i = 0, len = fields.length; i < len; i++) {
        field = fields[i];
        vectorX = field.position.x - this.position.x;
        vectorY = field.position.y - this.position.y;
        force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5);
        totalAccelerationX += vectorX * force;
        totalAccelerationY += vectorY * force;
      }
      this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
      this.acc = this.acceleration.getLength();
      this.color = Color.blend(new Color(32, 32, 32), new Color(192, 192, 192), this.acc * 20);
      return this.size = this.originalSize / Helper.clamp(this.acc * 20, 1, 4);
    };

    return Particle;

  })();

  $(function() {
    var addNewParticles, canvas, clear, context, draw, drawCircle, drawLoop, drawParticles, emissionRate, emitters, fields, haltAnimation, maxParticles, midX, midY, objectSize, particles, queue, update, updateParticles;
    canvas = canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    haltAnimation = false;
    $("input[name=isRendering]").change(function(e) {
      return haltAnimation = !haltAnimation;
    });
    maxParticles = 200;
    emissionRate = 10;
    objectSize = 5;
    particles = [];
    midX = canvas.width / 2;
    midY = canvas.height / 2;
    emitters = [new Emitter(new Vector(midX, midY), Vector.fromAngle(0, 2), Math.PI)];
    fields = [new Field(new Vector(midX + 300, midY), 450), new Field(new Vector(midX - 300, midY), 450), new Field(new Vector(midX - 600, midY - 300), -450), new Field(new Vector(midX - 300, midY - 300), -450), new Field(new Vector(midX, midY - 300), -450), new Field(new Vector(midX + 300, midY - 300), -450), new Field(new Vector(midX + 600, midY - 300), -450), new Field(new Vector(midX - 600, midY + 300), -450), new Field(new Vector(midX - 300, midY + 300), -450), new Field(new Vector(midX, midY + 300), -450), new Field(new Vector(midX + 300, midY + 300), -450), new Field(new Vector(midX + 600, midY + 300), -450), new Field(new Vector(midX - 600, midY), -450), new Field(new Vector(midX + 600, midY), -450)];
    addNewParticles = function() {
      var emitter, i, j, len, results;
      if (particles.length > maxParticles) {
        return;
      }
      results = [];
      for (i = 0, len = emitters.length; i < len; i++) {
        emitter = emitters[i];
        results.push((function() {
          var k, ref, results1;
          results1 = [];
          for (j = k = 1, ref = emissionRate; 1 <= ref ? k <= ref : k >= ref; j = 1 <= ref ? ++k : --k) {
            results1.push(particles.push(emitter.emitParticle()));
          }
          return results1;
        })());
      }
      return results;
    };
    updateParticles = function(boundsX, boundsY) {
      var currentParticles, i, len, particle, pos;
      currentParticles = new Array();
      for (i = 0, len = particles.length; i < len; i++) {
        particle = particles[i];
        pos = particle.position;
        if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) {
          continue;
        }
        particle.calculateForces(fields);
        particle.move();
        currentParticles.push(particle);
      }
      return particles = currentParticles;
    };
    drawCircle = function(object) {
      context.fillStyle = object.drawColor;
      context.beginPath();
      context.arc(object.position.x, object.position.y, objectSize, 0, Math.PI * 2);
      context.closePath();
      return context.fill();
    };
    drawParticles = function() {
      var i, len, particle, pos, results;
      results = [];
      for (i = 0, len = particles.length; i < len; i++) {
        particle = particles[i];
        context.fillStyle = particle.color.toString();
        pos = particle.position;
        results.push(context.fillRect(pos.x, pos.y, particle.size, particle.size));
      }
      return results;
    };
    clear = function() {
      return context.clearRect(0, 0, canvas.width, canvas.height);
    };
    update = function() {
      addNewParticles();
      return updateParticles(canvas.width, canvas.height);
    };
    draw = function() {
      drawParticles();
      fields.forEach(drawCircle);
      return emitters.forEach(drawCircle);
    };
    queue = function() {
      return requestAnimationFrame(drawLoop);
    };
    return (drawLoop = function() {
      if (!haltAnimation) {
        clear();
        update();
        draw();
      }
      return queue();
    })();
  });

}).call(this);
