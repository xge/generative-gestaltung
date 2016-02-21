class RandomMover
    constructor: () ->
    blend: (x, y, t) ->
        x = Math.ceil x
        y = Math.ceil y
        t = Math.ceil t
        range = Math.max(x, y) - Math.min(x, y)
        Math.min(x, y) + t * (range / 100)
    move: (points, t) ->
        for point, i in points
            point.x = @blend(point.x, point.origin.x, t % 2)
            point.y = @blend(point.y, point.origin.y, t % 2)