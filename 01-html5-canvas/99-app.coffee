$ ->
    canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'

    currentVis = 0

    visuals = [
            id: 0
            name: "Random Boxes"
            fn: new RandomBoxes(canvas, context)
        ,
            id: 1
            name: "Moirée Line"
            fn: new MoireLine(canvas, context)
        ,
            id: 2
            name: "CRCLS"
            fn: new CRCLS(canvas, context)
        ,
            id: 3
            name: "Spline"
            fn: new Spline(canvas, context)
    ]

    # Add window.resize event handler
    $(window).on "resize", () ->
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        visuals[currentVis].fn.canvasResized canvas

    # Add main app controls
    form = $("#controls form")
    form.prepend """
    <label for="visuals">Select visual:</label><br />
    <select name="visuals">
    </select><br />
    """

    for visual in visuals
        form.find("select").append "<option value=#{visual.id}>#{visual.name}</option>"

    form.find("select").on "input", () ->
        visuals[currentVis].fn.tearDown()
        currentVis = form.find("select").val()
        visuals[currentVis].fn.setUpAndStart()

    # fire it up!
    visuals[currentVis].fn.setUpAndStart()
