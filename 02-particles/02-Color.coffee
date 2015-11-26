class Color

    constructor: (@r, @g, @b, @a = 1.0) ->

    toString: () ->
        "rgba(#{@r}, #{@g}, #{@b}, #{@a})"

    @blend: (x, y, value) ->
        new Color(
            Math.round(x.r * (1 - value) + y.r * value),
            Math.round(x.g * (1 - value) + y.g * value),
            Math.round(x.b * (1 - value) + y.b * value),
            Math.round(x.a * (1 - value) + y.a * value)
        )