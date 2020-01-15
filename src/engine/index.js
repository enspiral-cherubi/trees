import THREE from 'three'
import Environment from './environment'
import View from './view'
import $ from 'jquery'
import loop from 'raf-loop'

class Engine {

  constructor () {
    this.environment = new Environment()
    this.view = new View()
  }

  bindEventListeners () {
    $(window).on('load', this.view.closeLoadingScreen )
    $(window).keydown((e)=>{
      this.environment.control(e)
      this.environment.mapKeys(e)
    })
    $(window).keyup((e)=>{this.environment.mapKeys(e)})

  }

  start () {
    loop((dt) => {
      this.environment.render()
      if (this.environment.controls) {
        this.environment.controls.update(dt)
      }
    }).start()
  }

}

export default Engine
