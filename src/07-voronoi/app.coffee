bbox = undefined
canvas = undefined
ctx = undefined
id = undefined
diagram = undefined
points = []
lines = []
voronoi = new Voronoi
margin = 0
t = 0
str = 'rgba(255, 255, 255, 0.025)'
fil = 'rgba(20, 20, 20, 0.025)'
mou = 'rgba(20, 40, 100, 0.3)'
lin = 'rgba(20, 40, 100, 0.5)'

init = ->
  # init canvas
  canvas = document.getElementsByTagName('canvas')[0]
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  canvas.onclick = addPoint
  # init context
  ctx = canvas.getContext('2d')
  ctx.fillStyle = fil
  ctx.fillRect 0, 0, canvas.width, canvas.height
  ctx.lineWidth = 1
  # ctx.globalAlpha = 0.03
  # init bounding box
  bbox =
    left: 0
    right: canvas.width
    top: 0
    bottom: canvas.height
  # kick off the computing and rendering
  n = Math.ceil(canvas.width / 50)
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

addPoint = (e) ->
    if event.pageX == null and event.clientX != null
        eventDoc = event.target and event.target.ownerDocument or document
        doc = eventDoc.documentElement
        body = eventDoc.body
        event.pageX = event.clientX + (doc and doc.scrollLeft or body and body.scrollLeft or 0) - (doc and doc.clientLeft or body and body.clientLeft or 0)
        event.pageY = event.clientY + (doc and doc.scrollTop or body and body.scrollTop or 0) - (doc and doc.clientTop or body and body.clientTop or 0)

    lines.push
        x: event.pageX
        y: event.pageY

    points.push
        x: event.pageX
        y: event.pageY
        c: mou


render = () ->
    # ctx.clearRect(0, 0, canvas.width, canvas.height);
    # ctx.fillStyle = "rgba(20, 20, 20, 0.05)"
    # ctx.fillRect 0, 0, canvas.width, canvas.height

    if t % 60 is 0
        # Generate two new points each time render() gets called and delete the oldest two points
        NEW = 1
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
            ctx.lineWidth = 1
            ctx.strokeStyle = str
            ctx.stroke()

    for point in points
        ctx.fillStyle = str
        size = 4
        ctx.fillRect point.x, point.y, size, size

    if lines.length > 0
        ctx.beginPath()
        ctx.moveTo lines[0].x, lines[0].y
        for line in lines
            ctx.lineTo line.x, line.y
        ctx.lineWidth = 5
        ctx.strokeStyle = lin
        ctx.stroke()

    ctx.restore()
    # window.setTimeout render, 100
    t = requestAnimationFrame render

init()