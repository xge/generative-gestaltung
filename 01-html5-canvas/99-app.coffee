$ ->
    canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'

    visuals = [ new RandomBoxes(canvas, context) ]

    # Add window.resize event handler
    $(window).on "resize", () ->
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        visuals[0].canvasResized canvas

    visuals[0].setUpAndStart(canvas)
