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
    let uniforms = {
      redScale: {type: 'float', value: 0.3},
      greenScale: {type: 'float', value: 0.8},
      blueScale: {type: 'float', value: 0.1}
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      fragmentShader: leafFragShader(),
      vertexShader: leafVertShader()
    })
    this.mesh = new THREE.Mesh(this.geometry,this.material)
  }

  generateLeafGeometry() {
      //r(theta) = (1+ b*sin(theta))*(1+a*cos(n*theta)) smoke weed every day
      var resolution = 32
      var r = Math.random()*0.4 + 0.1
      var a = Math.random()
      var b = 0.5+Math.random()/2
      var n = Math.floor(Math.random()*10)

      // var stem = new THREE.LineCurve(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0))
      this.prototypeLeafGeometry = new THREE.Geometry()
      var geometry = new THREE.CircleGeometry(r,resolution)
      for(var i = 0; i < resolution+1; i++){
        geometry.vertices[i+1].multiplyScalar(
          this.scale*(1+b*Math.sin(2*Math.PI*(i/resolution)))*(1+a*Math.cos(n*2*Math.PI*(i/resolution)))
        )
      }
      geometry.translate(0,1,0)
      this.prototypeLeafGeometry.merge(geometry)
  }



}

function leafVertShader() {
  return `
    uniform float redScale;
    uniform float blueScale;
    uniform float greenScale;
    varying vec3 vNormal;

    void main() {
      vNormal = normalMatrix * normalize(normal);;

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
      varying vec3 vNormal;

      void main() {
        vec3 view_nv  = normalize(vNormal);
        vec3 nv_color = view_nv * 0.5 + 0.5;
        vec3 nv_color_scaled = vec3(nv_color.x*redScale, nv_color.y*greenScale, nv_color.z*blueScale);
        gl_FragColor  = vec4(nv_color_scaled, 1.0);


      }
  `
}



export default Leaf
