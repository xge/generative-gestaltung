$ ->
    canvas = canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'

    maxParticles = 1500
    particleSize = 2
    emissionRate = 10
    objectSize = 3

    particles = []
    midX = canvas.width / 2
    midY = canvas.height / 2

    emitters = [
        new Emitter(new Vector(midX - 150, midY), Vector.fromAngle(6, 2), Math.PI)
    ]

    fields = [
        new Field(new Vector(midX - 300, midY + 20), 900)
        new Field(new Vector(midX - 200, midY + 10), -75)
    ]

    addNewParticles = () ->
        if (particles.length > maxParticles)
            return

        for emitter in emitters
            for j in [0..emissionRate]
                particles.push emitter.emitParticle()

    plotParticles = (boundsX, boundsY) ->
        currentParticles = new Array()

        for particle in particles
            pos = particle.position

            continue if pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY

            particle.submitToFields fields
            particle.move()

            currentParticles.push particle

        particles = currentParticles

    drawCircle = (object) ->
        context.fillStyle = object.drawColor
        context.beginPath()
        context.arc object.position.x, object.position.y, objectSize, 0, Math.PI * 2
        context.closePath()
        context.fill()

    drawParticles = () ->
        context.fillStyle = "rgb(129,129,129)"
        for particle in particles
            pos = particle.position
            context.fillRect pos.x, pos.y, particleSize, particleSize

    clear = () ->
        context.clearRect 0, 0, canvas.width, canvas.height

    update = () ->
        addNewParticles()
        plotParticles canvas.width, canvas.height

    draw = () ->
        drawParticles()
        fields.forEach drawCircle
        emitters.forEach drawCircle

    queue = () ->
        requestAnimationFrame drawLoop

    do drawLoop = () ->
        clear()
        update()
        draw()
        queue()