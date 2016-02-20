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

CONST =
    N_POINTS: 40
    INTERVAL: 25
    INTRO_TIME: 0

DEBUG =
    TIME: Date.now()

init = ->
    # init canvas
    canvas = document.getElementsByTagName('canvas')[0]
    canvas.height = window.innerHeight - 124 # magic number... height of help + player
    canvas.width = window.innerWidth
    # canvas.onclick = addPoint
    document.onkeypress = handleKeyPress
    # init context
    ctx = canvas.getContext('2d')
    ctx.fillStyle = COLORS.FILL
    ctx.fillRect 0, 0, canvas.width, canvas.height
    # init renderer and mover
    currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
    currentMover = new CircleMover(canvas.width, canvas.height)
    # kick off the computing and rendering
    CONST.INTRO_TIME = CONST.INTERVAL * CONST.N_POINTS
    console.debug "debug::INTRO_TIME = #{CONST.INTRO_TIME}"
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
        when "KeyW" then currentMover = new CircleMover(canvas.width, canvas.height)
        when "KeyE" then currentMover = new MoveToCircleMover(canvas.width, canvas.height)
        when "KeyA" then currentRenderer = new VoronoiRenderer(ctx, canvas.width, canvas.height)
        when "KeyS" then currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
        when "KeyD" then currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)
        when "BracketRight", "NumpadAdd" then points.push generatePoint(COLORS.FILL) if points.length < CONST.N_POINTS
        when "Slash", "NumpadSubtract" then points.pop() if points.length > 2

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

takeTime = () ->
    DEBUG.TIME = Date.now() - DEBUG.TIME
    console.debug "debug::TIME = #{DEBUG.TIME / 1000}s"

render = () ->
    if t is 1
        takeTime()
        currentMover = new CellMover()
    if t > CONST.INTRO_TIME and t < 2 * CONST.INTRO_TIME
        if t % CONST.INTERVAL is 0 and points.length < CONST.N_POINTS
            points.push generatePoint(COLORS.FILL)
    if t is 2 * CONST.INTRO_TIME
        takeTime()
        currentMover = new MoveToCircleMover(canvas.width, canvas.height)
    if t is 2 * CONST.INTRO_TIME + 100
        takeTime()
        currentMover = new CircleMover(canvas.width, canvas.height)
    if t is 3 * CONST.INTRO_TIME
        takeTime()
        currentMover = new CellMover()
    if t is 4 * CONST.INTRO_TIME
        takeTime()
        currentMover = new CircleMover(canvas.width, canvas.height)
    if t is 5 * CONST.INTRO_TIME
        takeTime()
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
