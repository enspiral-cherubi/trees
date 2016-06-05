import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
var OrbitControls = ThreeOrbitControls(THREE)
import WindowResize from 'three-window-resize'

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

    this._drawTree(5)

    // this._addCubeToScene()
  }

  render () {
    // this._updateCube()
    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  _drawTree (n) {

    //create sentences
    var string = 'X'
    var strings = [string]
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
      string = string.replace(/F/g,'FF')
      strings.push(string)
    }
    console.log(string)
    //render tree
    var position = new THREE.Vector3(0,0,0)
    var direction = new THREE.Vector3(0.1,0.1,0)
    var velocity = 0.5
    var axis = new THREE.Vector3(0,0,1)
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
        geometry.vertices.push(position)
        var newPosition = new THREE.Vector3()
        newPosition.addVectors(position,direction)
        geometry.vertices.push(newPosition)


        position = newPosition
      }
      if (symbol === '-'){
        //turn left
        direction.applyAxisAngle(axis,-Math.PI/10)
      }
      if (symbol === '+'){
        //turn right
        direction.applyAxisAngle(axis,Math.PI/10)
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
      }
    }

    // geometry.normalize()
    var material = new THREE.LineBasicMaterial({color: 0})
    var mesh = new THREE.Line(geometry,material)
    this.scene.add(mesh)

  }

  _addCubeToScene () {
    var geometry = new THREE.BoxGeometry(1, 1, 1)
  	var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  	this.cube = new THREE.Mesh(geometry, material)
  	this.scene.add(this.cube)
  }

  _updateCube () {
    this.cube.rotation.x += 0.1
		this.cube.rotation.y += 0.1
  }

}

export default Environment
