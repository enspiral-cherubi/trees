import THREE from 'three'

class LSystem {
  constructor (n,rule,p,angle,wobble) {
    this.string = this.generateString(n,rule,p)
    this.geometry = this.generateGeometry(angle,wobble)
  }

  generateString (n,rule,p) {
    var string = 'X'
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      // string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
      // string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)') //nice with 3d hack
      string = string.replace(/X/g,rule) //nice with 3d hack
      var r = Math.random()
      if (r>p){
        string = string.replace(/F/g,'FF')
      } else {
        string = string.replace(/F/g,'F+F')
      }
    }
    return string
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
    var geometry = new THREE.Geometry()
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
        geometry.merge(segmentGeometry)

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
        //recall position and angle
        position = savedPositions.pop()
        direction = savedDirections.pop()
        axis.applyAxisAngle(axis2,wobble)
        axis.applyAxisAngle(axis3,wobble)
      }
    }

    //add color
    var numFaces = geometry.faces.length
    for (var i = 0; i < numFaces; i++){
      // var hue = parseInt(i/numFaces)
      var hue = i/numFaces
      var saturation = 1
      var color = new THREE.Color()
      color.setHSL(hue,saturation,0.5)
      geometry.faces[i].color = color
    }
    geometry.colorsNeedUpdate = true
    return geometry
  }
}

export default LSystem
