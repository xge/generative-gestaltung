class CircleMover
    constructor: () ->
        @centerX = window.innerWidth / 2
        @centerY = window.innerHeight / 2
        @r = window.innerHeight / 4
    move: (points) ->
        for point, i in points
            point.x = @centerX + @r * Math.cos(2 * (i + 1) * Math.PI / points.length)
            point.y = @centerY + @r * Math.sin(2 * (i + 1) * Math.PI / points.length)