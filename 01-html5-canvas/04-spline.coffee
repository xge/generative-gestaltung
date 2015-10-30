class Spline
    constructor: (@canvas, @context) ->
        @frameCount = 0
        @offsetX = 0
        @offsetY = 0
        @TO_RADIANS = Math.PI / 360
        @fillStyle = "magenta"
        @brushSize = 20

    canvasResized: (@canvas) =>

    setUpAndStart: =>
        $("#controls form").append """
    <div id="spline">
        <div class="form-group">
            <label for="fillStyleInput">FillStyle</label>
            <input class="form-control" type="text" value="magenta" id="fillStyleInput" />
        </div>
        <div class="form-group">
            <label for="brushSizeInput">Brush size</label>
            <input class="form-control" type="number" value="20" min="5" max="50" id="brushSizeInput" />
        </div>
    </div>
        """

        $("#fillStyleInput").on "input", @fillStyleInput
        $("#brushSizeInput").on "input", @brushSizeInput

        @clear("white")
        @draw()

    fillStyleInput: (e) =>
        @fillStyle = e.target.value

    brushSizeInput: (e) =>
        @brushSize = e.target.value

    clear: (style = "rgba(255,255,255,0.03)") =>
        @context.save()
        @context.fillStyle = style
        @context.fillRect 0, 0, @canvas.width, @canvas.height
        @context.restore()

    draw: =>
        @clear()

        @offsetX += 2
        @offsetY += 1 + Math.random() * Math.random()

        x = Math.sin(@canvas.width + @offsetX * @TO_RADIANS) * @canvas.width / 2
        y = Math.sin(@canvas.height + @offsetY * @TO_RADIANS) * @canvas.height / 2

        @context.fillStyle = @fillStyle # TOOD: parameterize
        @circle x, y, @brushSize  # TOOD: parameterize

        @frameCount++
        @rafId = requestAnimationFrame @draw


    circle: (x, y, w) ->
        @context.beginPath()
        @context.arc @canvas.width / 2 + x, @canvas.height / 2 + y, w, 0, Math.PI * 2, true
        @context.closePath()
        @context.fill()

    tearDown: =>
        $("#spline").remove()
        window.cancelAnimationFrame @rafId

