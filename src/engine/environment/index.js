import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
var OrbitControls = ThreeOrbitControls(THREE)
import WindowResize from 'three-window-resize'
import LSystem from './l-system.js'
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

    this.drawForest(5,4)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  drawForest(n,N) {
    for(var i=-N/2;i<N/2;i++){
      for(var j =-N/2; j<N/2; j++){
        var newTree = this.drawTree(n,0.1)
        newTree.geometry.translate(10*i,-10*i,10*j)
        var material = new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors})
        var mesh = new THREE.Mesh(newTree.geometry,material)
        this.scene.add(mesh)
      }
    }

  }

  drawTree (n) {
    return new LSystem(n,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)',Math.PI/5,Math.PI/5)
    // console.log(colors)
  }


}

export default Environment
