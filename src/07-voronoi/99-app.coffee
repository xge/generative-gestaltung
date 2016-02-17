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
    canvas.onclick = addPoint
    document.onkeypress = handleKeyPress
    # init context
    ctx = canvas.getContext('2d')
    ctx.fillStyle = COLORS.FILL
    ctx.fillRect 0, 0, canvas.width, canvas.height
    currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
    currentMover = new CircleMover()
    # kick off the computing and rendering
    N_POINTS = 50
    points.push generatePoint COLORS.FILL
    points.push generatePoint COLORS.FILL
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
        when "KeyE" then currentMover = new MoveToCircleMover()
        when "KeyA" then currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
        when "KeyS" then currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
        when "KeyD" then currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)

addPoint = (event) ->
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
    INTERVAL = 25
    INTRO_TIME = 25 * N_POINTS

    if t is 1
        console.debug Date.now()
        currentMover = new CellMover()
    if t > INTRO_TIME and t < 2 * INTRO_TIME
        if t % INTERVAL is 0 and points.length < N_POINTS
            points.push generatePoint(COLORS.FILL)
    if t is 2 * INTRO_TIME
        console.debug Date.now()
        currentMover = new MoveToCircleMover()
    if t is 2 * INTRO_TIME + 100
        console.debug Date.now()
        currentMover = new CircleMover()
    if t is 3 * INTRO_TIME
        console.debug Date.now()
        currentMover = new CellMover()
    if t is 4 * INTRO_TIME
        console.debug Date.now()
        currentMover = new CircleMover()
    if t is 5 * INTRO_TIME
        console.debug Date.now()
        currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)
        currentMover = new CellMover()
    # blend to random position
    # slowly pop until points.length is 2
    # blend to circle Position
    # activate line renderer
    # slowly push until points.length is N_POINTS

    currentMover.move(points, t)
    currentRenderer.render(points)
    currentRenderer.renderPoints(points)

    t = requestAnimationFrame render

init()
