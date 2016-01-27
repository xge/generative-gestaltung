$ ->
    init = (response) ->
        generators = [new ColorBoxGenerator response[0].colors]


    $.ajax(
        url: "http://www.colourlovers.com/api/palettes/random?format=json&keywords=wallpaper&jsonCallback=callback"
        dataType: "jsonp"
        jsonpCallback: "callback"
    ).done(init)
