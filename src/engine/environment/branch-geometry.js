import THREE from 'three'

class BranchGeometry extends THREE.TubeGeometry {
  constructor (curve,numSegments,bottomThickness,topThickness,radialSegments,openBool) {
    super(curve,numSegments,bottomThickness,radialSegments,openBool)

    var j = 0
    var center = new THREE.Vector3(0,0,0)
    var offset = new THREE.Vector3(0,0,0)
    var index = 0
    var scale = 1
    for(var i = 1; i<numSegments+1; i++){
      center.set(0,0,0)
      scale = (topThickness-bottomThickness)*(i+1)/(numSegments+1)
      for(j = 0; j<radialSegments; j++){
        index = i*radialSegments + j
        center.add(this.vertices[index])
      }
      center.multiplyScalar(1/radialSegments)
      for(j = 0; j<radialSegments; j++){
        index = i*radialSegments + j
        offset.copy(this.vertices[index])
        offset.sub(center)
        this.vertices[index].addScaledVector(offset,scale)
        // this.vertices[index].copy(center)
        console.log(scale)
      }
    }

    this.verticesNeedUpdate = true
  }

}

export default BranchGeometry
