$ ->
    canvas = canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'
    THRESHOLD = 0.00001
    t = 0
    a = 0
    b = 1

    generators = []

    init = () ->
        for i in [0..10]
            generators.push new Color(
                Math.round(255 * Math.random()),
                Math.round(255 * Math.random()),
                Math.round(255 * Math.random())
            )
        drawLoop()

    clear = () ->
        context.clearRect 0, 0, canvas.width, canvas.height

    update = () ->
        delta = Math.sin(t * 0.01)
        context.fillStyle = Color.blend(generators[a], generators[b], delta).toString()
        context.fillRect 0, 0, canvas.width, canvas. height

        if delta > 1 - THRESHOLD            
            a = if (a + 2) < generators.length then a + 2 else 0

        if delta < -1 + THRESHOLD
            b = if (b + 2) < generators.length then b + 2 else 1


    queue = () ->
        t = requestAnimationFrame drawLoop

    drawLoop = () ->
        clear()
        update()
        queue()

    init()