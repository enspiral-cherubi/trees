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

    this._addCubeToScene()
  }

  render () {
    this._updateCube()
    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  _drawTree (n) {

    //create sentences
    var string = 'X'
    var strings = [string]
    for (var i = 0; i < n; i++){
      //these rules encode the grammar
      string = string.replace('X','F−[[X]+X]+F[+FX]−X)')
      string = string.replace('F','FF')
      strings.push(string)
    }
    console.log(strings)
    //render tree
    // var direction = new THREE.Vector3(1,1,1)
    // for (i = 0; i < n; i++){
    //
    // }
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
