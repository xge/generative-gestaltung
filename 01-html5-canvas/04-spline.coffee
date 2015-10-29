class Spline
    constructor: (@canvas, @context) ->
        @frameCount = 0
        @offsetX = 500
        @offsetY = 500
        @TO_RADIANS = Math.PI / 360

    canvasResized: (@canvas) =>

    setUpAndStart: =>
        @draw()

    clear: (style = "rgba(255,255,255,0.03)") =>
        @context.save()
        @context.fillStyle = style
        @context.fillRect 0, 0, @canvas.width, @canvas.height
        @context.restore()

    draw: =>
        @clear()

        @offsetX += 1
        @offsetY += 2 + Math.random() * Math.random()

        x = Math.sin(@canvas.width + @offsetX * @TO_RADIANS) * @canvas.width / 2
        y = Math.sin(@canvas.height + @offsetY * @TO_RADIANS) * @canvas.height / 2

        @context.fillStyle = "magenta" # TOOD: parameterize
        @circle x, y, 10  # TOOD: parameterize

        @frameCount++
        @rafId = requestAnimationFrame @draw


    circle: (x, y, w) ->
        @context.beginPath()
        @context.arc @canvas.width / 2 + x, @canvas.height / 2 + y, w, 0, Math.PI * 2, true
        @context.closePath()
        @context.fill()

    tearDown: =>
        window.cancelAnimationFrame @rafId

