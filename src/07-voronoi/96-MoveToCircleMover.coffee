class MoveToCircleMover
    constructor: (width, height) ->
        @centerX = width / 2
        @centerY = height / 2
        @r = height / 4
    blend: (x, y, t) ->
        x = Math.ceil x
        y = Math.ceil y
        t = Math.ceil t
        range = Math.max(x, y) - Math.min(x, y)
        Math.min(x, y) + t * (range / 100)
    move: (points, t) ->
        for point, i in points
            newX = @centerX + @r * Math.cos(2 * (i + 1) * Math.PI / points.length)
            point.x = @blend(point.x, newX, t % 10)
            newY = @centerY + @r * Math.sin(2 * (i + 1) * Math.PI / points.length)
            point.y = @blend(point.y, newY, t % 10)