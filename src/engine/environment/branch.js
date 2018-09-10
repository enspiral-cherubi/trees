import THREE from 'three'
import Leaf from './leaf.js'

class Branch {
  constructor(curves, level){

    var numCurves = curves.length

    this.geometry = new THREE.CylinderGeometry(
      0.2/(level+1),                       // radiusTop
      0.2/level,                       // radiusBottom
      numCurves,           // height
      8,                       // radiusbranchCurve
      numCurves, // heightbranchCurve
      true                     // openEnded
    )

    this.mesh = new THREE.SkinnedMesh(this.geometry)


    for ( var i = 0; i < this.geometry.vertices.length; i ++ ) {

      var vertex = this.geometry.vertices[ i ]
      var y = ( vertex.y + numCurves/2 )

      var skinIndex = Math.floor( y / numCurves )
      console.log(skinIndex)
      // var skinWeight = ( y % numCurves ) / numCurves

      this.geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, skinIndex - 1, 0 ) )
      this.geometry.skinWeights.push( new THREE.Vector4( 1, 0.5, 0.5, 0 ) )

    }

    var bones = []
    for(var i = 0; i<numCurves+1; i++){
      var bone = new THREE.Bone()
      bone.position.y = i-numCurves/2
      bones.push(bone)
      if(i>0){
        bones[i-1].add(bone)
      }
    }

        // this.mesh = new THREE.SkinnedMesh( this.geometry,	material )
        this.skeleton = new THREE.Skeleton( bones )

        this.mesh.material.skinning = true

        this.mesh.add( bones[ 0 ] )

        this.mesh.bind( this.skeleton );

        // this.skeletonHelper = new THREE.SkeletonHelper( this.mesh );
        // this.skeletonHelper.material.linewidth = 2;


        // this.mesh.geometry.verticesNeedUpdate = true

        // bones[0].position.copy(branchCurve.curves[0].v1)
        // for(i = 1; i < numCurves; i++){
        //   var displacement = branchCurve.curves[i].v1.clone()
        //   displacement.sub(branchCurve.curves[i-1].v1)
        //   bones[i].position.copy(displacement)
        // }
  }
}

export default Branch
