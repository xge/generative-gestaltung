$ ->
    canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'

    visuals = [
        new RandomBoxes(canvas, context)
        new MoireeLine(canvas, context)
    ]

    # Add window.resize event handler
    $(window).on "resize", () ->
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        visuals[1].canvasResized canvas

    visuals[1].setUpAndStart()
