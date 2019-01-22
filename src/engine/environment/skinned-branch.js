import THREE from 'three'
import Leaf from './leaf.js'
import BranchGeometry from './branch-geometry.js'
var smoothness = 3

class Branch {
  constructor(points, initialWidth, finalWidth, numSegments){

    var numPoints = points.length

    this.curve = new THREE.CatmullRomCurve3(points)

    this.geometry = new BranchGeometry(
      this.curve,
      smoothness*numPoints,
      initialWidth,
      finalWidth,
      numSegments,
      false
    )

    var material = new THREE.MeshLambertMaterial({skinning: true})
    this.mesh = new THREE.SkinnedMesh(this.geometry,material)


    for ( var i = 0; i < this.geometry.vertices.length; i ++ ) {

      var vertex = this.geometry.vertices[ i ]

      var skinIndex = Math.floor(i/(8*smoothness))
      // var skinWeight = ( y % numCurves ) / numCurves

      this.geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, skinIndex - 1, skinIndex + 2 ) )
      this.geometry.skinWeights.push( new THREE.Vector4( 0.6, 0.4, 0.4, 0.2 ) )

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
