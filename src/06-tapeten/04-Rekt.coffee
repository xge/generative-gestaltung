class Rekt
    constructor: (colors, @canvas) ->
        @points = []
        for color in colors
            @points.push {x: @canvas.width() / 2, y: @canvas.height() / 2, color: "##{color}"}
        @ctx = @canvas.get(0).getContext '2d'
        @draw()

    draw: () =>

        for point, i in @points
            @ctx.fillStyle = point.color
            size = @canvas.width() - i * 100
            @ctx.beginPath()
            @ctx.rect i*50, i*50, size, size
            @ctx.closePath()

            @ctx.fill()