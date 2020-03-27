import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import { Row, Col, Container } from "react-bootstrap";
import "../../styles/dialogReport.css";
import logo from "../../assets/logocaritas.png";

const url = "https://apicaritas.herokuapp.com/api/paciente/";
const port = "http://localhost:3001/api/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class ReportPantientDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: 0,
      reporte: {},
      report: "Termino",
      reporteHTML: []
    };
  }

  handleChange = (event, input) => {
    this.setState({ [input]: event.target.value });
  };

  openDialog = e => {
    this.props.handleClickOpen();
  };

  CloseDialog = e => {
    console.log("close");
    this.props.handleClose();
  };

  componentDidMount = e => {
    let id = this.props.vals.selectedRow[0].id_paciente;
    let isAbandon = this.props.vals.isAbandon;
    let report = isAbandon ? "Abandono" : "Termino";
    this.setState({ report: report });
    this.getData(id);
  };

  getData = id => {
    Axios.get(port + "reporte/" + `${id}`)
      .then(res => this.setState({ reporte: res.data }))
      .catch(err => console.log(err));
  };

  getDataToPDF = async data => {
    let img = await html2canvas(document.querySelector(data)).then(
      async canvas => {
        let img = await canvas.toDataURL("image/png");
        return img;
      }
    );
    return img;
  };

  printPDF = async () => {
    let imgLogo = await this.getDataToPDF("#logo");
    let imgBody = await this.getDataToPDF("#pdf");
    let docPDF = new jsPDF();
    docPDF.addImage(imgLogo, "JPEG", 20, 20);
    docPDF.addImage(imgBody, "JPEG", 20, 120);
    //Print PDF
    docPDF.autoPrint();
    docPDF.output("dataurlnewwindow");
  };

  getBodyReport1 = () => {
    return (
      "Pastoral Social Caritas Diócesis de San Pedro Sula, notifica que el Sr. (a): " +
      this.state.reporte.nombres +
      " " +
      this.state.reporte.apellidos +
      " " +
      this.state.reporte.numero_expediente +
      " " +
      this.state.report +
      " el esquema de Consejería, al que fue remitido por el " +
      this.state.reporte.juez +
      "."
    );
  };

  getBodyReport2 = () => {
    return (
      "Se extiende la presente constancia en la ciudad de San Pedro Sula, departamento de Cortes el " +
      this.state.reporte.fecha +
      "."
    );
  };

  textToBody = text => {
    let newText = "";
    for (let i = 0; i < text.length; i++) {
      //Get Campos
      if (text[i] === "-") {
        let result = this.getToken("-", text.substring(i + 1, text.length));
        i = i + result.pos;
        newText = newText + this.state.reporte[result.token];
      } else {
        newText = newText + text[i];
      }
    }
    this.setState({ value2: newText });
    this.textToHTML(newText);
  };

  getToken = (init, text) => {
    let result = {
      token: "",
      pos: 0
    };
    for (let i = 0; i < text.length; i++) {
      if (text[i] == init) {
        result.token = text.substring(0, i); //Obtengo el nombre del campo
        result.pos = i + 1; // Le mando nueva posicion para continuar recorriendo la cadenar tomando en cuenta que esta funcion se llama dentro de un for el cual aumenta la cantidad de i +1
        break;
      }
    }
    return result;
  };

  textToHTML = text => {
    let array = new Array();
    let tmpText = "";
    for (let i = 0; i < text.length; i++) {
      if (text.substring(i, i + 1) === "\n") {
        array.push(<p key={i}>{tmpText}</p>);
        tmpText = "";
        let result = this.getCantEnter(text.substring(i, text.length));
        console.log(result.cant);
        if (result.cant > 1) {
          array.push(this.spacer(result.cant));
        } //*/
        i = i + result.pos;
      } else {
        tmpText = tmpText + text[i];
        if (i + 1 == text.length) {
          array.push(<p key={i}>{tmpText}</p>);
        }
      }
    }
    console.log(array);
    this.setState({ reporteHTML: array });
  };

  getCantEnter = text => {
    let result = {
      cant: 0,
      pos: 0
    };
    for (let i = 0; i < text.length; i++) {
      if (text.substring(i, i + 1) === "\n") {
        result.cant++;
        result.pos = i;
      } else {
        break;
      }
    }
    return result;
  };

  spacer = n => {
    let array = [];
    for (let c = 0; c < n; c++) {
      array.push(c);
    }
    let result = array.map(d => {
      return <br key={d} />;
    });
    return result;
  };

  render() {
    const { vals } = this.props;
    let bodyReport1 = this.getBodyReport1();
    let bodyReport2 = this.getBodyReport2();

    return (
      <div>
        <Dialog
          fullScreen
          open={vals.openReport}
          onClose={this.CloseDialog}
          TransitionComponent={Transition}
        >
          <AppBar style={{ position: "relative" }} color="secondary">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.CloseDialog}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                variant="h6"
                style={{ marginLeft: "2em", flex: 1 }}
                color="inherit"
              >
                <Row>
                  <Col xs={12} md={8}>
                    Reporte de {this.state.report}
                  </Col>
                  <Col xs={6} md={4}>
                    <Container>
                      <Button
                        variant="contained"
                        onClick={this.printPDF}
                        startIcon={<PrintIcon />}
                        color="default"
                      >
                        Imprimir
                      </Button>
                    </Container>
                  </Col>
                </Row>
              </Typography>
            </Toolbar>
          </AppBar>
          <br></br>
          <br></br>
          <br></br>
          <Row>
            <span className="center-spacer"></span>
            <div style={{ width: "17.59cm" }}>
              <img id="logo" src={logo} alt="Logo"></img>
            </div>

            <span className="center-spacer"></span>
          </Row>
          <Row>
            <span className="center-spacer"></span>
            <div id="pdf" style={{ width: "17.59cm" }}>
              <p>
                {this.state.reporte.juez ===
                "Juzgado Especial de Violencia Domestica"
                  ? "Juzgado de Ejecución Contra la Violencia Domestica"
                  : this.state.reporte.juez}
              </p>
              <p>Ciudad.</p>
              {this.spacer(4)}
              <p>{bodyReport1}</p>
              <p>{bodyReport2}</p>
              {this.spacer(5)}
              <p>{"Lic. " + this.state.reporte.nombre}</p>
              <p>{this.state.reporte.codigo}</p>
            </div>

            <span className="center-spacer"></span>
          </Row>
        </Dialog>
      </div>
    );
  }
}

export default ReportPantientDialog;
