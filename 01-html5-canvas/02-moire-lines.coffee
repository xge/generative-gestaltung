class MoireLine
    constructor: (@canvas, @context) ->
        @frameCount = 0

    canvasResized: (newCanvas) =>
        @canvas = newCanvas
        @draw()

    setUpAndStart: =>
        @draw()

    draw: =>
        @context.clearRect 0, 0, @canvas.width, @canvas.height

        @context.beginPath()
        @drawSine(@frameCount)
        @context.stroke()
        @context.closePath()

        @frameCount++
        @rafId = requestAnimationFrame @draw

    drawSine: (t) =>
        y = @canvas.height / 2
        x = 0

        @context.moveTo x, y

        while x <= @canvas.width
            x += @canvas.width / t
            y = @canvas.height / 2 + (@canvas.height / 2 - 50) * Math.sin(x)
            @context.lineTo x, y

        return

    tearDown: =>
        window.cancelAnimationFrame @rafId
