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
        @ctx.strokeStyle = COLORS.LINE
        @ctx.stroke()

    renderPoints: (points) ->
        for point, i in points
            @ctx.fillStyle = new Color(COLORS.POINT.r, COLORS.POINT.g, COLORS.POINT.b, 0.6 + Math.sin(i + t * 0.05) * 0.3)
            @ctx.beginPath()
            size = 4 + Math.sin(i + t * 0.05)
            @ctx.arc point.x, point.y, size, 0, Math.PI * 2
            @ctx.closePath()
            @ctx.fill()