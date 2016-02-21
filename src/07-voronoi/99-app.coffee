bbox = canvas = ctx = id = diagram = currentRenderer = currentMover = undefined
drawPoints = true
drawLine = false
points = []
margin = t = N_POINTS = 0

COLORS =
    STROKE: new Color(255, 255, 255, 0.2)
    FILL: new Color(20, 20, 20, 1.0)
    MOUSE: new Color(20, 40, 100, 0.3)
    LINE: new Color(255, 255, 255, 0.1)
    POINT: new Color(255, 255, 255, 0.9)

CONST =
    N_POINTS: 37
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
    generatePoints 4
    render()

generatePoints = (n) ->
    i = 0
    while i < n
        points.push generatePoint(COLORS.FILL)
        i++

generatePoint = (color) ->
    x = Math.ceil(Math.random() * canvas.width)
    y = Math.ceil(Math.random() * canvas.height)
    {
        x: x
        y: y
        c: color
        blend:
            source:
                x: x
                y: y
            destination:
                x: Math.ceil(Math.random() * canvas.width)
                y: Math.ceil(Math.random() * canvas.height)
    }

handleKeyPress = (e) ->
    switch e.code
        when "KeyQ" then currentMover = new CellMover()
        when "KeyW"
            generateCircleBlendTargets()
            currentMover = new BlendMover()
        when "KeyE"
            generateRandomBlendTargets()
            currentMover = new BlendMover()
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
        blend: {}

takeTime = () ->
    DEBUG.TIME = Date.now() - DEBUG.TIME
    console.debug "debug::TIME = #{DEBUG.TIME / 1000}s"

showControls = () ->
    console.debug "debug::CONTROLS show"
    for control in document.getElementsByClassName "control"
        control.classList.add "open"

renderDebug = () ->
    if t is 1
        showControls()
        document.onkeypress = handleKeyPress
    currentMover.move(points, t)
    currentRenderer.render(points)
    currentRenderer.renderPoints(points)

    t = requestAnimationFrame renderDebug

generateRandomBlendTargets = () ->
    for point in points
        point.blend.source =
            x: point.x
            y: point.y

        point.blend.destination =
            x: canvas.width * Math.random()
            y: canvas.height * Math.random()

generateCircleBlendTargets = () ->
    for point, i in points
        point.blend.source =
            x: point.x
            y: point.y
        r = canvas.height / 4
        point.blend.destination =
            x: canvas.width / 2 + r * Math.cos(2 * (i + 1) * Math.PI / points.length)
            y: canvas.height / 2 + r * Math.sin(2 * (i + 1) * Math.PI / points.length)

render = () ->
    if t is 1
        takeTime()
        currentMover = new CellMover()
    if CONST.INTRO_TIME < t < 2 * CONST.INTRO_TIME
        if t % CONST.INTERVAL is 0 and points.length < CONST.N_POINTS
            points.push generatePoint(COLORS.FILL)
    if t is 2 * CONST.INTRO_TIME
        takeTime()
        generateCircleBlendTargets()
        currentMover = new BlendMover()
    if t is 3 * CONST.INTRO_TIME
        takeTime()
        currentMover = new CellMover()
    if t is 5 * CONST.INTRO_TIME
        takeTime()
        generateCircleBlendTargets()
        currentMover = new BlendMover()
    if t is 6 * CONST.INTRO_TIME
        takeTime()
        currentRenderer = new PointsOnlyRenderer(ctx, canvas.width, canvas.height)
        currentMover = new CellMover()
    # blend to random position
    if t is 7 * CONST.INTRO_TIME
        takeTime()
        generateRandomBlendTargets()
        currentMover = new BlendMover()
    # slowly pop until points.length is 2
    if 8 * CONST.INTRO_TIME < t < 9 * CONST.INTRO_TIME
        if t % CONST.INTERVAL is 0 and points.length > 2
            points.pop()
    # blend to circle Position
    if t is 9 * CONST.INTRO_TIME
        takeTime()
        generateCircleBlendTargets()
        currentMover = new BlendMover()
    # activate line renderer
    if t is 10 * CONST.INTRO_TIME - 100
        takeTime()
        currentMover = new CircleMover(canvas.width, canvas.height)
        currentRenderer = new LineRenderer(ctx, canvas.width, canvas.height)
    # slowly push until points.length is N_POINTS
    if 10 * CONST.INTRO_TIME < t < 11 * CONST.INTRO_TIME
        if t % CONST.INTERVAL is 0 and points.length < CONST.N_POINTS
            points.push generatePoint(COLORS.FILL)
    # show controls
    if t is 11 * CONST.INTRO_TIME + 100
        takeTime()
        showControls()
        document.onkeypress = handleKeyPress

    currentMover.move(points, t)
    currentRenderer.render(points)
    currentRenderer.renderPoints(points)

    t = requestAnimationFrame render

init()
