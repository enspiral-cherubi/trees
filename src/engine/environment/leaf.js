import THREE from 'three'

class Leaf {
  constructor (location,direction,leafGeometry) {
    if(leafGeometry){
      this.geometry = leafGeometry.clone()
    } else {
      this.generateLeafGeometry()
    }


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
    this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
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
      this.geometry = new THREE.Geometry()
      var leafGeometry = new THREE.CircleGeometry(r,resolution)
      for(var i = 0; i < resolution+1; i++){
        leafGeometry.vertices[i+1].multiplyScalar(
          2*(1+b*Math.sin(2*Math.PI*(i/resolution)))*(1+a*Math.cos(n*2*Math.PI*(i/resolution)))
        )
      }
      leafGeometry.translate(0,1,0)
      this.geometry.merge(leafGeometry)

    }
}
export default Leaf
