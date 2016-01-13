class App
    constructor: ->
        @clock = new THREE.Clock()
        @clock.start()

        @rotateVal = 0

        @scene = new THREE.Scene()
        @scene.fog = new THREE.Fog(0xffffff, 1, 1500)

        @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
        @camera.position.z = 50

        @renderer = new THREE.WebGLRenderer( antialias: true )
        @renderer.setClearColor @scene.fog.color
        @renderer.setSize(window.innerWidth, window.innerHeight)
        @renderer.setPixelRatio window.devicePixelRatio
        document.body.appendChild @renderer.domElement

        geometry = new THREE.Geometry()

        PI2 = Math.PI * 2
        material = new THREE.SpriteMaterial color: 0x000000, fog: true

        for i in [0..75]
            particle = new THREE.Sprite material
            particle.position.x = Math.random() * 2 - 1
            particle.position.y = Math.random() * 2 - 1
            particle.position.z = Math.random() * 2 - 1
            particle.position.normalize()
            particle.position.multiplyScalar( Math.random() * 1000 + 1000 )
            particle.scale.x = particle.scale.y = 50
            @scene.add particle

            geometry.vertices.push particle.position

        line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial(
                color: 0x000000
                opacity: 0.5
                linewidth: 0.1
            )
        )
        @scene.add line

        @black = new THREE.Mesh(
            new THREE.IcosahedronGeometry(350, 1)
            new THREE.MeshBasicMaterial
                color: 0x000000
                wireframe: true
                wireframeLinewidth: 10
        )
        @black.position.set 0, 0, 0
        @scene.add @black

        light = new THREE.AmbientLight 0x404040
        @scene.add light

        directionalLight = new THREE.DirectionalLight 0xffffff, 0.5
        directionalLight.position.set 0, 200, 0
        @scene.add directionalLight

        # post processing
        @composer = new THREE.EffectComposer @renderer
        @composer.addPass(new THREE.RenderPass @scene, @camera);

        effect = new THREE.ShaderPass THREE.RGBShiftShader
        effect.uniforms['amount'].value = 0.02
        effect.uniforms['angle'].value = 45
        @composer.addPass effect

        vignette = new THREE.ShaderPass THREE.VignetteShader
        vignette.uniforms['offset'].value = 0.6
        vignette.uniforms['darkness'].value = 0.5
        vignette.renderToScreen = true
        @composer.addPass vignette

        @animate()

    animate: =>
        requestAnimationFrame @animate

        val = Math.sin(performance.now() * 0.0001) * 250
        @camera.position.set val, val, val + 250
        @camera.lookAt new THREE.Vector3 0

        if @clock.getElapsedTime() > 10
            @rotateVal += 0.001 if @rotateVal < 0.1
            @black.rotateY @rotateVal

        @composer.render @scene, @camera

app = new App()
