import THREE from 'three'

class StretchyTube extends THREE.TubeGeometry {
  constructor (path,tubularSegments,radius,radialSegments,closed) {
    super(path,tubularSegments,radius,radialSegments,closed)
  }

  stretch(f){
    
  }

}

export default StretchyTube
