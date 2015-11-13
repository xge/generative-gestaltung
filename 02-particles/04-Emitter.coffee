class Emitter
    constructor: (@position, @velocity, @spread = Math.PI / 32) ->
        @drawColor = "#f0f"

    emitParticle: () =>
        angle = @velocity.getAngle() + @spread - (Math.random() * @spread * 2)
        magnitude = @velocity.getMagnitude()
        position = new Vector @position.x, @position.y
        velocity = Vector.fromAngle angle, magnitude
        new Particle position, velocity