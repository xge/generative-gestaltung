(function() {
  var CONSTANTS, calcLength, canvas, center, context, dir, draw, forceField, frameCount, i, j, k, l, len, m, n, particles, ref, ref1, ref2, ref3;

  calcLength = function(v0) {
    return Math.sqrt(v0.x * v0.x + v0.y * v0.y);
  };

  canvas = document.getElementById("myCanvas");

  canvas.height = window.innerHeight;

  canvas.width = window.innerWidth;

  context = canvas.getContext('2d');

  forceField = new Array();

  particles = new Array();

  CONSTANTS = {
    N_PARTICLES: 50,
    S_PARTICLE: 2,
    WIDTH: canvas.width,
    HEIGHT: canvas.height,
    DAMPEN: 0.8
  };

  frameCount = 0;

  center = {
    x: Math.floor(CONSTANTS.N_PARTICLES / 2),
    y: Math.floor(CONSTANTS.N_PARTICLES / 2)
  };

  for (i = k = 0, ref = Math.floor(CONSTANTS.WIDTH / 2); 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
    forceField.push(new Array());
    for (j = l = 0, ref1 = Math.floor(CONSTANTS.HEIGHT / 2); 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
      forceField[i].push({
        x: 0,
        y: 0
      });
      dir = {
        x: center.x - i,
        y: center.y - j
      };
      len = calcLength(dir);
      dir.x = dir.x * 10 / len / len / len;
      dir.y = dir.y * 10 / len / len / len;
      forceField[i][j].x += dir.x;
      forceField[i][j].y += dir.y;
    }
  }

  for (i = m = 0, ref2 = CONSTANTS.N_PARTICLES; 0 <= ref2 ? m < ref2 : m > ref2; i = 0 <= ref2 ? ++m : --m) {
    particles.push(new Array());
    for (j = n = 0, ref3 = CONSTANTS.N_PARTICLES; 0 <= ref3 ? n <= ref3 : n >= ref3; j = 0 <= ref3 ? ++n : --n) {
      particles[i][j] = {
        row: i,
        column: j,
        position: {
          x: i * (CONSTANTS.WIDTH / CONSTANTS.N_PARTICLES),
          y: j * (CONSTANTS.HEIGHT / CONSTANTS.N_PARTICLES)
        },
        velocity: {
          x: 0,
          y: 0
        }
      };
    }
  }

  (draw = function() {
    var force, len1, len2, nextPosition, o, p, particle, particleRow;
    context.clearRect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
    for (o = 0, len1 = particles.length; o < len1; o++) {
      particleRow = particles[o];
      for (p = 0, len2 = particleRow.length; p < len2; p++) {
        particle = particleRow[p];
        force = forceField[particle.row][particle.column];
        particle.velocity.x += force.x;
        particle.velocity.y += force.y;
        nextPosition = {
          x: particle.position.x + particle.velocity.x,
          y: particle.position.y + particle.velocity.y
        };
        if (nextPosition.x > CONSTANTS.WIDTH || nextPosition.x < 0) {
          particle.velocity.x *= -1;
        }
        if (nextPosition.y > CONSTANTS.HEIGHT || nextPosition.y < 0) {
          particle.velocity.x += Math.random() * 4 - 2;
          particle.velocity.y *= -1;
        }
        particle.velocity.x *= CONSTANTS.DAMPEN;
        particle.velocity.y *= CONSTANTS.DAMPEN;
        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        context.save();
        context.translate(particle.position.x, particle.position.y);
        context.fillRect(0, 0, CONSTANTS.S_PARTICLE, CONSTANTS.S_PARTICLE);
        context.restore();
      }
    }
    frameCount++;
    return requestAnimationFrame(draw);
  })();

}).call(this);
