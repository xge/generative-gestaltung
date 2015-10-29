class CRCLS
    constructor: (@canvas, @context) ->
        @frameCount = 0
        @circles = []
        @circles.push new Circle(@canvas.width / 2, @canvas.height / 2, @canvas, @context)

    canvasResized: (newCanvas) =>
        @canvas = newCanvas
        @draw()

    setUpAndStart: =>
        $("body").prepend "<div id=\"headline\">$(canvas).on 'click', () -> rain()</div>"
        $(@canvas).on "click", @createCircleAtMousePos
        @draw()

    draw: =>
        @context.clearRect 0, 0, @canvas.width, @canvas.height

        for circle in @circles
            circle.draw()
            circle.resize()

        # delete circles
        @circles = @circles.filter (circle) -> circle.radius < circle.maxRadius

        @frameCount++
        @rafId = requestAnimationFrame @draw

    createCircleAtMousePos: (e) =>
        @circles.push new Circle(e.pageX, e.pageY, @canvas, @context)

    tearDown: =>
        $(@canvas).off "click"
        $("#headline").remove()
        window.cancelAnimationFrame @rafId

    class Circle
        constructor: (@x, @y, @canvas, @context) ->
            @radius = 0
            @maxRadius = 250 + (@canvas.height / 2) * Math.random()

        draw: () ->
            @context.strokeStyle = "rgb(#{0 + @radius},#{0 + @radius},#{0 + @radius})"
            @context.beginPath()
            @context.arc @x, @y, @radius, 0, 2 * Math.PI, true
            @context.closePath()
            @context.stroke()

        resize: () ->
            @radius = 0 if @radius > @maxRadius
            @radius++
