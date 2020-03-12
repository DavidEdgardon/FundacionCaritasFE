import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Axios from "axios";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import MaterialTable from "material-table";
import NativeSelect from "@material-ui/core/NativeSelect";
import { Alert, AlertTitle } from "@material-ui/lab";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "../../styles/dialogReport.css";

const url = "https://apicaritas.herokuapp.com/api/paciente/";
const port = "http://localhost:3001/api/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

class CasoDetailDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: 0,
      casoData: [],
      open: false,
      isError: false,
      recursosMunicipales: []
    };
  }

  handleChange = (name, selectedRow) => event => {
    selectedRow[name] = event.target.value;
    this.changeDataCaso(selectedRow);
  };

  changeDataCaso = async selectedRow => {
    let response = await this.updateEstadoAtencionInDataBase(
      selectedRow.estado_atencion,
      selectedRow.id_caso
    );
    if (response === "Ok") {
      //Se actulizo el estado de aceptacion en el backend entonces hay que actualizar en el frontend
      let pos = this.getPosDataCaso(selectedRow.id_caso);
      let newArray = this.state.casoData;
      newArray[pos] = selectedRow;
      this.setState({ casoData: newArray });
    }
    this.showDialogAlert(!response === "okay");
  };

  showDialogAlert = isError => {
    this.setState({ isError: isError });
    this.openAlertDialog();
    setTimeout(() => {
      this.closeAlertDialog();
    }, 3000);
  };

  updateEstadoAtencionInDataBase = async (newEstado, idCaso) => {
    let estado = this.getIdEstadoAtencion(newEstado);
    let result = await Axios.put(port + "caso/update/" + `${idCaso}`, {
      EA: estado
    })
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error));
    return result;
  };

  getIdEstadoAtencion = estado => {
    if (estado === "Proceso") return 1;
    else if (estado === "Espera") return 2;
    return 3;
  };

  getPosDataCaso = id_caso => {
    let pos = 0;
    this.state.casoData.forEach(e => {
      if (e.id_caso === id_caso) {
        return;
      }
      pos++;
    });
    return pos;
  };

  openAlertDialog = () => {
    this.setState({ open: true });
  };

  closeAlertDialog = () => {
    this.setState({ open: false });
  };

  openDialog = e => {
    this.props.handleClickOpen();
  };

  CloseDialog = e => {
    console.log("close");
    this.props.handleClose();
  };

  componentDidMount = async e => {
    let id = this.props.vals.selectedRow[0].id_paciente;
    await this.getRecursosMunicipales();
    this.getData(id);
  };

  getData = id => {
    Axios.get(port + "caso/detail/" + `${id}`)
      .then(res => {
        this.setState({ casoData: res.data });
        console.log(this.state.casoData);
      })
      .catch(err => console.log(err));
  };

  getRecursosMunicipales = async () => {
    await Axios.get(port + "recursosmunicipales")
      .then(res => {
        this.setState({ recursosMunicipales: res.data });
        console.log(this.state.recursosMunicipales);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  getTableIcons = () => {
    return {
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
  };

  getTableColumns = () => {
    return [
      {
        title: "ID Caso",
        field: "id_caso",
        cellStyle: {
          width: "100%",
          maxWidth: "100%",
          padding: "none"
        }
      },
      {
        title: "Paciente",
        field: "nombre",
        cellStyle: {
          width: "100%",
          maxWidth: "100%",
          padding: "none"
        }
      },
      {
        title: "Condición",
        field: "condicion"
      },
      {
        title: "Terapeuta",
        field: "terapeuta"
      },
      {
        title: "Causa",
        field: "causas",
        render: rowData => {
          let json = JSON.parse(rowData.causas);
          let array = new Array();
          for (let clave in json) {
            if (json.hasOwnProperty(clave)) {
              array.push(json[clave]);
            }
          }
          let list = array.map(e => {
            return <li key={e}>{e}</li>;
          });
          return (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelRecursos-content"
              >
                <Typography>Ver más</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{list}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }
      },
      {
        title: "Recursos Municipales",
        field: "recursos_muni",
        render: rowData => {
          let json = JSON.parse(rowData.recursos_muni);
          let array = new Array();
          for (let clave in json) {
            if (json.hasOwnProperty(clave)) {
              array.push(this.state.recursosMunicipales[json[clave] - 1].tipo);
            }
          }
          let list = array.map(e => {
            return <li key={e}>{e}</li>;
          });
          return (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelRecursos-content"
              >
                <Typography>Ver más</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{list}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }
      },
      {
        title: "Tipo violencia",
        field: "tipo_violencia",
        render: rowData => {
          let json = JSON.parse(rowData.tipo_violencia);
          let array = new Array();
          for (let clave in json) {
            if (json.hasOwnProperty(clave)) {
              array.push(json[clave]);
            }
          }
          let list = array.map(e => {
            return <li key={e}>{e}</li>;
          });
          return (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelRecursos-content"
              >
                <Typography>Ver más</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{list}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        }
      },
      {
        title: "Juez",
        field: "juez"
      },
      {
        title: "Municipio",
        field: "municipio"
      },
      {
        title: "Estado Atencion",
        field: "estado_atencion",
        render: rowData => (
          <NativeSelect
            value={rowData.estado_atencion}
            onChange={this.handleChange("estado_atencion", rowData)}
            name="estado_atencion"
            inputProps={{ "aria-label": "estado_atencion" }}
          >
            <option value="Espera">Espera</option>
            <option value="Proceso">Proceso</option>
            <option value="Abandono">Abandono</option>
          </NativeSelect>
        )
      },
      {
        title: "Ubicacion Violencia",
        field: "ubicacion_violencia"
      },
      {
        title: "Tratamiento",
        field: "tratamiento"
      },
      {
        title: "Ultima modificacion",
        field: "ultima_modificacion"
      }
    ];
  };

  render() {
    const { vals } = this.props;
    const tableIcons = this.getTableIcons();
    const columns = this.getTableColumns();
    const options = {
      resizableColumns: "true"
    };

    return (
      <div>
        <Dialog
          fullScreen
          open={vals.openViewCaso}
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
                Detalle de caso
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{ maxWidth: "100%" }}>
            <MaterialTable
              icons={tableIcons}
              title=""
              columns={columns}
              data={this.state.casoData}
              isLoading={this.state.isLoading}
              options={options}
              localization={{
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
              }}
            />
          </div>
        </Dialog>

        {this.state.open && (
          <Dialog
            open={this.state.open}
            onClose={this.closeAlertDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            {this.state.isError ? (
              <Alert severity="error">
                <AlertTitle>Operación fallida</AlertTitle>
                Intente más tarde.
              </Alert>
            ) : (
              <Alert severity="success" style={{ width: "100%" }}>
                <AlertTitle>Operación existosa</AlertTitle>
                Estado de atención actualizado correctamente.
              </Alert>
            )}
          </Dialog>
        )}
      </div>
    );
  }
}

export default CasoDetailDialog;
