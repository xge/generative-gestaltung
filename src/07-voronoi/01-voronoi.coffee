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
        for point, i in points
            point.x += Math.sin(t / 100 + i) / 10
            point.y += Math.sin(t / 100 + i) / 10
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
