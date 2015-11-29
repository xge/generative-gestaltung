class Emitter
    constructor: (@position, @velocity, @spread = Math.PI / 32) ->
        @drawColor = "#f0f"

    emitParticle: () =>
        angle = @velocity.getAngle() + @spread - (Math.random() * @spread * 2)
        length = @velocity.getLength()
        position = new Vector @position.x, @position.y
        velocity = Vector.fromAngle angle, length
        new Particle position, velocity