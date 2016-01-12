class Helper

    # min < value < max
    @clamp: (value, min = 1, max = 10) ->
        Math.min(Math.max(value, min), max)