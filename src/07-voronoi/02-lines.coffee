class LineRenderer
    constructor: (@ctx, @width, @height) ->
    render: (points) ->
        @ctx.fillStyle = COLORS.FILL
        @ctx.fillRect 0, 0, @width, @height
        @ctx.beginPath()
        @ctx.moveTo points[0].x, points[0].y
        for point in points
            @ctx.lineTo point.x, point.y
        @ctx.closePath()
        @ctx.strokeStyle = COLORS.STROKE
        @ctx.stroke()

    renderPoints: (points) ->
        for point, i in points
            @ctx.fillStyle = COLORS.POINT
            @ctx.beginPath()
            size = 4 + Math.sin(i + t * 0.1)
            @ctx.arc point.x, point.y, size, 0, Math.PI * 2
            @ctx.closePath()
            @ctx.fill()