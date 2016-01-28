class Sine
    constructor: (colors, @canvas) ->
        @lines = []
        count = 7
        offsetX = @canvas.width() / count
        offsetY = @canvas.width() / 2 - (colors.length / 2) * offsetX
        A = 25
        f = 1
        for color, j in colors
            line = color: "##{color}", points: []
            for i in [0..count + 1]
                line.points.push x: i * offsetX, y: offsetY + j * offsetX + A * Math.sin(i * f)
            @lines.push line
        @ctx = @canvas.get(0).getContext '2d'
        @draw()

    draw: () =>
        @ctx.fillStyle = @lines[@lines.length - 1].color
        @ctx.rect 0, 0, @canvas.width(), @canvas.height()
        @ctx.fill()
        for line in @lines
            @ctx.fillStyle = line.color

            @ctx.beginPath()
            @ctx.lineTo 0, @canvas.height()
            for point in line.points
                @ctx.lineTo point.x, point.y
            @ctx.lineTo @canvas.width(), @canvas.height()
            @ctx.closePath()

            @ctx.fill()