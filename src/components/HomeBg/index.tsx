import React from "react";
import * as THREE from "three";
import bgImg from "~/assets/mainbg.jpg";

const particleCount = 1000;

const material = new THREE.PointsMaterial({
  // color: 0x313742,
  size: 1,
  vertexColors: THREE.VertexColors,
});

export default class HomeBg extends React.Component {

  container = React.createRef<HTMLDivElement>();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();

  mouseX;
  mouseY;
  count;

  particles: THREE.Points;

  componentDidMount() {
    this.init();
  }

  init() {

    // init camera
    this.scene.add(this.camera);

    const container = this.container.current!!;

    const image = new Image();
    image.onload = () => {

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d")!!;
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, image.width, image.height);

      this.camera.position.set(image.width / 2, image.height / 2, 1000);
      this.camera.lookAt(new THREE.Vector3(image.width / 2, image.height / 2, 0));

      // process image data

      const geometry = new THREE.Geometry();

      for (let y = 0, y2 = imageData.height; y < y2; y += 1) {
        for (let x = 0, x2 = imageData.width; x < x2; x += 1) {

          const R = imageData.data[(x * imageData.width + y) * 4];
          const G = imageData.data[(x * imageData.width + y) * 4 + 1];
          const B = imageData.data[(x * imageData.width + y) * 4 + 2];
          const color = new THREE.Color(R, G, B);

          const vertex = new THREE.Vector3(x, y, 0);

          geometry.colors.push(color);
          geometry.vertices.push(vertex);
        }
      }

      this.particles = new THREE.Points(geometry, material);

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      container.appendChild(this.renderer.domElement);

      this.scene.add(this.particles);

      var axisHelper = new THREE.AxisHelper(4);
axisHelper.rotation.y -=0.01;//坐标轴旋转
this.scene.add(axisHelper)

      this.renderer.render(this.scene, this.camera);
      this.animate();
    };

    image.src = bgImg;

    // document.addEventListener("mousemove", this.onDocumentMouseMove, false);
    // document.addEventListener("touchstart", this.onDocumentTouchStart, false);
    // document.addEventListener("touchmove", this.onDocumentTouchMove, false);

    window.addEventListener("resize", this.onWindowResize, false);

  }

  onDocumentMouseMove = (event) => {

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    this.mouseX = event.clientX - windowHalfX;
    this.mouseY = event.clientY - windowHalfY;

  }

  onWindowResize = () => {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }

  onDocumentTouchStart = (event) => {

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    if (event.touches.length === 1) {

      event.preventDefault();

      this.mouseX = event.touches[0].pageX - windowHalfX;
      this.mouseY = event.touches[0].pageY - windowHalfY;

    }

  }

  onDocumentTouchMove = (event) => {

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    if (event.touches.length === 1) {

      event.preventDefault();

      this.mouseX = event.touches[0].pageX - windowHalfX;
      this.mouseY = event.touches[0].pageY - windowHalfY;

    }

  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
  }

  renderScene() {

    // this.geometry.vertices.forEach((particle) => {
    //   const dX = Math.random() * 2 -1;
    //   const dY = Math.random() * 2 -1;
    //   const dZ = Math.random() * 2 -1;

    //   particle.add(new THREE.Vector3(dX, dY, dZ));
    // });

    // this.particles.geometry.verticesNeedUpdate = true;
    // this.renderer.render(this.scene, this.camera);

  };

  render() {
    return (
      <div ref={this.container} />
    );
  }
}
