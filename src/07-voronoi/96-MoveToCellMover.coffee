class MoveToCellMover
    constructor: () ->
        @centerX = window.innerWidth / 2
        @centerY = window.innerHeight / 2
        @r = window.innerHeight / 4
    blend: (x, y, t) ->
        x = Math.ceil x
        y = Math.ceil y
        t = Math.ceil t
        max = Math.max(x, y)
        min = Math.min(x, y)
        range = max - min
        min + t * (range / 100)
    move: (points, t) ->
        for point, i in points
            newX = @centerX + @r * Math.cos(2 * (i + 1) * Math.PI / points.length)
            point.x = @blend(point.x, newX, t % 50)
            newY = @centerY + @r * Math.sin(2 * (i + 1) * Math.PI / points.length)
            point.y = @blend(point.y, newY, t % 50)