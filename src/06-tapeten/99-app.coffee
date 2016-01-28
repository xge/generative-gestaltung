$ ->
    init = (response) ->
        # response = [colors: ["71A1F2", "5B6F8F", "CF9B11", "7C6D46", "79314A"]]
        generator = new Bullseye(response[0].colors, $("#tapeteBullseye"))
        generator.draw
        generator = new Rekt(response[0].colors, $("#tapeteRekt"))
        generator.draw
        generator = new Sine(response[0].colors, $("#tapeteSine"))
        generator.draw

    $.ajax(
        url: "http://www.colourlovers.com/api/palettes/random?format=json&jsonCallback=callback"
        dataType: "jsonp"
        jsonpCallback: "callback"
    ).done(init)