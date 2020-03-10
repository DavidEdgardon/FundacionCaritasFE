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
import "../../styles/dialogReport.css";

const url = "https://apicaritas.herokuapp.com/api/paciente/";
const port = "http://localhost:3001/api/caso/detail/";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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
    // headerStyle: {
    // //   width: 700,
    // //   maxWidth: 700,
    // //   padding: 'none'
    // // }
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
    field: "causa"
  },
  {
    title: "Recursos Municipales",
    field: "recursos"
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
    field: "estado_atencion"
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
const options = {
  resizableColumns: "true"
};

class CasoDetailDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: 0,
      casoData: []
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
    this.getData(id);
  };

  getData = id => {
    Axios.get(port + `${id}`)
      .then(res => {
        this.setState({ casoData: res.data });
        console.log(this.state.casoData);
      })
      .catch(err => console.log(err));
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
      </div>
    );
  }
}

export default CasoDetailDialog;
