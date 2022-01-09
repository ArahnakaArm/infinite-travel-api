import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Pagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Drawer from "../../components/Drawer";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { height } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/system";
import ConvertDate from "../../services/convertDate";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const AvailableIcon = require("../../assets/icons/check.png").default;
const UnavailableIcon = require("../../assets/icons/close.png").default;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PlanePage(props) {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = React.useState(1);
  const [currentIdDelete, setCurrentIdDelete] = React.useState();
  const [currentTitleDelete, setCurrentTitleDelete] = React.useState();
  const [totalPage, setTotalPage] = React.useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const { history } = props;
  const [width, setWindowWidth] = useState(window.innerWidth);

  /*   const [width, setWindowWidth] = useState(1000); */
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
    console.log(width);
  };

  window.addEventListener("resize", updateDimensions);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}?offset=0&limit=6`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.resultData);
          if (result.totalCount % 6 === 0) setTotalPage(result.totalCount / 6);
          else setTotalPage(Math.floor(result.totalCount / 6 + 1));
          setIsLoaded(true);
    /*   setIsLoaded(false); */ 
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const getAllPlane = (offset, limit, method = "common") => {
    fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}?offset=${offset}&limit=${limit}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.resultData);
          if (result.totalCount % 6 === 0) setTotalPage(result.totalCount / 6);
          else setTotalPage(Math.floor(result.totalCount / 6 + 1));
          setIsLoaded(true);

          if (method === "delete") {
            setPage(1);
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    getAllPlane(6 * (value - 1), 6);

    console.log(value);
  };

  const handleCreateContentButton = (id) => {
    console.log(id);
  };

  const handleEditButton = (id) => {
    console.log(id);
  };

  const handleDeleteButton = (id, title) => {
    setCurrentTitleDelete(title);
    setCurrentIdDelete(id);
    console.log(id);
    handleClickOpenDeleteDialog();
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const confirmDeleteHandle = () => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };
    console.log("CF Delete");
    fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}${currentIdDelete}`, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          getAllPlane(0, 6, "delete");
          openSuccessAlert();
        },
        (error) => {}
      );
    setOpenDeleteDialog(false);
    setCurrentIdDelete();
  };

  const changeDateTimeFormat = (dateTime) => {
    let year = dateTime.toString().substring(0, 4);
    let month = dateTime.toString().substring(5, 7);
    let day = dateTime.toString().substring(8, 10);
    let time = dateTime.toString().substring(11, 16);
    return `${day}/${month}/${year} ${time}`;
  };

  const openSuccessAlert = () => {
    setOpen(true);
  };

  const handleCloseSuccessAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onChangeSearch = (event) => {
    setSearch(event.target.value);
    /*     setIsInvalidTitle(false); */
  };

  const searchPlane = async () => {
    console.log("Search");
    fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}?offset=0&limit=6&search=${search}`)
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.resultData);
          if (result.totalCount % 6 === 0) setTotalPage(result.totalCount / 6);
          else setTotalPage(Math.floor(result.totalCount / 6 + 1));
          setIsLoaded(true);

          console.log(result.resultData);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  if (error) {
    return (
      <div style={{ marginLeft: width <= 600 ? 0 : 180, width: "100%" }}>
        <Drawer />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSuccessAlert}>
          <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: "100%" }}>
            สำเร็จ !!
          </Alert>
        </Snackbar>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"ยืนยันการลบ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {currentIdDelete} คุณต้องการที่จะลบ {currentTitleDelete} ใช่หรือไม่ ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>ยกเลิก</Button>
            <Button onClick={confirmDeleteHandle} autoFocus>
              ลบ
            </Button>
          </DialogActions>
        </Dialog>

        <Box mr={3} ml={3} mt={3} sx={{ justifyContent: "center" }}></Box>

        <Box mr={3} ml={3} sx={{ justifyContent: "center" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">ลำดับ</TableCell>
                  <TableCell width="25%">ชื่อ Explore</TableCell>
                  <TableCell width="15%">ผู้เขียน</TableCell>
                  <TableCell width="15%">วัน-เวลา</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.exploreId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {item.exploreId}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.title}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {item.author}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {changeDateTimeFormat(item.created_at)}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Button onClick={() => handleCreateContentButton(item.exploreId)} color="info" variant="contained" startIcon={<AddCircleIcon />}>
                            Content
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Button onClick={() => handleEditButton(item.exploreId)} color="warning" variant="contained" startIcon={<CreateIcon />}>
                            แก้ไข
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Button onClick={() => handleDeleteButton(item.exploreId, item.title)} color="error" variant="contained" startIcon={<DeleteIcon />}>
                            ลบ
                          </Button>
                        </Grid>
                      </Grid>
                      {/*        <Box display="flex" justifyContent="space-between">
                                                <Button variant="contained" startIcon={<AddCircleIcon />}>เพิ่ม Content</Button>
                                                <Button variant="contained" startIcon={<CreateIcon />}>แก้ไข</Button>
                                                <Button variant="contained" startIcon={<DeleteIcon />}>ลบ</Button>
                                            </Box> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Grid container mt={5} direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Pagination color="primary" count={totalPage} page={page} onChange={handleChangePage} />
          </Grid>
        </Grid>
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div style={{ marginLeft: width <= 600 ? 0 : 0, width: "100%", height: "100vh", justifyContent: "center", alignItems: "center", display: "flex" }}>
        <Drawer />
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div style={{ marginLeft: width <= 600 ? 0 : 180, width: "100%" }}>
        <Drawer />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSuccessAlert}>
          <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: "100%" }}>
            Success !!
          </Alert>
        </Snackbar>
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Remove?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {currentIdDelete} Are you sure to remove {currentTitleDelete} ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={confirmDeleteHandle} autoFocus>
              Remove
            </Button>
          </DialogActions>
        </Dialog>

        <Box mr={3} ml={3} sx={{ justifyContent: "center" }}>
          <Grid container justifyContent="flex-end" spacing={2}>
            <Grid item>
              <TextField
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    searchPlane();
                  }
                }}
                onChange={onChangeSearch}
                value={search}
                sx={{ width: 200 }}
                label="Search"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        onClick={searchPlane}
                        sx={{
                          cursor: "pointer",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item>
              <Button
                onClick={() => {
                  history.push("/plane/create");
                }}
                color="info"
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Plane
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mr={3} ml={3} mt={2} sx={{ justifyContent: "center" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="10%">
                    <Typography variant="h7" component="h3">
                      Plane Name
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="h7" component="h3">
                      Plane Code
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="h7" component="h3">
                      Image
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography variant="h7" component="h3">
                      Airline
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    width="10%"
                  >
                    <Typography variant="h7" component="h3">
                      Model
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    width="10%"
                  >
                    <Typography variant="h7" component="h3">
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h7" component="h3">
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, i) => (
                  <TableRow key={item.plane_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {item.plane_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {item.plane_code}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <img src={item.img_url} style={{ width: 200, height: 100 }} alt="brand" />
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <img src={item.airline.img_url} style={{ width: 200, height: 100 }} alt="brand" />
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                      component="th"
                      scope="row"
                    >
                      {item.model}
                    </TableCell>

                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                      component="th"
                      scope="row"
                    >
                      <Box
                        component="img"
                        sx={{
                          height: 20,
                          width: 20,
                        }}
                        alt="status"
                        src={item.status === "active" ? AvailableIcon : UnavailableIcon}
                      />
                      {/*       {item.status} */}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Grid container spacing={0}>
                        <Grid item>
                          <Button onClick={() => handleEditButton(item.exploreId)} color="warning" variant="contained" startIcon={<CreateIcon />}>
                            Edit
                          </Button>
                        </Grid>
                        <Grid item md={1}></Grid>
                        <Grid item>
                          <Button onClick={() => handleDeleteButton(item.exploreId, item.title)} color="error" variant="contained" startIcon={<DeleteIcon />}>
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                      {/*        <Box display="flex" justifyContent="space-between">
                                                <Button variant="contained" startIcon={<AddCircleIcon />}>เพิ่ม Content</Button>
                                                <Button variant="contained" startIcon={<CreateIcon />}>แก้ไข</Button>
                                                <Button variant="contained" startIcon={<DeleteIcon />}>ลบ</Button>
                                            </Box> */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Grid sx={{ mb: 2 }} container mt={5} direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Pagination color="primary" count={totalPage} page={page} onChange={handleChangePage} />
          </Grid>
        </Grid>
      </div>
    );
  }

  /*      return (
             <div style={{marginTop: 70 , width : '100%' }}> 
              <Box mr={3} ml={3} mt={3}  sx={{ justifyContent: 'center' }}>
         
         
              </Box>
           <Box mr={3} ml={3}  sx={{ justifyContent: 'center' }}>
           <TableContainer component={Paper}>
             <Table  aria-label="simple table">
               <TableHead>
                 <TableRow>
                   <TableCell>Dessert (100g serving)</TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                 {items.map((item) => (
                   <TableRow
                     key={item.header}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                   >
                
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </TableContainer>
         
           </Box>
          
         
            
         
           </div>
            
           ); */
}
