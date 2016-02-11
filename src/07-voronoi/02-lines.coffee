class LineRenderer
    constructor: (@ctx, @width, @height) ->
    render: (points) ->
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10
        @ctx.fillStyle = fil
        @ctx.fillRect 0, 0, @width, @height
        @ctx.beginPath()
        @ctx.moveTo points[0].x, points[0].y
        for point in points
            @ctx.lineTo point.x, point.y
        @ctx.closePath()
        @ctx.strokeStyle = str
        @ctx.stroke()
