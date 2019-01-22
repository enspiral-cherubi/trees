import THREE from 'three'

class StretchyTube extends THREE.TubeGeometry {
  constructor (path,tubularSegments,initRadius,finalRadius,radialSegments,closed) {
    super(path,tubularSegments,initRadius,radialSegments,closed)
    this.path = path
    this.initRadius = initRadius
    this.finalRadius = finalRadius


    var point = new THREE.Vector3(0,0,0)
    var displacement = new THREE.Vector3(0,0,0)
    var t = 0
    for(var i = 0; i<tubularSegments+1;i++){
      t = i/tubularSegments
      point.copy(path.getPoint(t))
      for(var j = 0; j<radialSegments; j++){
        displacement.copy(this.vertices[i*radialSegments+j])
        displacement.sub(point)
        this.vertices[i*radialSegments+j].addScaledVector(displacement,t*(finalRadius-initRadius))
      }
    }
    this.verticesNeedUpdate = true
  }

  stretch(f){

  }

}

export default StretchyTube
