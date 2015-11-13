# Helper functions
calcLength = (v0) ->
    Math.sqrt v0.x * v0.x + v0.y * v0.y


canvas = document.getElementById "myCanvas"
canvas.height = window.innerHeight
canvas.width = window.innerWidth
context = canvas.getContext '2d'

forceField = new Array()
particles = new Array()

CONSTANTS =
    N_PARTICLES: 50 # Number of particles
    S_PARTICLE: 2 # Size of a single particle
    WIDTH: canvas.width
    HEIGHT: canvas.height
    DAMPEN: 0.8

frameCount = 0

center =
    x: Math.floor(CONSTANTS.N_PARTICLES / 2)
    y: Math.floor(CONSTANTS.N_PARTICLES / 2)

for i in [0..Math.floor(CONSTANTS.WIDTH / 2)]
    forceField.push new Array()
    for j in [0..Math.floor(CONSTANTS.HEIGHT / 2)]
        forceField[i].push
            x: 0
            y: 0
        dir =
            x: center.x - i
            y: center.y - j
        len = calcLength dir
        dir.x = dir.x * 10 / len / len / len
        dir.y = dir.y * 10 / len / len / len

        forceField[i][j].x += dir.x
        forceField[i][j].y += dir.y

for i in [0...CONSTANTS.N_PARTICLES]
    particles.push new Array()
    for j in [0..CONSTANTS.N_PARTICLES]
        particles[i][j] =
            row: i
            column: j
            position:
                x: i * (CONSTANTS.WIDTH / CONSTANTS.N_PARTICLES)
                y: j * (CONSTANTS.HEIGHT / CONSTANTS.N_PARTICLES)
            velocity:
                x: 0 # Math.random() * 6 - 3
                y: 0 # Math.random() * 6 - 3

do draw = () ->

    context.clearRect 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT

    for particleRow in particles
        for particle in particleRow
            force = forceField[particle.row][particle.column]
            particle.velocity.x += force.x
            particle.velocity.y += force.y

            nextPosition =
                x: particle.position.x + particle.velocity.x
                y: particle.position.y + particle.velocity.y

            if nextPosition.x > CONSTANTS.WIDTH || nextPosition.x < 0
                particle.velocity.x *= -1

            if nextPosition.y > CONSTANTS.HEIGHT || nextPosition.y < 0
                particle.velocity.x += Math.random() * 4 - 2
                particle.velocity.y *= -1

            particle.velocity.x *= CONSTANTS.DAMPEN
            particle.velocity.y *= CONSTANTS.DAMPEN

            particle.position.x += particle.velocity.x
            particle.position.y += particle.velocity.y

            context.save()
            context.translate particle.position.x, particle.position.y
            context.fillRect 0, 0, CONSTANTS.S_PARTICLE, CONSTANTS.S_PARTICLE
            context.restore()

    frameCount++
    requestAnimationFrame draw