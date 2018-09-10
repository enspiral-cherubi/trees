import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
import ThreeFlyControls from 'three-fly-controls'
var OrbitControls = ThreeOrbitControls(THREE)
var FlyControls = ThreeFlyControls(THREE)
import WindowResize from 'three-window-resize'
import LSystem from './l-system.js'
import Leaf from './leaf.js'
import Branch from './branch.js'
var Color = require("color")
var squirrel = false


class Environment {

  constructor () {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 1000)

    //TODO: Make the SUN
    // var hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
    //TODO: Make the NIGHTSUN

    // this.controls = new OrbitControls(this.camera)
    this.renderer = new THREE.WebGLRenderer({alpha: true, canvas: $('#three-canvas')[0]})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 1)



    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add( light );

    this.controls = new THREE.FlyControls(this.camera, this.renderer.domElement)
    this.controls.movementSpeed = 0.2
    this.controls.rollSpeed = 0.01
    this.keyMap = {}

    var windowResize = new WindowResize(this.renderer, this.camera)



    // this.separateTrees(4)
    this.rustle = 0.1
    this.velocity = new THREE.Vector3(0,0,0)
    this.glideRatio = 0.5
    this.cameraDirection = this.camera.getWorldDirection()
    this.flying = false
    this.climbing = false

    this.planetRadius = 10
    var planetGeometry = new THREE.SphereGeometry(this.planetRadius,10,10)
    var planetMaterial = new THREE.MeshBasicMaterial({color:0})
    // var planetMaterial = new THREE.ShaderMaterial({
    //   uniforms: {
    //     scale: { type: "f", value: 16},
    //     frequency: { type: "f", value: 7},
    //     noiseScale: { type: "f", value: 6},
    //     ringScale: { type: "f", value: 0.4},
    //     color1: { type: "c", value: new THREE.Color(0xffffff) },
    //     color2: { type: "c", value: new THREE.Color(0x000000) }
    //   },
    //   vertexShader: $( '#planetVertexShader' )[0].textContent,
    //   fragmentShader: $( '#planetFragmentShader' )[0].textContent
    // })
    var planet = new THREE.Mesh( planetGeometry, planetMaterial )
    // this.scene.add( planet )

    var planetEdgesGeometry = new THREE.EdgesGeometry( planetGeometry )
    var edgeMaterial = new THREE.LineBasicMaterial( {linewidth: 10 } )
    var planetEdges = new THREE.LineSegments( planetEdgesGeometry, edgeMaterial )
    this.scene.add(planetEdges)

    this.camera.position.z = 30
    this.camera.position.y = this.planetRadius

    //recursion depth, number of trees
    // this.trees = this.drawForest(5,1)
    this.trees = []

    var lineCurve = new THREE.LineCurve(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,1))
    var branch = new Branch([lineCurve],1)
    this.scene.add(branch.mesh)
    console.log(branch.mesh)

  }

  render () {

    this.renderer.render(this.scene, this.camera)
    this.camera.getWorldDirection(this.cameraDirection)
    if(squirrel){
      this.climbing = false
      this.trees.forEach((tree) => {
        if(tree.skeletonGeometry.boundingBox.containsPoint(this.camera.position)){
          tree.skeletonGeometry.vertices.forEach((v) => {
            if(v.distanceTo(this.camera.position) < 1){
              this.climbing = true
              // break
            }
          })
        }
      })

      if (this.climbing){
        //climbing
        this.velocity.set(0,0,0)
        this.controls.movementSpeed = 0.05
      } else if(this.camera.position.length() > this.planetRadius*1.1){
          //not on the ground but not on a tree
          if(this.keyMap['w']){
            //gliding
            this.velocity.addScaledVector(
              this.camera.position,
              -50/(2*Math.pow(this.camera.position.length(),3)))
            this.velocity.addScaledVector(
              this.cameraDirection,
              50*this.glideRatio/(Math.pow(this.camera.position.length(),2))
            )
          }
          if(this.keyMap['s']){
            //TODO:Soar
            this.velocity.addScaledVector(
              this.camera.position,
              -50/(2*Math.pow(this.camera.position.length(),3)))
            this.velocity.addScaledVector(
                this.velocity,
                -0.05)
          } else {
            //falling
            this.velocity.addScaledVector(
              this.camera.position,
              -50/Math.pow(this.camera.position.length(),3))
          }
          this.controls.movementSpeed = 0
        } else {
        //on the ground
        this.velocity.set(0,0,0)
        this.controls.movementSpeed = 0.2
      }

      //drag
      this.velocity.addScaledVector(
        this.velocity,
        -0.005)
      this.camera.position.addScaledVector(this.velocity,0.1)
    }


  }


  mapKeys (e) {
    this.keyMap[e.key] = (e.type == 'keydown');
  }

  control (e) {
    if(e.key===' ' && squirrel){
      this.velocity.addScaledVector(this.camera.position,1/this.camera.position.length())
      this.camera.position.addScaledVector(this.camera.position,2/this.camera.position.length())
      if(this.keyMap['w']){
        this.velocity.addScaledVector(this.cameraDirection,2)
        this.camera.position.addScaledVector(this.cameraDirection,1)
      }
    }
    if(e.key==='w' && !this.climbing){
      this.flying = true
    } else {
      this.flying = false
    }
  }

  drawForest(n,N) {
    var trees = []
    for(var i = 0;i<N;i++){
      var newTree = this.drawTree(n,0.1)
      var xRot = Math.random()*2*Math.PI
      var yRot = Math.random()*2*Math.PI
      var zRot = Math.random()*2*Math.PI
      newTree.skeletonGeometry.translate(0,this.planetRadius,0)
      newTree.skeletonGeometry.rotateX(xRot)
      newTree.skeletonGeometry.rotateY(yRot)
      newTree.skeletonGeometry.rotateZ(zRot)
      // var skeletonMaterial = new THREE.MeshBasicMaterial({vertexColors:THREE.VertexColors})

      var woodMaterial = new THREE.ShaderMaterial({
      	uniforms: {
          scale: { type: "f", value: 16},
          frequency: { type: "f", value: 7},
          noiseScale: { type: "f", value: 6},
          ringScale: { type: "f", value: 0.4},
          color1: { type: "c", value: new THREE.Color(0xffffff) },
          color2: { type: "c", value: new THREE.Color(0x000000) }
      	},
      	vertexShader: $( '#vertexShader' )[0].textContent,
      	fragmentShader: $( '#fragmentShader' )[0].textContent
      })

      // var skeletonMaterial = new THREE.MeshBasicMaterial({color:0x91744b, side:THREE.DoubleSide})
      var skeletonMaterial = woodMaterial
      var skeletonMesh = new THREE.Mesh(newTree.skeletonGeometry,skeletonMaterial)
      this.scene.add(skeletonMesh)
      var leafMaterial = new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
      newTree.leaves.forEach((leaf) => {
        leaf.translate(0,this.planetRadius,0)
        leaf.rotateX(xRot)
        leaf.rotateY(yRot)
        leaf.rotateZ(zRot)
        this.scene.add(new THREE.Mesh(leaf,leafMaterial))
      })
      // this.scene.add(new THREE.Mesh(newTree.leafGeometry,leafMaterial))
      newTree.skeletonGeometry.computeBoundingBox()
      trees.push(newTree)
    }
    return trees

  }

  drawTree (n) {
    // return new LSystem(n,'F-[[X]+X]+F[+F[F+X-[X+]]]-X',Math.PI/5,Math.PI/5)
    // FFF[FXL]+[F[FF+-FXL]XXL]FX[F[F[FFF[FXL]]]]
    // FFF[FFX+F[F[F-X]FFX]XF-XF[F+X]]
    // FFF[FF+XL]-[FF+-XL]FFXF[F[FXL]X+]
    // return new LSystem(n,'F-[[X]+X]+F[+F[F+X-]-]',Math.PI/5,Math.PI/5)
    // return new LSystem(n,'F-[[X]+X]-F[+[X+FX-]-]',Math.PI/5,Math.PI/5) // good idea to balance # of +s with -s
    // FFF[X-F-FXL][F+FXL]XFFFX-FFFF-F[F+F[F[F[FXL]+FL]+FL]+FL]
    return new LSystem(n,'random',Math.PI/5,Math.PI/5)
  }


}

export default Environment
