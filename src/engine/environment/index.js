import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
var OrbitControls = ThreeOrbitControls(THREE)
// var flyControls = require('three-fly-controls')(THREE)
import WindowResize from 'three-window-resize'
import LSystem from './l-system.js'
var Color = require("color")


class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 5

    this.controls = new OrbitControls(this.camera)
    // this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement, { movementSpeed: 0.01 })

    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    var windowResize = new WindowResize(this.renderer, this.camera)
    //
    // var firstTreePosition = new THREE.Vector3(0,0,0)
    // var secondTreePosition = new THREE.Vector3(4,4,0)
    // this._drawTree(6,firstTreePosition)
    // this._drawTree(6,secondTreePosition)

    this.trees = this.drawForest(5,5)
    // this.separateTrees(4)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  // 'private'

  separate (X, Y) {
    X.vertices.forEach((v) => {
      Y.vertices.forEach((w) => {
        if (v.distanceTo(w)<2){
          var u = new THREE.Vector3(0,0,0)
          u.add(v)
          u.sub(w)
          v.addScaledVector(u,1)
        }
      })
    })
  }

  separateTrees (N) {
    for(var i = 0; i<N-1; i++){
      for(var j = 0; j<N-1; j++){
        this.separate(this.trees[i][j].geometry,this.trees[i][j+1].geometry)
        this.separate(this.trees[i][j].geometry,this.trees[i+1][j].geometry)
      }
    }
  }

  drawForest(n,N) {
    var trees = []
    for(var i=-N/2;i<N/2;i++){
      trees.push([])
      for(var j =-N/2; j<N/2; j++){
        var newTree = this.drawTree(n,0.1)
        newTree.geometry.translate(5*i,-5*i,5*j)
        var material = new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors})
        var mesh = new THREE.Mesh(newTree.geometry,material)
        this.scene.add(mesh)
        trees[i+N/2].push(newTree)
      }
    }
    return trees

  }

  drawTree (n) {
    // return new LSystem(n,'F-[[X]+X]+F[+F[F+X-[X+]]]-X',Math.PI/5,Math.PI/5)
    // return new LSystem(n,'F-[[X]+X]+F[+F[F+X-]-]',Math.PI/5,Math.PI/5)
    // return new LSystem(n,'F-[[X]+X]-F[+[X+FX-]-]',Math.PI/5,Math.PI/5) // good idea to balance # of +s with -s
    return new LSystem(n,'random',Math.PI/5,Math.PI/5)
  }


}

export default Environment
