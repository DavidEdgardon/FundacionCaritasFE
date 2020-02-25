import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
//import Form from 'src/Componets/Forms/test';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import UpdateIcon from '@material-ui/icons/Update';
import Delete from '@material-ui/icons/Delete';


//const url = 'https://apicaritas.herokuapp.com/api/paciente/';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class HistorialPaciente extends Component   {
  constructor(props) {
    super(props)
    this.state = {
      Id: 0,
    }
  }

  handleChange = (event,input) => {
    this.setState({ [input]: event.target.value });
    
  };

openDialog = e => {
    this.props.handleClickOpen();
};  
    
CloseDialog = e => {
  console.log('close');
  this.props.handleClose();
};
  
render(){
    const {vals}=this.props;
    const {Nombre,PrimerA ,SegundoA ,NumeroIdent ,Direccion ,Localidad ,Departamento,Telefono,Date,EstadoCivil,
      Genero,Oficio,Educacion,EstadoOcupacion,Parroquia,Colonia,Ninos,Ninas,Otros
  }=this.state;
  const formval={Nombre,PrimerA ,SegundoA ,NumeroIdent ,Direccion ,Localidad ,Departamento,Telefono,Date,EstadoCivil,
      Genero,Oficio,Educacion,EstadoOcupacion,Parroquia,Colonia,Ninos,Ninas,Otros
  };

  return (
    <div>
    
      <Dialog fullScreen open={vals.open2} onClose={this.CloseDialog} TransitionComponent={Transition}>
        <AppBar style={{position: 'relative',}}color="secondary">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={this.CloseDialog} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={{ marginLeft:"2em",flex: 1,}}color="inherit">
              Historial de Paciente 
            </Typography>  
          </Toolbar>
        </AppBar>
        
        <Fab color="primary" aria-label="Add" style={{margin:'1em',position: 'absolute',
          bottom:0,
          left:"90%"}} onClick={this.UpdateFunc}>
          <UpdateIcon />
        </Fab>  
        <Fab color="primary" aria-label="Add" style={{margin:'1em',position: 'absolute',
          bottom:0,
          left:"80%"}} onClick={this.deleteFunc}>
          <Delete />
        </Fab>  

      </Dialog>
    </div>
  );
}
}

export default HistorialPaciente;