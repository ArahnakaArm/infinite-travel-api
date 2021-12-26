import Drawer from "../../components/Drawer";
import React, { useEffect, useState, createRef, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import uuid from "react-uuid";
import withReactContent from "sweetalert2-react-content";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@mui/material/FormHelperText";
import CallHttp from "../../services/callHttp";
import CallHttpMultipart from "../../services/callHttpMultipart";
import AddIcon from "@mui/icons-material/Add";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ConvertDateTimeToApi from "../../services/convertDateTimeToApi";
import Swal from "sweetalert2";

function CreateFlightPage(props) {
  const { history } = props;
  const [width, setWindowWidth] = useState(1000);
  const MySwal = withReactContent(Swal);
  /* 
  const [isInvalidTitle, setIsInvalidTitle] = React.useState(false);
  const [isInvalidParagraph, setIsInvalidParagraph] = React.useState(false);
  const [isInvalidAuthor, setIsInvalidAuthor] = React.useState(false);
  const [isInvalidImg, setIsInvalidImg] = React.useState(false); */

  const [flightName, setFlightName] = React.useState("");

  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");

  const [planes, setPlanes] = useState([]);
  const [selectedPlane, setSelectedPlane] = useState("");

  const [origins, setOrigins] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState("");

  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");

  const [minArriveTime, setMinArriveTime] = useState("");

  const [departmentTime, setDepartmentTime] = useState("");
  const [arriveTime, setArriveTime] = useState("");

  const [isInvalidFlightname, setIsInvalidFlightname] = React.useState(false);
  const [isInvalidSelectedAirline, setIsInvalidSelectedAirline] = React.useState(false);
  const [isInvalidSelectedPlane, setIsInvalidSelectedPlane] = React.useState(false);
  const [isInvalidSelectedOrigin, setIsInvalidSelectedOrigin] = React.useState(false);
  const [isInvalidSelectedDestination, setIsInvalidSelectedDestination] = React.useState(false);
  const [isInvalidDepartmentTime, setIsInvalidDepartmentTime] = React.useState(false);
  const [isInvalidArriveTime, setIsInvalidArriveTime] = React.useState(false);

  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  window.addEventListener("resize", updateDimensions);

  var inputPropsErrorValidFlightName = {
    error: true,
    helperText: "Please Enter FlightName",
  };

  var inputPropsErrorValidAirline = {
    error: true,
    /*     helperText: "Please Select Airline", */
  };

  var inputPropsErrorValidPlane = {
    error: true,
    /*     helperText: "Please Select Plane", */
  };

  var inputPropsErrorValidOrigin = {
    error: true,
    /*   helperText: "Please Select Origin", */
  };

  var inputPropsErrorValidDestination = {
    error: true,
    /*  helperText: "Please Select Destination", */
  };

  var inputPropsErrorValidDepartmentTime = {
    error: true,
    helperText: "Please Select DepartmentTime",
  };

  var inputPropsErrorValidArriveTime = {
    error: true,
    helperText: "Please Select ArriveTime",
  };

  useEffect(() => {
    async function getAirlines() {
      const token = localStorage.getItem("token");
      let airlineRes = await CallHttp("GET", `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_AIRLINE}`, null, token);
      console.log(airlineRes);
      setAirlines(airlineRes.resultData);
    }

    async function getAirports() {
      const token = localStorage.getItem("token");
      let originRes = await CallHttp("GET", `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_AIRPORT}`, null, token);
      console.log(originRes);
      setOrigins(originRes.resultData);
    }

    getAirlines();
    getAirports();
  }, []);

  const onChangeFlightName = (event) => {
    setIsInvalidFlightname(false);
    setFlightName(event.target.value);
    /*     setIsInvalidTitle(false); */
  };

  const handleChangeAirline = async (event) => {
    setIsInvalidSelectedAirline(false);
    setSelectedPlane("");
    setSelectedAirline(event.target.value);
    const token = localStorage.getItem("token");
    let planeRes = await CallHttp("GET", `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}?airline_id=${event.target.value}`, null, token);
    console.log(planeRes);
    setPlanes(planeRes.resultData);
  };

  const handleChangePlane = async (event) => {
    setIsInvalidSelectedPlane(false);
    setSelectedPlane(event.target.value);
    /*     const token = localStorage.getItem("token");
    let planeRes = await CallHttp("GET", `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}`, null, token);
    console.log(planeRes);
    setPlanes(planeRes.resultData); */
  };

  const handleChangeOrigin = async (event) => {
    setSelectedDestination("");
    setIsInvalidSelectedOrigin(false);
    setSelectedOrigin(event.target.value);
    const token = localStorage.getItem("token");
    let airportRes = await CallHttp("GET", `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_AIRPORT}?exclude=${event.target.value}`, null, token);
    console.log(airportRes);
    setDestinations(airportRes.resultData);
  };

  const handleChangeDestination = async (event) => {
    setIsInvalidSelectedDestination(false);
    setSelectedDestination(event.target.value);
  };

  const handleChangeDepartmentTime = async (event) => {
    setIsInvalidDepartmentTime(false);
    const timeString = event.target.value;
    setMinArriveTime(timeString);
    setDepartmentTime(ConvertDateTimeToApi(timeString));
  };

  const handleChangeArriveTime = async (event) => {
    setIsInvalidArriveTime(false);
    const timeString = event.target.value;
    setArriveTime(ConvertDateTimeToApi(timeString));
  };

  const isValidFlight = () => {
    if (flightName === "" || selectedAirline === "" || selectedPlane === "" || selectedOrigin === "" || selectedDestination === "" || departmentTime === "" || arriveTime === "") {
      if (flightName === "") setIsInvalidFlightname(true);
      if (selectedAirline === "") setIsInvalidSelectedAirline(true);
      if (selectedPlane === "") setIsInvalidSelectedPlane(true);
      if (selectedOrigin === "") setIsInvalidSelectedOrigin(true);
      if (selectedDestination === "") setIsInvalidSelectedDestination(true);
      if (departmentTime === "") setIsInvalidDepartmentTime(true);
      if (arriveTime === "") setIsInvalidArriveTime(true);
      return false;
    } else {
      return true;
    }
  };

  const createFlight = async () => {
    if (!isValidFlight()) {
      console.log("INVALID");
      return;
    }

    const token = localStorage.getItem("token");
    let createFlightRes = await CallHttp(
      "POST",
      `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_FLIGHT}`,
      {
        airline_id: selectedAirline,
        plane_id: selectedPlane,
        destination_airport_id: selectedDestination,
        origin_airport_id: selectedOrigin,
        flight_name: flightName,
        depart_time: departmentTime,
        arrive_time: arriveTime,
      },
      token
    );

    console.log(createFlightRes);

    if (!createFlightRes) {
      MySwal.fire({
        icon: "error",
        title: <p>Please try again</p>,
      }).then((result) => {});
    } else if (createFlightRes.resultCode === "20100") {
      MySwal.fire({
        icon: "success",
        title: <p>New Flight has been add !!!</p>,
      }).then((result) => {
        history.push("/flight/");
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: <p>Please try again</p>,
      }).then((result) => {});
    }
  };

  const postFlight = async () => {};

  return (
    <>
      <div style={{ marginLeft: width <= 600 ? 0 : 180, width: "100%", height: "100%" }}>
        <Drawer />
        <Grid>
          <Grid item xs={4} md={8}>
            <Card sx={{ minWidth: 275, marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Create Flight
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="h6" component="div">
                  Flight Name
                </Typography>
                <Grid item xs={4} md={10}>
                  <TextField
                    {...(isInvalidFlightname && { ...inputPropsErrorValidFlightName })}
                    id="flight_name"
                    label="Enter FlightName"
                    variant="standard"
                    fullWidth
                    value={flightName}
                    onChange={(e) => {
                      onChangeFlightName(e);
                    }}
                  />
                </Grid>
                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Airline & Plane
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={5} md={5}>
                    <FormControl variant="standard" fullWidth {...(isInvalidSelectedAirline && { ...inputPropsErrorValidAirline })}>
                      <InputLabel id="demo-simple-select-label">Select Airline</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedAirline} onChange={handleChangeAirline}>
                        {airlines.map((item) => (
                          <MenuItem key={item.airline_id} value={item.airline_id}>
                            <Grid container spacing={1}>
                              <Grid item>
                                <img src={item.img_url} style={{ height: 20, width: 50 }} alt="airlineImg" />
                              </Grid>
                              <Grid item>
                                <Box sx={{}}>{item.airline_name}</Box>
                              </Grid>
                            </Grid>
                          </MenuItem>
                        ))}
                      </Select>
                      {isInvalidSelectedAirline && <FormHelperText>Please Select Airline</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={5} md={5}>
                    <FormControl variant="standard" fullWidth {...(isInvalidSelectedPlane && { ...inputPropsErrorValidPlane })}>
                      <InputLabel id="demo-simple-select-label">Select Plane</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedPlane} onChange={handleChangePlane}>
                        {planes.map((item) => (
                          <MenuItem key={item.plane_id} value={item.plane_id}>
                            {item.plane_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {isInvalidSelectedPlane && <FormHelperText>Please Select Plane</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Origin & Destination
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={5} md={5}>
                    <FormControl variant="standard" fullWidth {...(isInvalidSelectedOrigin && { ...inputPropsErrorValidOrigin })}>
                      <InputLabel id="demo-simple-select-label">Select Origin</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedOrigin} onChange={handleChangeOrigin}>
                        {origins.map((item) => (
                          <MenuItem key={item.airport_id} value={item.airport_id}>
                            {item.airport_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {isInvalidSelectedOrigin && <FormHelperText>Please Select Origin</FormHelperText>}
                    </FormControl>
                  </Grid>

                  <Grid item xs={5} md={5}>
                    <FormControl variant="standard" fullWidth {...(isInvalidSelectedDestination && { ...inputPropsErrorValidDestination })}>
                      <InputLabel id="demo-simple-select-label">Select Destination</InputLabel>
                      <Select labelId="demo-simple-select-label" id="demo-simple-select" value={selectedDestination} onChange={handleChangeDestination}>
                        {destinations.map((item) => (
                          <MenuItem key={item.airport_id} value={item.airport_id}>
                            {item.airport_name}
                          </MenuItem>
                        ))}
                      </Select>
                      {isInvalidSelectedDestination && <FormHelperText>Please Select Destination</FormHelperText>}
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Department Time
                </Typography>
                <Grid item xs={4} md={10}>
                  <Box sx={{ minHeight: 15 }}></Box>
                  <TextField
                    {...(isInvalidDepartmentTime && { ...inputPropsErrorValidDepartmentTime })}
                    InputProps={{ inputProps: { min: "2021-12-24T00:00", max: "2022-05-04T00:00" } }}
                    id="datetime-local"
                    label="Department Time"
                    type="datetime-local"
                    onChange={handleChangeDepartmentTime}
                    defaultValue=""
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Arrive Time
                </Typography>
                <Grid item xs={4} md={10}>
                  <Box sx={{ minHeight: 15 }}></Box>
                  <TextField
                    {...(isInvalidArriveTime && { ...inputPropsErrorValidArriveTime })}
                    InputProps={{ inputProps: { min: minArriveTime, max: "2022-05-04T00:00" } }}
                    id="datetime-local"
                    label="Arrive Time"
                    type="datetime-local"
                    onChange={handleChangeArriveTime}
                    defaultValue=""
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Box sx={{ minHeight: 5 }}></Box>
              </CardContent>
              <Divider sx={{ marginTop: 2 }} />
              <CardActions
                disableSpacing
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button size="small" variant="contained" onClick={createFlight}>
                  Create Flight
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default CreateFlightPage;
