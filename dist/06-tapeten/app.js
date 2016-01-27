(function() {
  var ColorBoxGenerator;

  ColorBoxGenerator = (function() {
    function ColorBoxGenerator(colors) {
      var color, i, len;
      for (i = 0, len = colors.length; i < len; i++) {
        color = colors[i];
        $("#colorBoxes").append("<div style='width: 100%; height: 50px; background-color: #" + color + "'></div>");
      }
      $("body").css("background-color", "#" + colors[0]);
    }

    return ColorBoxGenerator;

  })();

  $(function() {
    var init;
    init = function(response) {
      var generators;
      return generators = [new ColorBoxGenerator(response[0].colors)];
    };
    return $.ajax({
      url: "http://www.colourlovers.com/api/palettes/random?format=json&keywords=wallpaper&jsonCallback=callback",
      dataType: "jsonp",
      jsonpCallback: "callback"
    }).done(init);
  });

}).call(this);
