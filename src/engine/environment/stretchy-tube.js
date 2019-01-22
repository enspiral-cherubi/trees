import THREE from 'three'

class StretchyTube extends THREE.TubeGeometry {
  constructor (path,tubularSegments,initRadius,finalRadius,radialSegments,closed) {
    super(path,tubularSegments,initRadius,radialSegments,closed)
    this.path = path
    this.initRadius = initRadius
    this.finalRadius = finalRadius
    this.tubularSegments = tubularSegments
    this.radialSegments = radialSegments

    var f = (t) => t*(finalRadius-initRadius)

    this.fatten(f)

    this.displacement = new THREE.Vector3(0,0,0)
  }

  fatten(f){
    var point = new THREE.Vector3(0,0,0)
    var displacement = new THREE.Vector3(0,0,0)
    var t = 0
    for(var i = 0; i<this.tubularSegments+1;i++){
      t = i/this.tubularSegments
      point.copy(this.path.getPoint(t))
      for(var j = 0; j<this.radialSegments; j++){
        displacement.copy(this.vertices[i*this.radialSegments+j])
        displacement.sub(point)
        this.vertices[i*this.radialSegments+j].addScaledVector(displacement,f(t))
      }
    }
    this.verticesNeedUpdate = true
  }

  stretch(f){
    var displacement = new THREE.Vector3(0,0,0)
    var t = 0
    for(var i = 1; i<this.tubularSegments+1; i++){
      t = i/this.tubularSegments
      displacement.addScaledVector(this.path.getPoint(t),f)
      for(var j = 0; j<this.radialSegments; j++){
        this.vertices[i*this.radialSegments+j].add(displacement)
      }
    }
    this.verticesNeedUpdate = true

    this.displacement = displacement

    var g = (t) => (this.initRadius-this.finalRadius)*f

    this.fatten(g)

    this.initRadius += this.initRadius*f
    this.finalRadius += this.finalRadius*f

  }

}

export default StretchyTube
