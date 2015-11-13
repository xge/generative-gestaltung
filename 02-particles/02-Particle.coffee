class Particle
    constructor: (@position = new Vector(0, 0), @velocity = new Vector(0, 0), @acceleration = new Vector(0, 0)) ->

    move: () =>
        @velocity.add @acceleration
        @position.add @velocity

    submitToFields: (fields) =>
        totalAccelerationX = 0
        totalAccelerationY = 0

        for field in fields
            vectorX = field.position.x - @position.x
            vectorY = field.position.y - @position.y

            force = field.mass / Math.pow(vectorX * vectorX + vectorY * vectorY, 1.5)

            totalAccelerationX += vectorX * force
            totalAccelerationY += vectorY * force

        @acceleration = new Vector totalAccelerationX, totalAccelerationY