


class LDNA{
  constructor (n,rule) {
    if (rule === 'random') {
      this.rule = this.generateRule()
    } else {
      this.rule = rule
    }
    this.instructions = this.generateInstructions(n,this.rule)
  }

    generateRule () {
      var rule = 'FFF[-X'
      var numLeftBrackets = 1
      var numX = 2
      var numSymbols = 0
      while(true){
        var r = Math.random()
        if (r<0.2){
          rule += '[F'
          numLeftBrackets += 1
          numX +=1
        } else if (r<0.3 && numX<5) {
          rule += 'X'
          numX += 1
        } else if (r<0.50) {
          rule += 'F'
        } else if (r<0.65) {
          rule += '+F'
        } else if (r<0.8) {
          rule += '-F'
        } else if (numLeftBrackets>0) {
          rule += 'XL]'
          if(r<0.9){
            rule += '+'
          } else {
            rule += '-'
          }
          numLeftBrackets -= 1
          if (numSymbols>20){
            break
          }
        }
        numSymbols +=1
      }
      while(numLeftBrackets > 0){
        rule += '+FL]'
        numLeftBrackets -= 1
      }
      console.log(rule)
      return rule
    }

    generateInstructions (n,rule) {
      console.log('meow')
      var string = 'X'
      for (var i = 0; i < n; i++){
        //these rules encode the grammar
        // string = string.replace(/X/g,'F-[[X]+X]+F[+FX]-X)')
        // string = string.replace(/X/g,'F-[[X]+X]+F[+F[F+X-[X+]]]-X)') //nice with 3d hack
        string = string.replace(/X/g,rule) //nice with 3d hack
        string = string.replace(/F/g,'FF') //whoa
      }
      string.replace(/X/g,'') //don't factor into final draw instructions
      return string
    }


}

export default LDNA
