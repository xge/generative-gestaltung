(function() {
  var Emitter, Field, Particle, Vector,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Vector = (function() {
    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.getAngle = bind(this.getAngle, this);
      this.getMagnitude = bind(this.getMagnitude, this);
      this.add = bind(this.add, this);
    }

    Vector.prototype.add = function(vector) {
      this.x += vector.x;
      return this.y += vector.y;
    };

    Vector.prototype.getMagnitude = function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.getAngle = function() {
      return Math.atan2(this.y, this.x);
    };

    Vector.fromAngle = function(angle, magnitude) {
      return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
    };

    return Vector;

  })();

  Particle = (function() {
    function Particle(position1, velocity1, acceleration) {
      this.position = position1 != null ? position1 : new Vector(0, 0);
      this.velocity = velocity1 != null ? velocity1 : new Vector(0, 0);
      this.acceleration = acceleration != null ? acceleration : new Vector(0, 0);
      this.submitToFields = bind(this.submitToFields, this);
      this.move = bind(this.move, this);
    }

    Particle.prototype.move = function() {
      this.velocity.add(this.acceleration);
      return this.position.add(this.velocity);
    };

    Particle.prototype.submitToFields = function(fields) {
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
      return this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);
    };

    return Particle;

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
      var angle, magnitude, position, velocity;
      angle = this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2);
      magnitude = this.velocity.getMagnitude();
      position = new Vector(this.position.x, this.position.y);
      velocity = Vector.fromAngle(angle, magnitude);
      return new Particle(position, velocity);
    };

    return Emitter;

  })();

  $(function() {
    var addNewParticles, canvas, clear, context, draw, drawCircle, drawLoop, drawParticles, emissionRate, emitters, fields, maxParticles, midX, midY, objectSize, particleSize, particles, plotParticles, queue, update;
    canvas = canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    maxParticles = 1500;
    particleSize = 2;
    emissionRate = 10;
    objectSize = 3;
    particles = [];
    midX = canvas.width / 2;
    midY = canvas.height / 2;
    emitters = [new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2), Math.PI)];
    fields = [new Field(new Vector(midX - 300, midY + 20), 900), new Field(new Vector(midX - 200, midY + 10), -75)];
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
          for (j = k = 0, ref = emissionRate; 0 <= ref ? k <= ref : k >= ref; j = 0 <= ref ? ++k : --k) {
            results1.push(particles.push(emitter.emitParticle()));
          }
          return results1;
        })());
      }
      return results;
    };
    plotParticles = function(boundsX, boundsY) {
      var currentParticles, i, len, particle, pos;
      currentParticles = new Array();
      for (i = 0, len = particles.length; i < len; i++) {
        particle = particles[i];
        pos = particle.position;
        if (pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY) {
          continue;
        }
        particle.submitToFields(fields);
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
      context.fillStyle = "rgb(129,129,129)";
      results = [];
      for (i = 0, len = particles.length; i < len; i++) {
        particle = particles[i];
        pos = particle.position;
        results.push(context.fillRect(pos.x, pos.y, particleSize, particleSize));
      }
      return results;
    };
    clear = function() {
      return context.clearRect(0, 0, canvas.width, canvas.height);
    };
    update = function() {
      addNewParticles();
      return plotParticles(canvas.width, canvas.height);
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
      clear();
      update();
      draw();
      return queue();
    })();
  });

}).call(this);
