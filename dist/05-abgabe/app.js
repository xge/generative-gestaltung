(function() {
  var App, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    function App() {
      this.animate = bind(this.animate, this);
      var PI2, effect, geometry, i, j, line, material, particle, vignette;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 100, 1500);
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
      for (i = j = 0; j <= 100; i = ++j) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 650 + 650);
        particle.scale.x = particle.scale.y = 50;
        this.scene.add(particle);
        geometry.vertices.push(particle.position);
      }
      line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: 0.5
      }));
      this.scene.add(line);
      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
      effect = new THREE.ShaderPass(THREE.RGBShiftShader);
      effect.uniforms['amount'].value = 0.002;
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
      val = Math.sin(performance.now() * 0.0001) * 250 + 250;
      this.camera.position.set(val, val, val + 250);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      return this.composer.render(this.scene, this.camera);
    };

    return App;

  })();

  app = new App();

}).call(this);
