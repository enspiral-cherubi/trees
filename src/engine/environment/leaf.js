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
    this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide})
    this.mesh = new THREE.Mesh(this.geometry,this.material)
  }

}

export default Leaf
