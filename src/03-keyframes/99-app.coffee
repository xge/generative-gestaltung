$ ->
    canvas = canvas = $("#myCanvas")[0]
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    context = canvas.getContext '2d'
    t = 0
    currentKeyframe = KEYFRAMES[0]
    currentKeyframeIdx = 0

    calcBlendFactor = (min, max, value) ->
        blendCurr = value - min
        blendStop = max - min
        blendFactor = (blendStop / 100) * blendCurr
        blendFactor / 100

    clear = () ->
        context.clearRect 0, 0, canvas.width, canvas.height

    updateKeyFrame = () ->
        $("#frameCounter").text t

        nextKeyFrameIdx = if KEYFRAMES[currentKeyframeIdx + 1]? then currentKeyframeIdx + 1 else 0
        nextKeyFrame = KEYFRAMES[nextKeyFrameIdx]

        if t > nextKeyFrame.t
            currentKeyframeIdx = nextKeyFrameIdx
            currentKeyframe = KEYFRAMES[currentKeyframeIdx]

        context.fillStyle = Color.blend(currentKeyframe.color, nextKeyFrame.color, calcBlendFactor(currentKeyframe.t, nextKeyFrame.t, t))
        context.fillRect 0, 0, canvas.width, canvas. height
        $("#currentKeyframe").text currentKeyframeIdx

    queue = () ->
        t = requestAnimationFrame drawLoop

    do drawLoop = () ->
        clear()
        updateKeyFrame()
        queue()
