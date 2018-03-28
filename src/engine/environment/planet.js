import THREE from 'three'
import LSystem from './l-system.js'
import Leaf from './leaf.js'



class Planet {
  constructor (radius, numTrees,position) {
    this.position = position
    this.planetRadius = radius
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
    this.planetMesh = new THREE.Mesh( planetGeometry, planetMaterial )

    var planetEdgesGeometry = new THREE.EdgesGeometry( planetGeometry )
    var edgeMaterial = new THREE.LineBasicMaterial( {linewidth: 10 } )
    this.planetEdges = new THREE.LineSegments( planetEdgesGeometry, edgeMaterial )


    this.trees = this.drawForest(4,numTrees)
  }

  addToScene(scene){
    scene.add(this.planetMesh)
    scene.add(this.planetEdges)
    this.trees.forEach((tree) => {
      scene.add(tree.skeletonMesh)
      tree.leafMeshes.forEach((leafMesh) => {
        scene.add(leafMesh)
      })
    })
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

      // var woodMaterial = new THREE.ShaderMaterial({
      // 	uniforms: {
      //     scale: { type: "f", value: 16},
      //     frequency: { type: "f", value: 7},
      //     noiseScale: { type: "f", value: 6},
      //     ringScale: { type: "f", value: 0.4},
      //     color1: { type: "c", value: new THREE.Color(0xffffff) },
      //     color2: { type: "c", value: new THREE.Color(0x000000) }
      // 	},
      // 	vertexShader: $( '#vertexShader' )[0].textContent,
      // 	fragmentShader: $( '#fragmentShader' )[0].textContent
      // })

      var woodMaterial = new THREE.MeshPhongMaterial({color:0x91744b, side:THREE.DoubleSide})
      var skeletonMaterial = woodMaterial
      newTree.skeletonMesh = new THREE.Mesh(newTree.skeletonGeometry,skeletonMaterial)
      var leafMaterial = new THREE.MeshNormalMaterial({side:THREE.DoubleSide})
      newTree.leafMeshes = []
      newTree.leaves.forEach((leaf) => {
        leaf.translate(0,this.planetRadius,0)
        leaf.rotateX(xRot)
        leaf.rotateY(yRot)
        leaf.rotateZ(zRot)
        newTree.leafMeshes.push(new THREE.Mesh(leaf,leafMaterial))
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
    //was PI/5 for each (angle, wobble)
    return new LSystem(n,'random',Math.PI/4,Math.PI/4)
  }

}

export default Planet
