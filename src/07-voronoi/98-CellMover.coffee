class CellMover
    move: (points) ->
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10
        points