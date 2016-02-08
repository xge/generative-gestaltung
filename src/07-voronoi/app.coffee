bbox = undefined
canvas = undefined
ctx = undefined
id = undefined
diagram = undefined
points = []
voronoi = new Voronoi
margin = 0
str = '#eee' # stroke
fil = '#36f' # fill

init = ->
  # init canvas
  canvas = document.getElementsByTagName('canvas')[0]
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  # init context
  ctx = canvas.getContext('2d')
  ctx.fillStyle = fil
  ctx.fillRect 0, 0, canvas.width, canvas.height
  ctx.globalAlpha = 0.1
  # init bounding box
  bbox =
    left: 0
    right: canvas.width
    top: 0
    bottom: canvas.height
  # kick off the computing and rendering
  n = Math.ceil(canvas.width / 10)
  generatePoints n
  render()

generatePoints = (n) ->
  i = 0
  while i < n - 4
    points.push generatePoint(fil)
    i++

generateCorners = ->
  points.push
    x: 0
    y: 0
    c: fil
  points.push
    x: canvas.width
    y: 0
    c: fil
  points.push
    x: canvas.width
    y: canvas.height
    c: fil
  points.push
    x: 0
    y: canvas.height
    c: fil

generatePoint = (color) ->
  {
    x: Math.random() * canvas.width
    y: Math.random() * canvas.height
    c: color
  }

render = () ->
    # ctx.clearRect(0, 0, canvas.width, canvas.height);

    # Generate two new points each time render() gets called and delete the oldest two points
    NEW = 2
    points.splice 0, NEW
    i = 0
    while (i < NEW)
        points.push generatePoint(fil)
        i++

    # make sure there is a point at each screen corner
    generateCorners()

    voronoi.recycle diagram
    diagram = voronoi.compute(points, bbox)

    # and remove the corners
    points.splice(points.length - 4, 4)

    ctx.save()
    for cell in diagram.cells
        halfEdges = cell.halfedges
        v = halfEdges[0].getStartpoint()
        ctx.beginPath()
        ctx.moveTo(v.x, v.y)

        for halfEdge in halfEdges
            v = halfEdge.getEndpoint()
            ctx.lineTo(v.x, v.y)
            ctx.fillStyle = cell.site.c
            ctx.fill()
            ctx.strokeStyle = str
            ctx.stroke()

    ctx.restore()
    window.setTimeout render, 200

init()