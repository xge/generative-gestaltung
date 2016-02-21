class BlendMover
    constructor: () ->
        @initialT = 1
    out: (i, src, dest, act, per) ->
        console.debug i, src, dest, act, per
    # Robert Penner, url: http://gizma.com/easing/#sin3
    easeInOutSine = (t, b, c, d) ->
        -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    blend: (v0, v1, t) ->
        easeInOutSine(t, v0, v1 - v0, 100)
    move: (points) ->
        if @initialT <= 100
            for point, i in points
                point.x = @blend(point.blend.source.x, point.blend.destination.x, @initialT) if point.x isnt point.blend.destination.x
                point.y = @blend(point.blend.source.y, point.blend.destination.y, @initialT) if point.y isnt point.blend.destination.y
        @initialT++
        return