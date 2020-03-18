import React, { Component } from "react";
import Pacient from "../PacientList";
import Main from "../main";
import FormDenounced from "./FormDenounced";
import FormCases from "./FormCases";
import FormPatients from "./FormPatients";
import Document from "../document";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import logoi from "../Recursos/logo_lp.jpeg";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: 1,
      Nombre: "",
      PrimerA: "",
      SegundoA: "",
      NumeroIdent: "",
      Direccion: "",
      Localidad: "",
      Departamento: "",
      Telefono: "",
      Date: "",
      EstadoCivil: "",
      Genero: "",
      Edad: "",
      Oficio: "",
      Educacion: "",
      EstadoOcupacion: "",
      Remision: "",
      Parroquia: "",
      Colonia: "",
      TipoCaso: "",
      Tratamiento: "",
      NumeroEx: "",
      EstadoAtencion: "",
      Terapeuta: "",
      AccesoJusticia: "",
      VPsicologica: false,
      VFisica: false,
      VEconomica: false,
      VSexual: false,
      Victima: false,
      Agresor: false,
      RPT: false,
      CUmep: false,
      COmm: false,
      COng: false,
      CJuzgado: false,
      CFiscal: false,
      Ninos: "",
      Ninas: "",
      Otros: "",
      CEconomica: false,
      CInfidelidad: false,
      CAlcoholismo: false,
      COtros: false,
      VUrbana: false,
      VRural: false
    };

    handleChange = (event, input) => {
      this.setState({ [input]: event.target.value });
    };

    handleLocal = event => {
      const input = event.target.value;
      if (input === "VUrbana") {
        this.setState({ [input]: true });
        this.setState({ ["VRural"]: false });
      } else {
        this.setState({ [input]: true });
        this.setState({ ["VUrbana"]: false });
      }
    };

    handleCheckBox = (event, input) => {
      if (event.target.checked) {
        this.setState({ [input]: true });
      } else {
        this.setState({ [input]: false });
      }
    };
    newStep = () => {
      this.setState({ steps: this.state.steps + 1 });
    };
    prevStep = () => {
      this.setState({ steps: this.state.steps - 1 });
    };
  }
  newStep = () => {
    this.setState({ steps: this.state.steps + 1 });
  };
  prevStep = () => {
    this.setState({ steps: this.state.steps - 1 });
  };

  render() {
    const {
      NombreD,
      PrimerAD,
      SegundoAD,
      NumeroIdentD,
      DireccionD,
      LocalidadD,
      DepartamentoD,
      EstadoCivilD,
      OficioD,
      EducacionD,
      TelefonoD,
      DateD,
      Nombre,
      PrimerA,
      SegundoA,
      NumeroIdent,
      Direccion,
      Localidad,
      Departamento,
      Telefono,
      Date,
      EstadoCivil,
      Genero,
      Oficio,
      Educacion,
      EstadoOcupacion,
      Remision,
      AccesoJusticia,
      Parroquia,
      Colonia,
      TipoCaso,
      Tratamiento,
      NumeroEx,
      EstadoAtencion,
      Terapeuta,
      VPsicologica,
      VFisica,
      VEconomica,
      VSexual,
      Victima,
      Agresor,
      CUmep,
      COmm,
      COng,
      CJuzgado,
      CFiscal,
      CInfidelidad,
      CEconomica,
      CAlcoholismo,
      COtros,
      VUrbana,
      VRural,
      Ninos,
      Ninas,
      Otros
    } = this.state;
    const vals = {
      NombreD,
      PrimerAD,
      SegundoAD,
      NumeroIdentD,
      DireccionD,
      LocalidadD,
      DepartamentoD,
      EstadoCivilD,
      OficioD,
      EducacionD,
      TelefonoD,
      DateD,
      Nombre,
      PrimerA,
      SegundoA,
      NumeroIdent,
      Direccion,
      Localidad,
      Departamento,
      Telefono,
      Date,
      EstadoCivil,
      Genero,
      Oficio,
      Educacion,
      EstadoOcupacion,
      Remision,
      AccesoJusticia,
      Parroquia,
      Colonia,
      TipoCaso,
      Tratamiento,
      NumeroEx,
      EstadoAtencion,
      Terapeuta,
      VPsicologica,
      VFisica,
      VEconomica,
      VSexual,
      Victima,
      Agresor,
      CUmep,
      COmm,
      COng,
      CJuzgado,
      CFiscal,
      CInfidelidad,
      CEconomica,
      CAlcoholismo,
      COtros,
      VUrbana,
      VRural,
      Ninos,
      Ninas,
      Otros
    };

    switch (this.state.steps) {
      case 1:
        return (
          <div>
            <h2 id="TituloB" style={{ textAlign: "center" }}>
              Bienvenido al Sistema administrativo de Pacientes de Caritas
            </h2>
            <div style={{ textAlign: "center" }}>
              <img src={logoi} width="30%" alt="logo inicio" />
            </div>

            <Fab
              id="ButtonAdd"
              color="primary"
              aria-label="Add"
              style={{
                margin: "1em",
                position: "absolute",
                bottom: 0,
                left: "90%"
              }}
              onClick={this.newStep}
              disabled={this.props.disabled}
            >
              <AddIcon />
            </Fab>
          </div>
        );
      case 2:
        return (
          <div className="text-center">
            <FormPatients
              className="d-flex justify-content-center"
              newStep={this.newStep}
              handleChange={this.handleChange}
              vals={vals}
              prevStep={this.prevStep}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <FormCases
              newStep={this.newStep}
              handleChange={this.handleChange}
              handleCheckBox={this.handleCheckBox}
              prevStep={this.prevStep}
              vals={vals}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <FormDenounced
              prevStep={this.prevStep}
              newStep={this.newStep}
              handleChange={this.handleChange}
              vals={vals}
            />
          </div>
        );
      case 5:
        return (
          <div>
            <Document
              prevStep={this.prevStep}
              handleChange={this.handleChange}
              vals={vals}
            />
          </div>
        );
      default:
        return (
          <div>
            <Main
              newStep={this.newStep}
              handleChange={this.handleChange}
              vals={vals}
            />
            <Pacient />
            <Fab color="primary" aria-label="Add" style={{ margin: "1em" }}>
              <AddIcon />
            </Fab>
          </div>
        );
    }
  }
}

export default Index;
