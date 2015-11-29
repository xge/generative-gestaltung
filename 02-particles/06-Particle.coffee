class Particle

    @color = new Color(129, 129, 129)

    constructor: (@position = new Vector(0, 0), @velocity = new Vector(0, 0), @acceleration = new Vector(0, 0), @size = 20) ->
        @originalSize = @size

    move: () =>
        @velocity.add @acceleration
        @position.add @velocity

    calculateForces: (fields) =>
        totalAccelerationX = 0
        totalAccelerationY = 0

        for field in fields
            vectorX = field.position.x - @position.x
            vectorY = field.position.y - @position.y

            force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5)

            totalAccelerationX += vectorX * force
            totalAccelerationY += vectorY * force

        @acceleration = new Vector totalAccelerationX, totalAccelerationY
        @acc = @acceleration.getLength() # short-hand
        @color = Color.blend(new Color(32, 32, 32), new Color(192, 192, 192), @acc * 20)
        @size = @originalSize / Helper.clamp(@acc * 20, 1, 4)