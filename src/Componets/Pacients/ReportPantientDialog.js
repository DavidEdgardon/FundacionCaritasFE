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

const url = "https://apicaritas.herokuapp.com/api/paciente/";
const port = "http://localhost:3001/api/historial/";
const portAuditoria = "http://localhost:3001/api/auditoria/paciente/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class ReportPantientDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: 0,
      report: "Termino",
      name: "David Xavier Diaz EXP-VD-",
      juzgado: "Juzgado de Ejecución Contra la Violencia Domestica",
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

  styles = theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  });

  useStyles = makeStyles(theme => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: 400
      }
    }
  }));

  componentDidMount = e => {
    let id = this.props.vals.selectedRow[0].id_paciente;
    let isAbandon = this.props.vals.isAbandon;
    this.setState({
      juzgado: "Juzgado de Ejecución Contra la Violencia Domestica ",
      date: "2 de Marzo de dos mil veinte",
      name: "David Xavier Diaz EXP-VD-",
      encargado: "Lic. Miriam Fonseca",
      code: "Psicóloga 07-953"
    });
    let reporte = "Termino";
    if (isAbandon) {
      reporte = "Abandono";
    }
    this.setState({ report: reporte });
    console.log(isAbandon);
    console.log(id);
    /*Axios.get(port + `${id}`)
      .then(res => this.setState({ historial: res.data }))
      .catch(err => console.log(err));

    Axios.get(portAuditoria + `${id}`)
      .then(res => this.setState({ auditoria: res.data[0] }))
      .catch(err => console.log(err));*/
  };

  render() {
    const { vals } = this.props;
    console.log(this.state);
    let doc = new jsPDF();
    doc.text("Pastoral Social Caritas de Honduras", 10, 10);
    doc.text(this.state.juzgado, 10, 20);
    doc.text(
      "Pastoral Social Caritas Diócesis de San Pedro Sula, notifica que el Sr. (a): \n" +
        this.state.name +
        " " +
        this.state.report +
        " el esquema de Consejería,\nal que fue remitido por el Juzgado Especial de Violencia Domestica.",
      10,
      30
    );
    doc.text(
      "Se extiende la presente constancia en la ciudad de San Pedro Sula,\ndepartamento de Cortes el " +
        this.state.date +
        ".",
      10,
      70
    );
    doc.text(this.state.encargado, 10, 90);
    doc.text(this.state.code, 10, 100);
    doc.save("test.pdf");

    return (
      <div>
        <Dialog
          maxWidth="100px"
          fullWidth="100px"
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
                Reporte
              </Typography>
            </Toolbar>
          </AppBar>
        </Dialog>
      </div>
    );
  }
}

export default ReportPantientDialog;
