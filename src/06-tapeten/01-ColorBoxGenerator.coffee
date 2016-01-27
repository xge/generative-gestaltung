class ColorBoxGenerator
    constructor: (colors) ->
        for color in colors
            $("#colorBoxes").append "<div style='width: 100%; height: 50px; background-color: ##{color}'></div>"
        $("body").css "background-color", "##{colors[0]}"
