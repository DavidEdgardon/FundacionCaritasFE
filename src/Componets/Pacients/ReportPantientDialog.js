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
      name: "David Xavier Diaz Guzman",
      expediente: "9980",
      juzgado: "Juzgado Especial de Violencia Domestica",
      date: "2 de Marzo de dos mil veinte",
      encargado: "Lic. Miriam Fonseca",
      code: "Psicóloga 07-953"
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
    let reporte = isAbandon ? "Abandono" : "Termino";
    this.setState({ report: reporte });
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
        document.body.appendChild(canvas);
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

  render() {
    const { vals } = this.props;
    let bodyReport1 =
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
      ".";
    let bodyReport2 =
      "Se extiende la presente constancia en la ciudad de San Pedro Sula, departamento de Cortes el " +
      this.state.reporte.date;

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

            <img id="logo" src={logo} alt="Logo"></img>

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
              <br></br>
              <br></br>
              <br></br>
              <br></br>

              <p>{bodyReport1}</p>
              <p>{bodyReport2}</p>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
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
