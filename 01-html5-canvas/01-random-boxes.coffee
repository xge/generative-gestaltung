class RandomBoxes

    constructor: (@canvas, @context) ->
        @frameCount = 0
        @centerX = @canvas.width / 2
        @centerY = @canvas.height /

        @CONSTANTS =
            RIGHT: 1
            LEFT: 0
            DEFAULT_BOX_SIZE: 25

        @boxSize = @CONSTANTS.DEFAULT_BOX_SIZE
        @count = Math.floor(@canvas.height / @boxSize)
        @rects = []

    canvasResized: (newCanvas) =>
        @canvas = newCanvas
        @centerX = @canvas.width / 2
        @centerY = @canvas.height / 2
        @generateBoxes()

    inputChanged: =>
        @boxSize = $("#boxSizeInput").val()
        $("#boxSize").text @boxSize
        @generateBoxes()

    generateBoxes: =>
        @rects = []
        for i in [0..Math.floor(@canvas.height / @boxSize)]
            dir = @CONSTANTS.LEFT
            if i % 2 is 0
                dir = @CONSTANTS.RIGHT
            @rects.push new Rect(@context, @centerX, @boxSize * i, dir)

    setUpAndStart: =>
        $("#controls form").append """
    <div id="random-boxes">
        <label for="boxSize">Box size: <span id="boxSize"></span></label><br />
        <input type="range" value="25" min="5" max="1080" id="boxSizeInput" /><br />
    </div>
        """

        boxSizeInput = $ "#boxSizeInput"
        boxSizeInput.max = Math.floor(@canvas.height)
        boxSizeInput.on "input", @inputChanged
        @boxSize = boxSizeInput.val()

        $("#boxSize").text @boxSize

        @generateBoxes()
        @draw()

    draw: =>
        @context.clearRect 0, 0, @canvas.width, @canvas.height

        rect.draw(@frameCount, @centerX, @centerY, @boxSize) for rect in @rects

        @frameCount++
        @rafId = requestAnimationFrame @draw

    tearDown: =>
        $("#boxSizeInput").off "input"
        $("#random-boxes").remove()
        window.cancelAnimationFrame @rafId

    # Inner class to model a single rectangle
    class Rect
        constructor: (@context, @x, @y, @dir = 1) ->
            @offsetY = 10
            @generateRandomOffset()

        generateRandomOffset: () =>
            @randomOffsetX = Math.floor(Math.random() * (10)) + 1

        draw: (frameCount, centerX, centerY, size) =>
            offsetX = 75 * Math.sin(frameCount * 0.02) * @randomOffsetX
            @generateRandomOffset() if offsetX <= centerX - 10 or offsetX >= centerX + 10
            @context.fillStyle = "rgba(200,50,50,1)"
            @context.strokeStyle = "rgba(20,0,120,0.6)"

            if @dir > 0
                @context.fillRect @x + offsetX, @y, size, size
            else
                @context.fillRect @x - offsetX, @y, size, size
