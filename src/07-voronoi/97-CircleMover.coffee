class CircleMover
    constructor: (width, height) ->
        @centerX = width / 2
        @centerY = height / 2
        @r = height / 4
    move: (points) ->
        for point, i in points
            point.x = @centerX + @r * Math.cos(2 * (i + 1) * Math.PI / points.length)
            point.y = @centerY + @r * Math.sin(2 * (i + 1) * Math.PI / points.length)