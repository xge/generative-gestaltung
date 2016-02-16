class VoronoiRenderer
    constructor: (@ctx, width, height) ->
        @voronoi = new Voronoi()
        # init bounding box
        @bbox =
            xl: 0
            xr: width
            yt: 0
            yb: height

    render: (points) ->
        @voronoi.recycle diagram
        diagram = @voronoi.compute(points, @bbox)
        for cell in diagram.cells
            halfEdges = cell.halfedges
            if halfEdges.length > 2
                v = halfEdges[0].getStartpoint()
                @ctx.beginPath()
                @ctx.moveTo(v.x, v.y)

                for halfEdge in halfEdges
                    v = halfEdge.getEndpoint()
                    @ctx.lineTo(v.x, v.y)
                    @ctx.fillStyle = cell.site.c
                    @ctx.fill()
                    @ctx.lineWidth = 1
                    @ctx.strokeStyle = str
                    @ctx.stroke()

    renderPoints: (points) ->
        for point, i in points
            @ctx.fillStyle = pnt
            @ctx.beginPath()
            size = 4 + Math.sin(i + t * 0.01)
            @ctx.arc point.x, point.y, size, 0, Math.PI * 2
            @ctx.closePath()
            @ctx.fill()