class PointsOnlyRenderer
    constructor: (@ctx, @width, @height) ->
    render: (points) ->
        @ctx.fillStyle = COLORS.FILL
        @ctx.fillRect 0, 0, @width, @height
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10

    renderPoints: (points) ->
        for point, i in points
            @ctx.fillStyle = COLORS.POINT
            @ctx.beginPath()
            size = 4 + Math.sin(i + t * 0.1)
            @ctx.arc point.x, point.y, size, 0, Math.PI * 2
            @ctx.closePath()
            @ctx.fill()