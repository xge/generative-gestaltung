class App
    constructor: ->
        @scene = new THREE.Scene()
        @scene.fog = new THREE.Fog(0x000000, 100, 1500)

        @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
        @camera.position.z = 50

        @renderer = new THREE.WebGLRenderer( antialias: true )
        @renderer.setSize(window.innerWidth, window.innerHeight)
        @renderer.setPixelRatio window.devicePixelRatio
        document.body.appendChild @renderer.domElement

        geometry = new THREE.Geometry()

        PI2 = Math.PI * 2
        material = new THREE.SpriteMaterial color: 0xffffff, fog: true

        for i in [0..100]
            particle = new THREE.Sprite material
            particle.position.x = Math.random() * 2 - 1
            particle.position.y = Math.random() * 2 - 1
            particle.position.z = Math.random() * 2 - 1
            particle.position.normalize()
            particle.position.multiplyScalar( Math.random() * 650 + 650 )
            particle.scale.x = particle.scale.y = 50
            @scene.add particle

            geometry.vertices.push particle.position

        line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial(
                color: 0xffffff,
                opacity: 0.5
            )
        )
        @scene.add line

        # post processing
        @composer = new THREE.EffectComposer @renderer
        @composer.addPass(new THREE.RenderPass @scene, @camera);

        effect = new THREE.ShaderPass THREE.RGBShiftShader
        effect.uniforms['amount'].value = 0.002
        effect.renderToScreen = true
        @composer.addPass effect

        @animate()

    animate: =>
        requestAnimationFrame @animate

        val = Math.sin(performance.now() * 0.0001) * 250 + 250
        @camera.position.set val, val, val + 250
        @camera.lookAt new THREE.Vector3 0, 0, 0

        @composer.render @scene, @camera

app = new App()
