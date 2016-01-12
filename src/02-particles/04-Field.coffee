class Field
    constructor: (@position, mass) ->
        @setMass mass

    setMass: (@mass = 100) =>
        @drawColor = if @mass < 0 then "#f00" else "#0f0"