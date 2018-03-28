import THREE from 'three'
import Leaf from './leaf.js'
import LDNA from './l-dna.js'


class LSystem {
  constructor (n,rule,angle,wobble,scale) {
    this.DNA = new LDNA(n,rule)
    this.scale = scale || 2
    this.string = this.DNA.instructions
    this.leaves = []
    this.protoLeaf = new Leaf()
    this.prototypeLeafGeometry = this.protoLeaf.geometry
    this.generateGeometry(angle,wobble)
  }


  generateGeometry(angle,wobble) {
    var position = new THREE.Vector3(0,0,0)
    var direction = new THREE.Vector3(0,0.1,0)
    var velocity = 0.5*this.scale
    var axis = new THREE.Vector3(0,0,1)
    var axis2 = new THREE.Vector3(0,1,0)
    var axis3 = new THREE.Vector3(1,0,0)
    var savedPositions = []
    var savedDirections = []
    var level = 1
    var skeletonPieces = []

    var symbol = ''
    for (i = 0; i < this.string.length; i++){
      symbol = this.string.charAt(i)
      if (symbol === 'F'){
        var numFs = 1
        symbol = this.string.charAt(i+1)
        while (symbol === 'F'){
          numFs++
          i++
          symbol = this.string.charAt(i+1)
        }
        //draw forward
        var newPosition = new THREE.Vector3()
        newPosition.copy(position)
        newPosition.addScaledVector(direction,velocity*numFs)
        var segment = new THREE.LineCurve(position,newPosition)
        segment.leaves = []
        segment.level = level
        skeletonPieces.push(segment)
        position = newPosition
      }
      else if (symbol === 'L'){
        if (Math.random()>2/level){
          var leaf = new Leaf(position,direction,this.prototypeLeafGeometry)
          this.leaves.push(leaf.geometry)
          skeletonPieces[skeletonPieces.length-1].leaves.push(leaf.geometry)
        }
      }
      else if (symbol === '-'){
        //turn left
        direction.applyAxisAngle(axis,-angle)
      }
      else if (symbol === '+'){
        //turn right
        direction.applyAxisAngle(axis,angle)
      }
      else if (symbol === '['){
        //save position and angle
        level+=1
        var savedPosition = new THREE.Vector3()
        savedPosition.copy(position)
        savedPositions.push(savedPosition)
        var savedDirection = new THREE.Vector3()
        savedDirection.copy(direction)
        savedDirections.push(savedDirection)
      }
      else if (symbol === ']'){
        //draw leaf
        //recall position and angle
        level-=1
        position = savedPositions.pop()
        direction = savedDirections.pop()
        axis.applyAxisAngle(axis2,wobble)
        axis.applyAxisAngle(axis3,wobble)
      }
    }

    //now build tree structure by level
    var depthFirstSkeletonGeometry = new THREE.Geometry()
    var branches = []
    var leafClusters = []
    var length = 0
    i = 0
    console.log(skeletonPieces.length)
    var lastLevel = 1
    var lastBranchPaths = []
    var components = 0
    while(i < skeletonPieces.length){
        length = 0
        var leafCluster = new THREE.Geometry()
        var branchPath = new THREE.CurvePath()
        branchPath.leaves = []

        level = skeletonPieces[i].level

        while(i<skeletonPieces.length && skeletonPieces[i].level === level){
          branchPath.add(skeletonPieces[i])
          skeletonPieces[i].leaves.forEach((leaf) => {
            leafCluster.merge(leaf)
          })
          length++
          i++
        }
        branchPath.length = length
        branchPath.level = level

        if(level === 1){
          //can happen several times if tree is reducible
          components += 1
          if(components === 1){
            //only happens once
            this.trunkPath = branchPath
          }
          branchPath.children = []
          if(components > 1){
            lastBranchPaths[lastBranchPaths.length-1].children.push(branchPath)
          }
          lastBranchPaths.push(branchPath)
        }
        if(level > lastLevel){
          //encountered [, stepping up the tree
          branchPath.children = []
          lastBranchPaths[lastBranchPaths.length-1].children.push(branchPath)
          lastBranchPaths.push(branchPath)
          lastLevel+=1
        }
        if(level < lastLevel){
          //encountered ], stepping down the tree
          branchPath.children = []
          while(level <= lastLevel){
            lastBranchPaths.pop()
            lastLevel -= 1
          }
          lastBranchPaths[lastBranchPaths.length-1].children.push(branchPath)
          lastBranchPaths.push(branchPath)
        }

        branches.push(new THREE.TubeGeometry(
          branchPath,
          length, //segments
          this.scale*0.2/level, //radius
          12, //radius segments
          false //closed
        ))
        leafClusters.push(leafCluster)
        // depthFirstSkeletonGeometry.merge(new THREE.TubeGeometry(
        //   branchPath,
        //   length, //segments
        //   this.scale*0.2/level, //radius
        //   12, //radius segments
        //   false //closed
        // ))

    }

    // depthFirstSkeletonGeometry.translate(10,0,0)
    var skeletonGeometry = depthFirstSkeletonGeometry
    // var skeletonGeometry = this.generateBreadthFirstGeometry(this.trunkPath)

    //add color
    var numFaces = skeletonGeometry.faces.length
    for (var i = 0; i < numFaces; i++){
      // var hue = parseInt(i/numFaces)
      var hue = i/numFaces
      var saturation = 1
      var color = new THREE.Color()
      color.setHSL(hue,saturation,0.5)
      skeletonGeometry.faces[i].color = color
    }
    skeletonGeometry.colorsNeedUpdate = true
    this.skeletonGeometry = skeletonGeometry
    // this.leafGeometry = leafGeometry
    console.log(this.trunkPath)

  }

generateBreadthFirstGeometry(path){
  var pathGeometry = new THREE.TubeGeometry(
    path,
    path.length, //segments
    this.scale*0.2/path.level, //radius
    12, //radius segments
    false //closed
  )
  path.children.forEach((p) => {
    pathGeometry.merge(this.generateBreadthFirstGeometry(p))
  })
  return pathGeometry
}

}

export default LSystem
