(($) ->
    $ ->
        canvas = $("#myCanvas")[0]
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        context = canvas.getContext '2d'
        frameCount = 0
        centerX = canvas.width / 2
        centerY = canvas.height /

        CONSTANTS =
            RIGHT: 1
            LEFT: 0
            DEFAULT_BOX_SIZE: 25

        boxSize = CONSTANTS.DEFAULT_BOX_SIZE
        count = Math.floor(canvas.height / boxSize)
        rects = []

        class Rect
            constructor: (@context, @x, @y, @dir = CONSTANTS.RIGHT) ->
                @offsetY = 10
                @generateRandomOffset()

            generateRandomOffset: () =>
                @randomOffsetX = Math.floor(Math.random() * (10)) + 1

            draw: (size = boxSize) =>
                offsetX = 75 * Math.sin(frameCount * 0.02) * @randomOffsetX
                @generateRandomOffset() if offsetX <= centerX - 10 or offsetX >= centerX + 10
                context.fillStyle = "rgba(200,50,50,1)"
                context.strokeStyle = "rgba(20,0,120,0.6)"

                if @dir is CONSTANTS.RIGHT
                    context.fillRect @x + offsetX, @y, size, size
                else
                    context.fillRect @x - offsetX, @y, size, size

        windowResized = ->
            canvas.height = window.innerHeight
            canvas.width = window.innerWidth
            centerX = canvas.width / 2
            centerY = canvas.height /
            generateBoxes()
            console.log "window was resized"

        inputChanged = ->
            boxSize = $("#boxSizeInput").val()
            $("#boxSize").text boxSize
            generateBoxes()

        generateBoxes = ->
            rects = []
            for i in [0..Math.floor(canvas.height / boxSize)]
                dir = CONSTANTS.LEFT
                if i % 2 is 0
                    dir = CONSTANTS.RIGHT
                rects.push new Rect(context, centerX, boxSize * i, dir)

        setup = ->
            boxSizeInput = $ "#boxSizeInput"
            boxSizeInput.max = Math.floor(canvas.height)
            boxSizeInput.on "input", inputChanged

            $("#boxSize").text boxSize

            $(window).on "resize", windowResized

            generateBoxes()

        draw = ->
            context.clearRect 0, 0, canvas.width, canvas.height

            rect.draw() for rect in rects

            frameCount++
            requestAnimationFrame draw

        setup()
        draw()
) jQuery
