import THREE from 'three'


class Physics {

  constructor (camera,controls,keyMap,trees,glideRatio,planetRadius) {
      //things physics interacts with
      this.camera = camera
      this.controls = controls
      this.keyMap = keyMap

      //objects in the world
      this.trees = trees

      //parameters
      this.glideRatio = glideRatio
      this.planetRadius = planetRadius

      //helper objects
      this.cameraDirection = this.camera.getWorldDirection()
      this.velocity = new THREE.Vector3(0,0,0)
  }

  update () {
    this.camera.getWorldDirection(this.cameraDirection)
    this.flying = false


    //test to see if climbing a tree
    this.climbing = false
    this.trees.forEach((tree) => {
      if(tree.skeletonGeometry.boundingBox.containsPoint(this.camera.position)){
        tree.skeletonGeometry.vertices.forEach((v) => {
          if(v.distanceTo(this.camera.position) < 1.5){
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
            0.05*this.velocity.length()/this.camera.position.length())
          this.velocity.addScaledVector(
              this.velocity,
              -0.05)
        } else {
          //falling
          this.velocity.addScaledVector(
            this.camera.position,
            -5/Math.pow(this.camera.position.length(),2))
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

export default Physics
