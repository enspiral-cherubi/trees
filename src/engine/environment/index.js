import THREE from 'three'
import $ from 'jquery'
import ThreeOrbitControls from 'three-orbit-controls'
import ThreeFlyControls from 'three-fly-controls'
var OrbitControls = ThreeOrbitControls(THREE)
var FlyControls = ThreeFlyControls(THREE)
import WindowResize from 'three-window-resize'
import LSystem from './l-system.js'
import Leaf from './leaf.js'
import Planet from './planet.js'
import Physics from './physics.js'
var Color = require("color")
var squirrel = true


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
    this.glideRatio = 2
    this.cameraDirection = this.camera.getWorldDirection()
    this.flying = false
    this.climbing = false

    this.planetRadius = 10
    var planet = new Planet(this.planetRadius,1, new THREE.Vector3(0,0,0))
    planet.addToScene(this.scene)


    this.camera.position.z = 30
    this.camera.position.y = this.planetRadius



    this.physics = new Physics(
      this.camera,this.controls,this.keyMap,this.trees,
      2, //glide ratio
      this.planetRadius,
      1.5, //climbing distance
      0.05 //climbing speed
    )

  }

  render () {

    this.renderer.render(this.scene, this.camera)
    this.camera.getWorldDirection(this.cameraDirection)
    // this.physics.update()


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

}

export default Environment
