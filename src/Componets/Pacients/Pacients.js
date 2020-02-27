import React, { Component } from "react";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Search from "@material-ui/icons/Search";
import Clear from "@material-ui/icons/Clear";
import ViewColumn from "@material-ui/icons/ViewColumn";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import PacientHistory from "./HistorialPaciente";
import Dialog from "../dialog";
import Mayre from "mayre";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Info from "@material-ui/icons/Info";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Cancel from "@material-ui/icons/Cancel";
import Edit from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";

import HistorialPaciente from "./HistorialPaciente";

const port = "http://localhost:3001/";

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

class Pacients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      show: false,
      selectedRow: null,
      open: false,
      open2: false,
      hide: false,
      isLoading: false
    };
  }
  handleModal() {
    this.setState({ show: !this.state.show });
  }

  componentDidMount = async () => {
    await this.fetchPacientsData();
  };

  fetchPacientsData = async () => {
    this.setState({ isLoading: true });
    await Axios.get(port + "api/paciente")
      .then(res => {
        this.setState({ list: res.data });
      })
      .catch(error => {
        console.log(error);
      });
    this.setState({ isLoading: false });
  };

  handleClickOpen = () => {
    this.setState({ open: true, hide: true });
    //this.setState({ hide: true });
    //no hagas esto es mala pracica codigo innecesario
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true, hide: true });
    //this.setState({ hide: true });
  };

  handleClose = () => {
    this.setState({ open: false, hide: false });
    //this.setState({ hide: false });
  };

  handleClose2 = () => {
    this.setState({ open2: false, hide: false });
    //this.setState({ hide: false });
  };

  datas = selectedRow => {
    this.setState({ selectedRow: [selectedRow.rowData] });
    this.handleClickOpen();
    console.log(selectedRow.rowData["id_paciente"]);
    console.log(selectedRow);
  };

  render() {
    const { open, open2, hide, selectedRow } = this.state;
    const vals = { open, open2, hide, selectedRow };
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

    const columns = [
      {
        field: "acciones",
        title: "Acciones",
        render: rowData => (
          <div>
            <Grid container spacing={3}>
              <Grid item xs={3}>
                <Tooltip title="Información">
                  <IconButton>
                    <Info color="secondary"></Info>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Editar">
                  <IconButton onClick={() => this.datas({ rowData })}>
                    <Edit color="secondary"></Edit>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Abandono">
                  <IconButton>
                    <Cancel color="secondary"></Cancel>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={3}>
                <Tooltip title="Terminado">
                  <IconButton>
                    <CheckCircle color="secondary"></CheckCircle>
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        )
      },
      {
        title: "Identidad",
        field: "identidad"
      },
      {
        title: "Nombre",
        field: "nombre"
      },
      {
        title: "Apellidos",
        field: "apellido"
      },
      {
        title: "Edad",
        field: "edad"
      },
      {
        title: "Genero",
        field: "genero"
      },
      {
        title: "Oficio",
        field: "oficio"
      },
      {
        title: "Estado Civil",
        field: "estado_civil"
      },
      {
        title: "Trabajo",
        field: "trabajo"
      },
      {
        title: "Educacion",
        field: "educacion"
      }
    ];

    return (
      <React.Fragment>
        <Mayre
          of={
            <div style={{ width: "100%" }}>
              <MaterialTable
                icons={tableIcons}
                title="Pacientes"
                columns={columns}
                data={this.state.list}
                isLoading={this.state.isLoading}
                localization={pagination}
              />
            </div>
          }
          or={
            <Dialog
              handleClickOpen={this.handleClickOpen}
              handleClose={this.handleClose}
              vals={this.state}
            />
          }
          when={!hide}
        />

        <Mayre
          of={
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleClickOpen2}
            >
              Dialogo
            </Button>
          }
          or={
            <PacientHistory
              handleClickOpen={this.handleClickOpen2}
              handleClose={this.handleClose2}
              vals={vals}
            />
          }
          when={!hide}
        />
      </React.Fragment>
    );
  }
}

export default Pacients;
