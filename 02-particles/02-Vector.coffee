class Vector
    constructor: (@x = 0, @y = 0) ->

    add: (vector) =>
        @x += vector.x
        @y += vector.y

    getLength: () =>
        Math.sqrt @x * @x + @y * @y

    getAngle: () =>
        Math.atan2 @y, @x

    @fromAngle = (angle, length) ->
        new Vector (length * Math.cos angle), (length * Math.sin angle)