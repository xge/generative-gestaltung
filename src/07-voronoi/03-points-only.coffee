class PointsOnlyRenderer
    constructor: (@ctx, @width, @height) ->
    render: (points) ->
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10
        @ctx.fillStyle = fil
        @ctx.fillRect 0, 0, @width, @height
