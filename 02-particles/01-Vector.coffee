class Vector
    constructor: (@x = 0, @y = 0) ->

    add: (vector) =>
        @x += vector.x
        @y += vector.y

    getMagnitude: () =>
        Math.sqrt @x * @x + @y * @y

    getAngle: () =>
        Math.atan2 @y, @x

    @fromAngle = (angle, magnitude) ->
        new Vector (magnitude * Math.cos angle), (magnitude * Math.sin angle)