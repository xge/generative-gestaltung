class App
    constructor: ->
        width = window.innerWidth
        halfWidth = Math.ceil(width/2)
        height = window.innerHeight

        @clock = new THREE.Clock()

        @rotateVal = 0

        @scene = new THREE.Scene()
        @scene.fog = new THREE.Fog(0xffffff, 1, 1500)

        @camera = new THREE.PerspectiveCamera(75, width / height, 1, width * 10)
        @camera.position.y = 50
        @camera.position.z = 3000
        @camera.lookAt new THREE.Vector3 0

        intro = new THREE.Mesh(
            new THREE.TextGeometry(
                "Linien",
                height: 15
            )
            new THREE.MeshPhongMaterial color: 0x000000
        )
        intro.position.x = 15
        intro.position.z = 2500
        @scene.add intro

        light = new THREE.AmbientLight 0x404040
        @scene.add light

        @renderer = new THREE.WebGLRenderer( antialias: true )
        @renderer.setClearColor @scene.fog.color
        @renderer.setSize width, height
        @renderer.setPixelRatio window.devicePixelRatio
        document.body.appendChild @renderer.domElement

        geometry = new THREE.Geometry()

        PI2 = Math.PI * 2
        material = new THREE.SpriteMaterial color: 0x000000, fog: true

        for i in [0..width/20]
            particle = new THREE.Sprite material
            particle.position.x = Math.random() * 2 - 1
            particle.position.y = Math.random() * 2 - 1
            particle.position.z = Math.random() * 2 - 1
            particle.position.normalize()
            particle.position.multiplyScalar( Math.random() * halfWidth + halfWidth )
            particle.scale.x = particle.scale.y = Math.ceil width/40
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
            new THREE.IcosahedronGeometry(Math.ceil(width / 5), 1)
            new THREE.MeshBasicMaterial
                color: 0x000000
                wireframe: true
                wireframeLinewidth: 10
        )
        @black.position.set 0, 0, 0
        @scene.add @black

        # post processing
        @composer = new THREE.EffectComposer @renderer
        @composer.addPass(new THREE.RenderPass @scene, @camera);

        effect = new THREE.ShaderPass THREE.RGBShiftShader
        effect.uniforms['amount'].value = 0.02
        effect.uniforms['angle'].value = 45
        @composer.addPass effect

        @vignette = new THREE.ShaderPass THREE.VignetteShader
        @vignette.uniforms['offset'].value = 0.5
        @vignette.uniforms['darkness'].value = 0
        @vignette.renderToScreen = true
        @composer.addPass @vignette

        @animate()

    animate: =>
        requestAnimationFrame @animate

        if @clock.getElapsedTime() < 38
            @camera.position.z--
            @vignette.uniforms['darkness'].value += 0.001 if @vignette.uniforms['darkness'].value < 0.5

        if @clock.getElapsedTime() > 40
            # start spinning the thing
            @rotateVal += 0.001 if @rotateVal < 0.05
            @black.rotateY @rotateVal

        @composer.render @scene, @camera

app = new App()
