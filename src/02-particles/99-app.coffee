$ ->
    canvas = canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'

    haltAnimation = false

    # make animation controllable via input
    $("input[name=isRendering]").change (e) ->
        haltAnimation = !haltAnimation

    maxParticles = 200
    emissionRate = 10
    objectSize = 5

    particles = []
    midX = canvas.width / 2
    midY = canvas.height / 2

    # define emitters
    emitters = [
        new Emitter(new Vector(midX, midY), Vector.fromAngle(0, 2), Math.PI)
    ]

    # define force fields
    fields = [
        new Field(new Vector(midX + 300, midY), 450)
        new Field(new Vector(midX - 300, midY), 450)
        # lower border
        new Field(new Vector(midX - 600, midY - 300), -450)
        new Field(new Vector(midX - 300, midY - 300), -450)
        new Field(new Vector(midX, midY - 300), -450)
        new Field(new Vector(midX + 300, midY - 300), -450)
        new Field(new Vector(midX + 600, midY - 300), -450)
        # lower border
        new Field(new Vector(midX - 600, midY + 300), -450)
        new Field(new Vector(midX - 300, midY + 300), -450)
        new Field(new Vector(midX, midY + 300), -450)
        new Field(new Vector(midX + 300, midY + 300), -450)
        new Field(new Vector(midX + 600, midY + 300), -450)
        # left border
        new Field(new Vector(midX - 600, midY), -450)
        # left border
        new Field(new Vector(midX + 600, midY), -450)
        # no border, no nation, refugees welcome
    ]

    # if there are less than maxParticles particles on screen -> add more particles!
    addNewParticles = () ->
        if (particles.length > maxParticles)
            return

        for emitter in emitters
            for j in [1..emissionRate]
                particles.push emitter.emitParticle()

    # calculate the on-screen particles and their movement
    updateParticles = (boundsX, boundsY) ->
        currentParticles = new Array()

        for particle in particles
            pos = particle.position

            continue if pos.x < 0 || pos.x > boundsX || pos.y < 0 || pos.y > boundsY

            particle.calculateForces fields
            particle.move()

            currentParticles.push particle

        particles = currentParticles

    # visualize fields and emitters
    drawCircle = (object) ->
        context.fillStyle = object.drawColor
        context.beginPath()
        context.arc object.position.x, object.position.y, objectSize, 0, Math.PI * 2
        context.closePath()
        context.fill()

    # visualize the particle array
    drawParticles = () ->
        for particle in particles
            context.fillStyle = particle.color.toString()
            pos = particle.position
            context.fillRect pos.x, pos.y, particle.size, particle.size

    clear = () ->
        context.clearRect 0, 0, canvas.width, canvas.height

    update = () ->
        addNewParticles()
        updateParticles canvas.width, canvas.height

    draw = () ->
        drawParticles()
        fields.forEach drawCircle
        emitters.forEach drawCircle

    queue = () ->
        requestAnimationFrame drawLoop

    do drawLoop = () ->
        if not haltAnimation
            clear()
            update()
            draw()
        queue()