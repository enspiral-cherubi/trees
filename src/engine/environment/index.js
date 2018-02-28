import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
import ThreeFlyControls from 'three-fly-controls'
var OrbitControls = ThreeOrbitControls(THREE)
var FlyControls = ThreeFlyControls(THREE)
import WindowResize from 'three-window-resize'
import LSystem from './l-system.js'
import Leaf from './leaf.js'
var Color = require("color")


class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)
    this.camera.position.z = 5

    // this.controls = new OrbitControls(this.camera)

    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 1)

    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.1


    var windowResize = new WindowResize(this.renderer, this.camera)
    //
    // var firstTreePosition = new THREE.Vector3(0,0,0)
    // var secondTreePosition = new THREE.Vector3(4,4,0)
    // this._drawTree(6,firstTreePosition)
    // this._drawTree(6,secondTreePosition)
    // var leaf = new Leaf()
    // this.scene.add(leaf.mesh)
    this.trees = this.drawForest(5,1)
    // this.separateTrees(4)
    this.rustle = 0
  }

  render () {


    this.renderer.render(this.scene, this.camera)
    this.trees.forEach((treeRow) => {
      treeRow.forEach((tree) => {
        tree.leafGeometry.vertices.forEach((vertex) => {
          vertex.add(new THREE.Vector3(
            (0.5-Math.random())*this.rustle,
            (0.5-Math.random())*this.rustle,
            (0.5-Math.random())*this.rustle
          ))
        })
        tree.leafGeometry.verticesNeedUpdate = true
      })
    })
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
        newTree.skeletonGeometry.translate(5*i,-5*i,5*j)
        newTree.leafGeometry.translate(5*i,-5*i,5*j)
        // var skeletonMaterial = new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors})
        var skeletonMaterial = new THREE.MeshBasicMaterial({color:0x91744b})
        var skeletonMesh = new THREE.Mesh(newTree.skeletonGeometry,skeletonMaterial)
        this.scene.add(skeletonMesh)
        var leafMaterial = new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
        var leafMesh = new THREE.Mesh(newTree.leafGeometry,leafMaterial)
        this.scene.add(leafMesh)
        trees[i+N/2].push(newTree)
      }
    }
    return trees

  }

  drawTree (n) {
    return new LSystem(n,'F-[[X]+X]+F[+F[F+X-[X+]]]-X',Math.PI/5,Math.PI/5)
    // return new LSystem(n,'F-[[X]+X]+F[+F[F+X-]-]',Math.PI/5,Math.PI/5)
    // return new LSystem(n,'F-[[X]+X]-F[+[X+FX-]-]',Math.PI/5,Math.PI/5) // good idea to balance # of +s with -s
    // return new LSystem(n,'random',Math.PI/5,Math.PI/5)
  }


}

export default Environment
