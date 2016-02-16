bbox = canvas = ctx = id = diagram = currentRenderer = currentMover = undefined
drawPoints = true
drawLine = false
points = []
margin = t = N_POINTS = 0
str = 'rgba(255, 255, 255, 0.2)'
fil = 'rgba(20, 20, 20, 1.0)'
mou = 'rgba(20, 40, 100, 0.3)'
lin = 'rgba(20, 40, 100, 0.5)'
pnt = 'rgba(255, 255, 255, 0.5)'

init = ->
  # init canvas
  canvas = document.getElementsByTagName('canvas')[0]
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  canvas.onclick = addPoint
  document.onkeypress = handleKeyPress
  # init context
  ctx = canvas.getContext('2d')
  ctx.fillStyle = fil
  ctx.fillRect 0, 0, canvas.width, canvas.height
  currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)
  currentMover = new CellMover()
  # kick off the computing and rendering
  N_POINTS = Math.ceil(canvas.width / 40)
  generatePoints N_POINTS
  render()

generatePoints = (n) ->
  i = 0
  while i < n
    points.push generatePoint(fil)
    i++

generatePoint = (color) ->
  {
    x: Math.random() * canvas.width
    y: Math.random() * canvas.height
    c: color
  }

handleKeyPress = (e) ->
  switch e.code
    when "KeyV" then currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
    when "KeyL" then currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
    when "KeyN", "KeyP" then currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)

addPoint = (e) ->
    if event.pageX == null and event.clientX != null
        eventDoc = event.target and event.target.ownerDocument or document
        doc = eventDoc.documentElement
        body = eventDoc.body
        event.pageX = event.clientX + (doc and doc.scrollLeft or body and body.scrollLeft or 0) - (doc and doc.clientLeft or body and body.clientLeft or 0)
        event.pageY = event.clientY + (doc and doc.scrollTop or body and body.scrollTop or 0) - (doc and doc.clientTop or body and body.clientTop or 0)

    points.push
        x: event.pageX
        y: event.pageY
        c: mou

render = () ->
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save()

    currentMover.move(points)
    currentRenderer.render(points)
    currentRenderer.renderPoints(points)

    ctx.restore()
    t = requestAnimationFrame render

init()
