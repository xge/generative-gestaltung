(function() {
  var App, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    function App() {
      this.animate = bind(this.animate, this);
      var PI2, directionalLight, effect, geometry, i, j, light, line, material, particle, vignette;
      this.clock = new THREE.Clock();
      this.clock.start();
      this.rotateVal = 0;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 1, 1500);
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
      this.camera.position.z = 50;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(this.scene.fog.color);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      document.body.appendChild(this.renderer.domElement);
      geometry = new THREE.Geometry();
      PI2 = Math.PI * 2;
      material = new THREE.SpriteMaterial({
        color: 0x000000,
        fog: true
      });
      for (i = j = 0; j <= 75; i = ++j) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 1000 + 1000);
        particle.scale.x = particle.scale.y = 50;
        this.scene.add(particle);
        geometry.vertices.push(particle.position);
      }
      line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: 0.5,
        linewidth: 0.1
      }));
      this.scene.add(line);
      this.black = new THREE.Mesh(new THREE.IcosahedronGeometry(350, 1), new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth: 10
      }));
      this.black.position.set(0, 0, 0);
      this.scene.add(this.black);
      light = new THREE.AmbientLight(0x404040);
      this.scene.add(light);
      directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 200, 0);
      this.scene.add(directionalLight);
      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
      effect = new THREE.ShaderPass(THREE.RGBShiftShader);
      effect.uniforms['amount'].value = 0.02;
      effect.uniforms['angle'].value = 45;
      this.composer.addPass(effect);
      vignette = new THREE.ShaderPass(THREE.VignetteShader);
      vignette.uniforms['offset'].value = 0.6;
      vignette.uniforms['darkness'].value = 0.5;
      vignette.renderToScreen = true;
      this.composer.addPass(vignette);
      this.animate();
    }

    App.prototype.animate = function() {
      var val;
      requestAnimationFrame(this.animate);
      val = Math.sin(performance.now() * 0.0001) * 250;
      this.camera.position.set(val, val, val + 250);
      this.camera.lookAt(new THREE.Vector3(0));
      if (this.clock.getElapsedTime() > 10) {
        if (this.rotateVal < 0.1) {
          this.rotateVal += 0.001;
        }
        this.black.rotateY(this.rotateVal);
      }
      return this.composer.render(this.scene, this.camera);
    };

    return App;

  })();

  app = new App();

}).call(this);
