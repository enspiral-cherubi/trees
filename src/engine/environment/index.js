import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
var OrbitControls = ThreeOrbitControls(THREE)
import WindowResize from 'three-window-resize'
var Color = require("color")


class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 5

    this.controls = new OrbitControls(this.camera)

    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    var windowResize = new WindowResize(this.renderer, this.camera)
    //
    // var firstTreePosition = new THREE.Vector3(0,0,0)
    // var secondTreePosition = new THREE.Vector3(4,4,0)
    // this._drawTree(6,firstTreePosition)
    // this._drawTree(6,secondTreePosition)
    this._drawTree(5)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  _drawTree (n) {

    //create sentences
    var string = 'X'
    var strings = [string]
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      // string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
      // string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)') //nice with 3d hack
      string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X--[X-X]]]-X)') //nice with 3d hack
      string = string.replace(/F/g,'FF')
      strings.push(string)
    }
    console.log(string)
    //render tree
    var position = new THREE.Vector3(0,0,0)
    var direction = new THREE.Vector3(0.1,0.1,0)
    var velocity = 0.5
    var axis = new THREE.Vector3(0,0,1)
    var axis2 = new THREE.Vector3(0,1,0)
    var axis3 = new THREE.Vector3(1,0,0)
    var savedPositions = []
    var savedDirections = []
    var geometry = new THREE.Geometry()
    for (i = 0; i < string.length; i++){
      var symbol = string.charAt(i)
      if (symbol === 'F'){
        //draw forward
        var newPosition = new THREE.Vector3()
        newPosition.copy(position)
        newPosition.addScaledVector(direction,velocity)

        var segment = new THREE.LineCurve(position,newPosition)
        var segmentGeometry = new THREE.TubeGeometry(segment,
          1, //segments
          0.1, //radius
          5, //radius segments
          false //closed
        )
        geometry.merge(segmentGeometry)


        geometry.vertices.push(position)
        var newPosition = new THREE.Vector3()
        newPosition.addVectors(position,direction)



        geometry.vertices.push(newPosition)


        position = newPosition
      }
      if (symbol === '-'){
        //turn left
        direction.applyAxisAngle(axis,-Math.PI/5)
      }
      if (symbol === '+'){
        //turn right
        direction.applyAxisAngle(axis,Math.PI/5)
      }
      if (symbol === '['){
        //save position and angle
        var savedPosition = new THREE.Vector3()
        savedPosition.copy(position)
        savedPositions.push(savedPosition)
        var savedDirection = new THREE.Vector3()
        savedDirection.copy(direction)
        savedDirections.push(savedDirection)
      }
      if (symbol === ']'){
        //recall position and angle
        position = savedPositions.pop()
        direction = savedDirections.pop()
        axis.applyAxisAngle(axis2,Math.PI/10)
        axis.applyAxisAngle(axis3,Math.PI/10)
      }
    }

    //add color
    // var numVertices = geometry.vertices.length
    // var colors = []
    // for (var i = 0; i < numVertices; i++){
    //   var hue = parseInt(100*i/numVertices)
    //   var saturation = 100
    //   var hsv = Color().hsv(hue, saturation, 100)
    //   colors.push(hsv.hexString())
    // }
    // colors.map(parseInt)
    // geometry.colors = colors
    // geometry.colorsNeedUpdate = true
    // geometry.normalize()
    var material = new THREE.MeshNormalMaterial()
    var mesh = new THREE.Mesh(geometry,material)
    this.scene.add(mesh)
    // console.log(colors)
  }


}

export default Environment
