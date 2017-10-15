var arraySiguienteEstado = [];
var intervaloJuego;

class Celda extends React.Component{
  cambiarEstadoIndividual(id, e){
    if(intervaloJuego !== undefined){
      clearInterval(intervaloJuego);
    }
    this.props.cambiarEstadoIndividual(id);
    e.currentTarget.classList.toggle("viva");
  }
  
  render(){
    return(
      <div className={this.props.estadoCelda ? "celda-casilla viva" : "celda-casilla"}
            onClick={e => {this.cambiarEstadoIndividual(this.props.id, e)}}
            id={this.props.id}>
        
      </div>
    )
  }
}

class Juego extends React.Component{
  constructor(props){
    super(props);
    
    this.altoJuego = 600; 
    this.anchoJuego = 600;
    this.tamañoCelda= 20;
    this.numeroFilas = this.altoJuego / this.tamañoCelda;
    this.numeroColumnas = this.anchoJuego / this.tamañoCelda;
    this.numeroCeldas = this.numeroFilas * this.numeroColumnas;
    this.velociadGeneracion = 100;
    
    this.cambiarEstadoIndividual = this.cambiarEstadoIndividual.bind(this);
    
    this.estadoInicial = [];
    for(var i = 0; i < this.numeroCeldas ; i++) {
      let estadoCelda = Math.floor(Math.random() * 4) === 1 ? true : false;
      this.estadoInicial.push(estadoCelda);
    }
    
    this.state = {
      estadoInicial : this.estadoInicial,
      generacion: 0,
    }

  }
  
  calcularVecinos(indice){
    let vecinosVivos = 0;
    let idVecinos = [
      indice - (this.numeroColumnas + 1),
      indice - (this.numeroColumnas),
      indice - (this.numeroColumnas - 1),
      indice - 1,
      indice,
      indice + 1,
      indice + (this.numeroColumnas - 1), 
      indice + (this.numeroColumnas), 
      indice + (this.numeroColumnas + 1)
    ];
    idVecinos.map( (idVecina, indiceVecino) => {
      if(idVecina < 0 || idVecina > this.numeroCeldas || idVecina === indice) return;
      if( (indice+1) % this.numeroColumnas == 0 && (indiceVecino + 1) % 3 == 0 ) return;  
      if(indice % this.numeroColumnas == 0 && (indiceVecino % 3 == 0) ) return;
      
      this.state.estadoInicial[idVecina] ? vecinosVivos++ : null;
    })
    
    return vecinosVivos;
  }
  
  cambiarEstado(){
    this.state.estadoInicial.map( (estado, indice) => {
      let nuevoEstado;
      let vecinosVivos = this.calcularVecinos(indice);
      if(estado){
        if(vecinosVivos < 2 || vecinosVivos > 3) {
          nuevoEstado = false;
        } else {
          nuevoEstado = true;
        }
      } else {
        if(vecinosVivos === 3) { nuevoEstado = true;}
        else{nuevoEstado = false}
      }
      arraySiguienteEstado.push(nuevoEstado);
    });
    
    this.setState(
      {
        estadoInicial : arraySiguienteEstado,
        generacion: this.state.generacion + 1 
      }, () => {
        arraySiguienteEstado = []
      });
  }
  
  empezarJuego(){
    if(intervaloJuego !== undefined){
      clearInterval(intervaloJuego);
    }
    intervaloJuego = setInterval( () => {
      this.cambiarEstado();
    }, this.velociadGeneracion)
  }
  
  pararJuego(){
    if(intervaloJuego !== undefined){
      clearInterval(intervaloJuego);
    }
  }
  
  cambiarTamaño(nuevoTamaño){
    if(intervaloJuego !== undefined){
      clearInterval(intervaloJuego);
    }
    this.anchoJuego = nuevoTamaño * 20;
    this.numeroColumnas = this.anchoJuego / this.tamañoCelda;
    this.numeroCeldas = this.numeroColumnas * this.numeroFilas;
    
    let listaNuevosEstados = [];
    for(var x = 0; x < this.numeroCeldas ; x++) {
      let estadoCelda = Math.floor(Math.random() * 4) === 1 ? true : false;
      listaNuevosEstados.push(estadoCelda);
    }
    
    this.setState({
      estadoInicial : listaNuevosEstados,
      generacion: 0
    })
  }
  
  cambiarEstadoIndividual(id){
    let estado = !this.state.estadoInicial[id];
      this.state.estadoInicial[id] = estado
  }
  
  render(){
    return(
      
      <div className="contenedor-principal">
        
        <div className="grupo-boton">
          <div className="boton">
            {this.state.generacion}
          </div>
          <div className="boton" onClick={e => this.empezarJuego()}>
            Empezar
          </div> 
          <div className="boton" onClick={e => this.pararJuego()}>
            Parar
          </div>
          
        </div>
        
        <div className="juego" style={{width: `${this.anchoJuego}px`, height: `${this.altoJuego}px`}}>
          {this.state.estadoInicial.map( (estado, i) => {
            return <Celda id={i} estadoCelda={estado} 
                     cambiarEstadoIndividual={this.cambiarEstadoIndividual}/>
          })}
        </div>
        
        <div className="grupo-tamaños">
          <div className="boton" onClick={e => this.cambiarTamaño(30)}>
            30 x 30
          </div>
          <div className="boton" onClick={e => this.cambiarTamaño(50)}>
            50 x 30
          </div>
          <div className="boton" onClick={e => this.cambiarTamaño(70)}>
            70 x 30
          </div>
        </div>
        
      </div>
    );
  }
}

ReactDOM.render(<Juego/>, document.getElementById("contenedor"))