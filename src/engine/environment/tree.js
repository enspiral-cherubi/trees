import THREE from 'three'



function leafVertShader() {
  return `
    varying vec3 vNormal;

    void main() {
      vNormal = normal;

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `
}

function leafFragShader() {
  return `
      uniform float redScale;
      uniform float blueScale;
      uniform float greenScale;

      void main() {
        gl_FragColor = vec4( vNormal.x*redScale, vNormal.y*greenScale, vNormal.z*blueScale, opacity );
      }
  `
}
