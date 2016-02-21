class BlendMover
    constructor: () ->
        @initialT = 1
    out: (i, src, dest, act, per) ->
        console.debug i, src, dest, act, per
    blend: (v0, v1, t) ->
        range = Math.max(v0, v1) - Math.min(v0, v1)
        result = v0 + t * (range / 100) if v0 < v1
        result = v0 - t * (range / 100) if v0 > v1
        result
    move: (points) ->
        if @initialT < 100
            for point, i in points
                newX = @blend(point.blend.source.x, point.blend.destination.x, @initialT)
                newY = @blend(point.blend.source.y, point.blend.destination.y, @initialT)
                point.x = newX
                point.y = newY
        @initialT++
        return