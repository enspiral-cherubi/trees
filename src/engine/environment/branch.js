import THREE from 'three'
import Leaf from './leaf.js'

class Branch {
  constructor(curves, level){

    var numCurves = curves.length

    this.geometry = new THREE.CylinderGeometry(
      0.2/(level+1),                       // radiusTop
      0.2/level,                       // radiusBottom
      numCurves+1,           // height
      8,                       // radiusbranchCurve
      numCurves, // heightbranchCurve
      true                     // openEnded
    )

    for ( var i = 0; i < this.geometry.vertices.length; i ++ ) {

      var vertex = this.geometry.vertices[ i ]
      var y = ( vertex.y + numCurves/2 )

      var skinIndex = Math.floor( 2*y / numCurves )
      var skinWeight = ( y % numCurves ) / numCurves

      this.geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) )
      this.geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) )

    }

        var bones = []
        var prevBone = new THREE.Bone()
        bones.push( prevBone )
        prevBone.position.y = - numCurves/2

        for ( var i = 0; i < numCurves; i ++ ) {

          var bone = new THREE.Bone()
          bone.position.y = numCurves
          bones.push( bone )
          prevBone.add( bone )
          prevBone = bone

        }


        var material = new THREE.MeshPhongMaterial( {
                  skinning : true,
                  color: 0x156289,
                  emissive: 0x072534,
                  side: THREE.DoubleSide
                } )

        // this.mesh = new THREE.SkinnedMesh( geometry,	material )
        this.mesh = new THREE.Mesh(this.geometry,THREE.MeshNormalMaterial)
        this.skeleton = new THREE.Skeleton( bones )

        this.mesh.add( bones[ 0 ] )

        this.mesh.bind( this.skeleton );

        // this.skeletonHelper = new THREE.SkeletonHelper( this.mesh );
        // this.skeletonHelper.material.linewidth = 2;

        // bones[0].position.copy(branchCurve.curves[0].v1)
        // for(i = 1; i < numCurves; i++){
        //   var displacement = branchCurve.curves[i].v1.clone()
        //   displacement.sub(branchCurve.curves[i-1].v1)
        //   bones[i].position.copy(displacement)
        // }


  }
}

export default Branch
