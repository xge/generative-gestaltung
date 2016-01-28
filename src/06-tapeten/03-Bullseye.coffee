class Bullseye
    constructor: (colors, @canvas) ->
        @points = []
        for color in colors
            @points.push {x: @canvas.width() / 2, y: @canvas.height() / 2, color: "##{color}"}
        @ctx = @canvas.get(0).getContext '2d'
        @draw()

    draw: () =>

        for point, i in @points
            @ctx.fillStyle = point.color

            @ctx.beginPath()
            @ctx.arc point.x, point.y, (@canvas.width() / 2 - i * 50), 0, Math.PI * 2, true
            @ctx.closePath()

            @ctx.fill()