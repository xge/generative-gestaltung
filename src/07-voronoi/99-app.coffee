bbox = canvas = ctx = id = diagram = currentRenderer = currentMover = undefined
drawPoints = true
drawLine = false
points = []
margin = t = N_POINTS = 0
COLORS =
    STROKE: 'rgba(255, 255, 255, 0.2)'
    FILL: 'rgba(20, 20, 20, 1.0)'
    MOUSE: 'rgba(20, 40, 100, 0.3)'
    LINE: 'rgba(20, 40, 100, 0.5)'
    POINT: 'rgba(255, 255, 255, 0.5)'

init = ->
# init canvas
    canvas = document.getElementsByTagName('canvas')[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    # canvas.onclick = addPoint
    document.onkeypress = handleKeyPress
    # init context
    ctx = canvas.getContext('2d')
    ctx.fillStyle = COLORS.FILL
    ctx.fillRect 0, 0, canvas.width, canvas.height
    currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
    currentMover = new CircleMover()
    # kick off the computing and rendering
    N_POINTS = 25
    # generatePoints N_POINTS
    render()

generatePoints = (n) ->
    i = 0
    while i < n
        points.push generatePoint(COLORS.FILL)
        i++

generatePoint = (color) ->
    {
        x: Math.random() * canvas.width
        y: Math.random() * canvas.height
        c: color
    }

handleKeyPress = (e) ->
    switch e.code
        when "KeyQ" then currentMover = new CellMover()
        when "KeyW" then currentMover = new CircleMover()
        when "KeyA" then currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
        when "KeyS" then currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
        when "KeyD" then currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)

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
        c: COLORS.MOUSE

render = () ->
    INTRO_TIME = 50 * N_POINTS

    if t < INTRO_TIME
        if t % 50 is 0 and points.length < N_POINTS
            points.push generatePoint(COLORS.FILL)
    if t is INTRO_TIME + 100
        currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)
        currentMover = new CellMover()
    if t is 2 * INTRO_TIME + 100
        currentMover = new CircleMover()
    if t is 2 * INTRO_TIME + 200
        currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
    if t is 3 * INTRO_TIME + 100
        currentMover = new CellMover()
    if t is 4 * INTRO_TIME + 100
        currentMover = new CircleMover()
    if t is 4 * INTRO_TIME + 500
        currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
    if t > 5 * INTRO_TIME + 100
        if t % 50 is 0 and points.length > 2
            points.pop()
    if t is 6 * INTRO_TIME + 100
        currentMover = new CellMover()



    currentMover.move(points)
    currentRenderer.render(points)
    currentRenderer.renderPoints(points)

    t = requestAnimationFrame render

init()
