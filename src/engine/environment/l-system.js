import THREE from 'three'
import Leaf from './leaf.js'


class LSystem {
  constructor (n,rule,angle,wobble,scale) {
    if (rule === 'random') {
      this.rule = this.generateRule()
    } else {
      this.rule = rule
    }
    this.scale = scale || 2
    this.string = this.generateString(n,this.rule)
    this.tree = this.generateTree(this.string)
    this.leaves = []
    this.generateLeafGeometry()
    this.generateGeometry(angle,wobble)
  }

  generateTree(string) {
    //geometric constants
    var angle = Math.PI/5
    var wobble = Math.PI/5
    var resolution = 32
    var r = Math.random()*0.4 + 0.1
    var a = Math.random()
    var b = 0.5+Math.random()/2
    var n = Math.floor(Math.random()*10)
    var position = new THREE.Vector3(0,0,0)
    var direction = new THREE.Vector3(0,0.1,0)
    var velocity = 0.5*this.scale
    var axis = new THREE.Vector3(0,0,1)
    var axis2 = new THREE.Vector3(0,1,0)
    var axis3 = new THREE.Vector3(1,0,0)

    var numFs = 0
    var startDirection = direction.clone()
    var startPosition = position.clone()
    var levels = []
    var level = 0
    var stringBit = ''
    for(var i = 0; i < string.length; i++){
      var symbol = string.charAt(i)
        if(symbol === '['){
          if(levels.length === level){
            levels.push([])
          }
          if (numFs > 0){
            levels[level].push({string:stringBit, startPosition:startPosition.clone(), startDirection:startDirection.clone()})
          }
          stringBit = ''
          startPosition.copy(position)
          startDirection.copy(direction)
          level += 1
          numFs = 0
        } else if (symbol === ']'){
          if(levels.length === level){
            levels.push([])
          }
          if (numFs > 0){
            levels[level].push({string:stringBit, startPosition:startPosition.clone(), startDirection:startDirection.clone()})
          }
          stringBit = ''
          startPosition.copy(position)
          startDirection.copy(direction)
          level -= 1
          numFs = 0
        } else if (symbol === '+'){
          direction.applyAxisAngle(axis,angle)
          stringBit += symbol
        } else if (symbol === '-'){
          direction.applyAxisAngle(axis,angle)
          stringBit += symbol
        } else if (symbol === 'F') {
          position.addScaledVector(direction,velocity)
          stringBit += symbol
          numFs += 1
        } else if (symbol === 'L') {
          stringBit += symbol
        }
    }
    if (numFs > 0){
      levels[level].push({string:stringBit, startPosition:startPosition.clone(), startDirection:startDirection.clone()})
    }
    stringBit = ''
    startPosition.copy(position)
    startDirection.copy(direction)
    level -= 1
    numFs = 0
    console.log(levels)
    return levels
  }

  generateRule () {
    var rule = 'FFF[X'
    var numLeftBrackets = 1
    var numX = 2
    var numSymbols = 0
    while(true){
      var r = Math.random()
      if (r<0.2){
        rule += '[F'
        numLeftBrackets += 1
        numX +=1
      } else if (r<0.3 && numX<5) {
        rule += 'X'
        numX += 1
      } else if (r<0.50) {
        rule += 'F'
      } else if (r<0.65) {
        rule += '+F'
      } else if (r<0.8) {
        rule += '-F'
      } else if (numLeftBrackets>0) {
        rule += 'XL]'
        if(r<0.9){
          rule += '+'
        } else {
          rule += '-'
        }
        numLeftBrackets -= 1
        if (numSymbols>20){
          break
        }
      }
      numSymbols +=1
    }
    while(numLeftBrackets > 0){
      rule += '+FL]'
      numLeftBrackets -= 1
    }
    console.log(rule)
    return rule
  }

  generateString (n,rule) {
    var string = 'X'
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      // string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
      // string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)') //nice with 3d hack
      string = string.replace(/X/g,rule) //nice with 3d hack
      string = string.replace(/F/g,'FF') //whoa
    }
    string.replace(/X/g,'') //don't factor into final draw instructions
    return string
  }


  generateLeafGeometry() {
      //r(theta) = (1+ b*sin(theta))*(1+a*cos(n*theta)) smoke weed every day
      var resolution = 32
      var r = Math.random()*0.4 + 0.1
      var a = Math.random()
      var b = 0.5+Math.random()/2
      var n = Math.floor(Math.random()*10)

      // var stem = new THREE.LineCurve(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0))
      this.prototypeLeafGeometry = new THREE.Geometry()
      var geometry = new THREE.CircleGeometry(r,resolution)
      for(var i = 0; i < resolution+1; i++){
        geometry.vertices[i+1].multiplyScalar(
          this.scale*(1+b*Math.sin(2*Math.PI*(i/resolution)))*(1+a*Math.cos(n*2*Math.PI*(i/resolution)))
        )
      }
      geometry.translate(0,1,0)
      this.prototypeLeafGeometry.merge(geometry)
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
    var skeletonGeometry = new THREE.Geometry()

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
        segment.level = level
        skeletonPieces.push(segment)
        position = newPosition
      }
      else if (symbol === 'L'){
        if (Math.random()>2/level){
          var leaf = new Leaf(position,direction,this.prototypeLeafGeometry)
          this.leaves.push(leaf.geometry)
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

    //now build by level
    var length = 0
    i = 0
    console.log(skeletonPieces.length)
    while(i < skeletonPieces.length){
        length = 0
        var branchPath = new THREE.CurvePath()

        level = skeletonPieces[i].level

        while(i<skeletonPieces.length && skeletonPieces[i].level === level){
          branchPath.add(skeletonPieces[i])
          length++
          i++
        }

        skeletonGeometry.merge(new THREE.TubeGeometry(branchPath,
          length, //segments
          this.scale*0.2/level, //radius
          12, //radius segments
          false //closed
        ))

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
    // this.leafGeometry = leafGeometry
  }

}

export default LSystem
