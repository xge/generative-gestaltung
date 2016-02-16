class PointsOnlyRenderer
    constructor: (@ctx, @width, @height) ->
    render: (points) ->
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10
        @ctx.fillStyle = fil
        @ctx.fillRect 0, 0, @width, @height

    renderPoints: (points) ->
        for point, i in points
            @ctx.fillStyle = pnt
            @ctx.beginPath()
            size = 4 + Math.sin(i + t * 0.1)
            @ctx.arc point.x, point.y, size, 0, Math.PI * 2
            @ctx.closePath()
            @ctx.fill()