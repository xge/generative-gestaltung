(function() {
  var App, app,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    function App() {
      this.animate = bind(this.animate, this);
      var PI2, effect, geometry, halfWidth, height, i, intro, j, light, line, material, particle, ref, width;
      width = window.innerWidth;
      halfWidth = Math.ceil(width / 2);
      height = window.innerHeight;
      this.clock = new THREE.Clock();
      this.rotateVal = 0;
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0xffffff, 1, 1500);
      this.camera = new THREE.PerspectiveCamera(75, width / height, 1, width * 10);
      this.camera.position.y = 50;
      this.camera.position.z = height * 3;
      this.camera.lookAt(new THREE.Vector3(0));
      intro = new THREE.Mesh(new THREE.TextGeometry("Linien", {
        height: 15
      }), new THREE.MeshPhongMaterial({
        color: 0x000000
      }));
      intro.position.x = 15;
      intro.position.z = height * 2.5;
      this.scene.add(intro);
      light = new THREE.AmbientLight(0x404040);
      this.scene.add(light);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(this.scene.fog.color);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      document.body.appendChild(this.renderer.domElement);
      geometry = new THREE.Geometry();
      PI2 = Math.PI * 2;
      material = new THREE.SpriteMaterial({
        color: 0x000000,
        fog: true
      });
      for (i = j = 0, ref = width / 20; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * halfWidth + halfWidth);
        particle.scale.x = particle.scale.y = Math.ceil(width / 40);
        this.scene.add(particle);
        geometry.vertices.push(particle.position);
      }
      line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: 0.5,
        linewidth: 0.1
      }));
      this.scene.add(line);
      this.black = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.ceil(width / 5), 1), new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth: 10
      }));
      this.black.position.set(0, 0, 0);
      this.scene.add(this.black);
      this.composer = new THREE.EffectComposer(this.renderer);
      this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
      effect = new THREE.ShaderPass(THREE.RGBShiftShader);
      effect.uniforms['amount'].value = 0.02;
      effect.uniforms['angle'].value = 45;
      this.composer.addPass(effect);
      this.vignette = new THREE.ShaderPass(THREE.VignetteShader);
      this.vignette.uniforms['offset'].value = 0.5;
      this.vignette.uniforms['darkness'].value = 0;
      this.vignette.renderToScreen = true;
      this.composer.addPass(this.vignette);
      this.animate();
    }

    App.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      if (this.clock.getElapsedTime() < 38) {
        this.camera.position.z--;
        if (this.vignette.uniforms['darkness'].value < 0.5) {
          this.vignette.uniforms['darkness'].value += 0.001;
        }
      }
      if (this.clock.getElapsedTime() > 40) {
        if (this.rotateVal < 0.05) {
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
