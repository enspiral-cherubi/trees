import THREE from 'three'

class Leaf {
  constructor (location,direction,leafGeometry) {
    this.geometry = leafGeometry.clone()

    //reversing the order of these is way neat
    if(direction){
      this.geometry.lookAt(direction)
      this.geometry.facesNeedUpdate
      this.geometry.uvsNeedUpdate
    }
    if(location){
      this.geometry.origin = location
      this.geometry.translate(location.x,location.y,location.z)
    }
    this.geometry.computeFaceNormals()
    this.geometry.axis = this.geometry.faces[0].normal
    // this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    let uniforms = {redScale: 0, greenScale: 1.0, blueScale: 0}
    this.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: leafFragShader(),
      vertexShader: leafVertShader()
    })
    this.mesh = new THREE.Mesh(this.geometry,this.material)
  }




}

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
        gl_FragColor = vec4( vNormal.x*redScale, vNormal.y*blueScale, vNormal.z*greenScale, opacity );
      }
  `
}



export default Leaf
