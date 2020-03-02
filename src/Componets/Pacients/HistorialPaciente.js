import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import grey from "@material-ui/core/colors/grey";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import { METHODS } from "http";
import Axios from "axios";

const url = "https://apicaritas.herokuapp.com/api/paciente/";
const port = "http://localhost:3001/api/historial/";
const portAuditoria = "http://localhost:3001/api/auditoria/paciente/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class HistorialPaciente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: 0,
      auditoria: {},
      historial: []
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
    console.log(id);
    Axios.get(port + `${id}`)
      .then(res => this.setState({ historial: res.data }))
      .catch(err => console.log(err));

    Axios.get(portAuditoria + `${id}`)
      .then(res => this.setState({ auditoria: res.data[0] }))
      .catch(err => console.log(err));
  };

  render() {
    const { vals } = this.props;
    console.log(this.state);
    const pagination = {
      pagination: {
        labelDisplayedRows: "{from}-{to} de {count}",
        labelRowsSelect: "filas",
        labelRowsPerPage: "Filas por pagina:",
        firstAriaLabel: "Primera pagina",
        firstTooltip: "Primera pagina",
        previousAriaLabel: "Pagina anterior",
        previousTooltip: "Pagina anterior",
        nextAriaLabel: "Pagina siguiente",
        nextTooltip: "Pagina siguiente",
        lastAriaLabel: "Ultima pagina",
        lastTooltip: "Ultima pagina"
      },
      body: {
        emptyDataSourceMessage: "No se encontraron registros",
        filterTooltip: "Filtrar"
      },
      toolbar: {
        searchTooltip: "Buscar",
        searchPlaceholder: "Buscar"
      }
    };

    const card_background = grey[200];

    const tableIcons = {
      DetailPanel: ChevronRight,
      Filter: FilterList,
      FirstPage: FirstPage,
      Clear: Clear,
      LastPage: LastPage,
      NextPage: ChevronRight,
      PreviousPage: ChevronLeft,
      Search: Search,
      SortArrow: ArrowUpward,
      ViewColumn: ViewColumn
    };
    const columns = [
      {
        title: "Id Historial",
        field: "id_historial"
      },
      {
        title: "Id Paciente",
        field: "id_paciente"
      },
      {
        title: "Id Usuario",
        field: "id_usuario"
      },
      {
        title: "Tipo Reporte",
        field: "tipo_reporte"
      },
      {
        title: "Fecha",
        field: "fecha"
      },
      {
        title: "Comentario",
        field: "comentario"
      }
    ];

    return (
      <div>
        <Dialog
          maxWidth="100px"
          fullWidth="100px"
          open={vals.open2}
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
                Historial de Paciente
              </Typography>
            </Toolbar>
          </AppBar>

          <Grid
            container
            justify="flex-center"
            style={{ width: "75%", alignSelf: "center", margin: "3%" }}
          >
            <Card style={{ backgroundColor: card_background }}>
              <Card style={{ backgroundColor: card_background }}>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ textAlign: "center" }}>
                    {" "}
                    &nbsp;Auditoria Paciente{" "}
                  </h3>
                </div>
                <CardContent>
                  <Grid container spacing={4}>
                    <Grid item xs={7} sm={3}>
                      <TextField
                        id="outlined-basic"
                        label="Usuario"
                        variant="outlined"
                        value={this.state.auditoria.usuario_creacion}
                      />
                    </Grid>
                    <Grid item xs={7} sm={3}>
                      <TextField
                        id="outlined-basic"
                        label="Fecha Creacion"
                        variant="outlined"
                        value={this.state.auditoria.fecha_creacion}
                      />
                    </Grid>
                    <Grid item xs={7} sm={3}>
                      <TextField
                        id="outlined-basic"
                        label="Usuario Modifico"
                        variant="outlined"
                        value={this.state.auditoria.usuario_modifico}
                      />
                    </Grid>
                    <Grid item xs={7} sm={3}>
                      <TextField
                        id="outlined-basic"
                        label="Fecha Ultima Actualizacion"
                        variant="outlined"
                        value={this.state.auditoria.fehca_modificacion}
                      />
                    </Grid>

                    <Grid item xs={7} sm={12}>
                      <MaterialTable
                        icons={tableIcons}
                        title="Historial"
                        columns={columns}
                        data={this.state.historial}
                        isLoading={this.state.isLoading}
                        localization={pagination}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Card>
          </Grid>
        </Dialog>
      </div>
    );
  }
}

export default HistorialPaciente;
