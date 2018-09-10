import THREE from 'three'
import Leaf from './leaf.js'
var smoothness = 3

class Branch {
  constructor(points, level){

    var numPoints = points.length

    this.curve = new THREE.CatmullRomCurve3(points)

    this.geometry = new THREE.TubeGeometry(
      this.curve,
      smoothness*numPoints,
      0.2/(level),
      8,
      false
    )

    this.mesh = new THREE.SkinnedMesh(this.geometry)


    for ( var i = 0; i < this.geometry.vertices.length; i ++ ) {

      var vertex = this.geometry.vertices[ i ]

      var skinIndex = Math.floor(i/(8*smoothness))
      // var skinWeight = ( y % numCurves ) / numCurves

      this.geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, skinIndex - 1, 0 ) )
      this.geometry.skinWeights.push( new THREE.Vector4( 0.6, 0.2, 0.2, 0 ) )

    }

    var bones = []
    for(var i = 0; i<numPoints; i++){
      var bone = new THREE.Bone()
      bones.push(bone)
      if(i>0){
        bones[i-1].add(bone)
      }
    }
    for(var i = 1; i<numPoints; i++){
      bones[i].position.x = points[i].x
      bones[i].position.y = points[i].y
      bones[i].position.z = points[i].z
    }


    this.skeleton = new THREE.Skeleton( bones )

    this.mesh.material.skinning = true

    this.mesh.add( bones[ 0 ] )

    this.mesh.bind( this.skeleton );


  }
}

export default Branch
