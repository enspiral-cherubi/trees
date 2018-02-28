import THREE from 'three'
import Leaf from './leaf.js'


class LSystem {
  constructor (n,rule,angle,wobble) {
    if (rule === 'random') {
      this.rule = this.generateRule()
    } else {
      this.rule = rule
    }
    this.string = this.generateString(n,this.rule)
    this.generateLeafGeometry()
    this.generateGeometry(angle,wobble)
  }

  generateRule () {
    var rule = ''
    var numLeftBrackets = 0
    for(var j = 0; j<20; j++){
      var r = Math.random()
      if (r<0.2){
        rule += '['
        numLeftBrackets += 1
      } else if (r<0.4) {
        rule += 'X'
      } else if (r<0.6) {
        rule += 'F'
      } else if (r<0.7) {
        rule += '+'
      } else if (r<0.8) {
        rule += '-'
      } else if (numLeftBrackets>0) {
        rule += ']'
        numLeftBrackets -= 1
      }
    }
    while(numLeftBrackets > 0){
      rule += ']'
      numLeftBrackets -= 1
    }
    return rule
  }

  generateString (n,rule) {
    var string = 'X'
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      // string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
      // string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)') //nice with 3d hack
      string = string.replace(/X/g,rule) //nice with 3d hack
      string = string.replace(/F/g,'FF')
    }
    return string
  }


    generateLeafGeometry() {
      //r(theta) = (1+ b*sin(theta))*(1+a*cos(n*theta)) smoke weed every day
      var resolution = 32
      var r = Math.random()*0.4
      var a = Math.random()
      var b = 0.5+Math.random()/2
      var n = Math.floor(Math.random()*10)
      var geometry = new THREE.CircleGeometry(r,resolution)
      for(var i = 0; i < resolution+1; i++){
        geometry.vertices[i+1].multiplyScalar(
          (1+b*Math.sin(2*Math.PI*(i/resolution)))*(1+a*Math.cos(n*2*Math.PI*(i/resolution)))
        )
      }
      this.prototypeLeafGeometry = geometry
    }

  generateGeometry(angle,wobble) {
    var position = new THREE.Vector3(0,0,0)
    var direction = new THREE.Vector3(0.1,0.1,0)
    var velocity = 0.5
    var axis = new THREE.Vector3(0,0,1)
    var axis2 = new THREE.Vector3(0,1,0)
    var axis3 = new THREE.Vector3(1,0,0)
    var savedPositions = []
    var savedDirections = []
    var skeletonGeometry = new THREE.Geometry()
    var leafGeometry = new THREE.Geometry()

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
        var segmentGeometry = new THREE.TubeGeometry(segment,
          2, //segments
          0.1, //radius
          5, //radius segments
          false //closed
        )
        skeletonGeometry.merge(segmentGeometry)

        position = newPosition
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
        var savedPosition = new THREE.Vector3()
        savedPosition.copy(position)
        savedPositions.push(savedPosition)
        var savedDirection = new THREE.Vector3()
        savedDirection.copy(direction)
        savedDirections.push(savedDirection)
      }
      else if (symbol === ']'){
        //draw leaf
        var leaf = new Leaf(position,direction,this.prototypeLeafGeometry)
        leafGeometry.merge(leaf.geometry)
        //recall position and angle
        position = savedPositions.pop()
        direction = savedDirections.pop()
        axis.applyAxisAngle(axis2,wobble)
        axis.applyAxisAngle(axis3,wobble)
      }
    }

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
    this.leafGeometry = leafGeometry
  }
}

export default LSystem
