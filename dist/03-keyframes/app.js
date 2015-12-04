(function() {
  var Color, KEYFRAMES;

  Color = (function() {
    function Color(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a != null ? a : 1.0;
    }

    Color.prototype.toString = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    };

    Color.blend = function(x, y, value) {
      return new Color(Math.round(x.r * (1 - value) + y.r * value), Math.round(x.g * (1 - value) + y.g * value), Math.round(x.b * (1 - value) + y.b * value), Math.round(x.a * (1 - value) + y.a * value));
    };

    return Color;

  })();

  KEYFRAMES = [
    {
      t: 0,
      color: new Color("0", "0", "0")
    }, {
      t: 250,
      color: new Color("255", "0", "0")
    }, {
      t: 500,
      color: new Color("255", "255", "0")
    }, {
      t: 750,
      color: new Color("255", "255", "255")
    }, {
      t: 1000,
      color: new Color("0", "255", "255")
    }, {
      t: 1250,
      color: new Color("0", "0", "255")
    }
  ];

  $(function() {
    var calcBlendFactor, canvas, clear, context, currentKeyframe, currentKeyframeIdx, drawLoop, queue, t, updateKeyFrame;
    canvas = canvas = $("#myCanvas")[0];
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    context = canvas.getContext('2d');
    t = 0;
    currentKeyframe = KEYFRAMES[0];
    currentKeyframeIdx = 0;
    calcBlendFactor = function(min, max, value) {
      var blendCurr, blendFactor, blendStop;
      blendCurr = value - min;
      blendStop = max - min;
      blendFactor = (blendStop / 100) * blendCurr;
      return blendFactor / 100;
    };
    clear = function() {
      return context.clearRect(0, 0, canvas.width, canvas.height);
    };
    updateKeyFrame = function() {
      var nextKeyFrame, nextKeyFrameIdx;
      $("#frameCounter").text(t);
      nextKeyFrameIdx = KEYFRAMES[currentKeyframeIdx + 1] != null ? currentKeyframeIdx + 1 : 0;
      nextKeyFrame = KEYFRAMES[nextKeyFrameIdx];
      if (t > nextKeyFrame.t) {
        currentKeyframeIdx = nextKeyFrameIdx;
        currentKeyframe = KEYFRAMES[currentKeyframeIdx];
      }
      context.fillStyle = Color.blend(currentKeyframe.color, nextKeyFrame.color, calcBlendFactor(currentKeyframe.t, nextKeyFrame.t, t));
      context.fillRect(0, 0, canvas.width, canvas.height);
      return $("#currentKeyframe").text(currentKeyframeIdx);
    };
    queue = function() {
      return t = requestAnimationFrame(drawLoop);
    };
    return (drawLoop = function() {
      clear();
      updateKeyFrame();
      return queue();
    })();
  });

}).call(this);
