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

function CreatePlanePage(props) {
  const { history } = props;
  const [width, setWindowWidth] = useState(1000);
  const MySwal = withReactContent(Swal);
  /* 
  const [isInvalidTitle, setIsInvalidTitle] = React.useState(false);
  const [isInvalidParagraph, setIsInvalidParagraph] = React.useState(false);
  const [isInvalidAuthor, setIsInvalidAuthor] = React.useState(false);
  const [isInvalidImg, setIsInvalidImg] = React.useState(false); */

  const [planeName, setPlaneName] = React.useState("");
  const [planeCode, setPlaneCode] = React.useState("");
  const [planeModel, setPlaneModel] = React.useState("");

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

  const [isInvalidPlanename, setIsInvalidPlanename] = React.useState(false);
  const [isInvalidPlanecode, setIsInvalidPlanecode] = React.useState(false);
  const [isInvalidPlanemodel, setIsInvalidPlanemodel] = React.useState(false);
  const [isInvalidSelectedAirline, setIsInvalidSelectedAirline] = React.useState(false);
  const [isInvalidSelectedPlane, setIsInvalidSelectedPlane] = React.useState(false);
  const [isInvalidSelectedOrigin, setIsInvalidSelectedOrigin] = React.useState(false);
  const [isInvalidSelectedDestination, setIsInvalidSelectedDestination] = React.useState(false);
  const [isInvalidDepartmentTime, setIsInvalidDepartmentTime] = React.useState(false);
  const [isInvalidArriveTime, setIsInvalidArriveTime] = React.useState(false);



  const [extFile, setExtFile] = useState();
  const [upImg, setUpImg] = useState();
  const [openCropDialog, setOpenCropDialog] = React.useState(false);
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const [isInvalidImg, setIsInvalidImg] = React.useState(false);
  const [isChoosedImg, setIsChoosedImg] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null)
  const imgRef = useRef(null);
  const [planeImg, setPlaneImg] = useState("");
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  let tempImgUrl = '';


  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
  };
  window.addEventListener("resize", updateDimensions);

  var inputPropsErrorValidPlaneName = {
    error: true,
    helperText: "Please Enter PlaneName",
  };

  var inputPropsErrorValidPlaneCode = {
    error: true,
    helperText: "Please Enter PlaneCode",
  };


  var inputPropsErrorValidPlaneModel = {
    error: true,
    helperText: "Please Enter PlaneModel",
  };


  var inputPropsErrorValidAirline = {
    error: true,
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

  const onChangePlaneName = (event) => {
    setIsInvalidPlanename(false);
    setPlaneName(event.target.value);
    /*     setIsInvalidTitle(false); */
  };


  const onChangePlaneCode = (event) => {
    setIsInvalidPlanecode(false);
    setPlaneCode(event.target.value);
    /*     setIsInvalidTitle(false); */
  };

  const onChangePlaneModel = (event) => {
    setIsInvalidPlanemodel(false);
    setPlaneModel(event.target.value);
    /*     setIsInvalidTitle(false); */
  };


  const handleChangeAirline = async (event) => {
    setIsInvalidSelectedAirline(false);
    setSelectedAirline(event.target.value);
  };


  const isValidFlight = () => {
    if (planeName === "" || selectedAirline === "" || planeCode === "" || planeModel === "" || completedCrop === null) {
      if (planeName === "") setIsInvalidPlanename(true);
      if (selectedAirline === "") setIsInvalidSelectedAirline(true);
      if (planeCode === "") setIsInvalidPlanecode(true)
      if (planeModel === "") setIsInvalidPlanemodel(true)
      if (completedCrop === null) setIsInvalidImg(true)
      return false;
    } else {
      return true;
    }
  };

  const createPlane = async () => {
    if (!isValidFlight()) {
      console.log("INVALID");
      return;
    }

    const imgPath = await upLoadImg()

    if (!imgPath) {
        MySwal.fire({
            icon: 'error',
            title: <p>Please try again</p>,

        }).then((result) => {

        })

        return
    }


  


    const token = localStorage.getItem("token");
    let createPlaneRes = await CallHttp(
      "POST",
      `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PLANE}`,
      {
        airline_id: selectedAirline,
        plane_name: planeName,
        plane_code : planeCode,
        status : "active",
        model : planeModel,
        img_url : imgPath
      },
      token
    );

    console.log(createPlaneRes);

    if (!createPlaneRes) {
      MySwal.fire({
        icon: "error",
        title: <p>Please try again</p>,
      }).then((result) => { });
    } else if (createPlaneRes.resultCode === "20100") {
      MySwal.fire({
        icon: "success",
        title: <p>New Plane has been add !!!</p>,
      }).then((result) => {
        history.push("/plane/");
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: <p>Please try again</p>,
      }).then((result) => { });
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setExtFile(e.target.files[0].type.toString().slice(e.target.files[0].type.toString().indexOf("image/") + ("image/").length))
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      openCropDialogHandler()
    }
    else {

    }
  };

  const openCropDialogHandler = () => {
    setOpenCropDialog(true)
  }

  const closeCropDialogHandler = () => {
    if (!isChoosedImg) {
      setCompletedCrop(null)
    }

    setSelectedFile(null)
    setPlaneImg("")
    setOpenCropDialog(false)
  }

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const confirmCropDialogHandler = () => {
    setOpenCropDialog(false)
    tempImgUrl = "chosedImg"
    console.log(tempImgUrl)
    setIsChoosedImg(true)

    console.log(completedCrop)
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    setIsInvalidImg(true)

  }

  const upLoadImg = async () => {

    const canvasRef = previewCanvasRef.current
    const imageData64 = canvasRef.toDataURL('image/png')
    const myFilename = uuid() + "." + 'png';


    const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)


    var data = new FormData()
    data.append('file', myNewCroppedFile)
    const token = localStorage.getItem("token")

    let uploadImageRes = await CallHttpMultipart('POST', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_UPLOAD}${process.env.REACT_APP_URL_PATH_UPLOAD_PLANE}`,
      data, token
    )

    if (!uploadImageRes) {
      return null
    }
    return uploadImageRes.resultData.path
  }

  function base64StringtoFile(base64String, filename) {
    var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }


  const postFlight = async () => { };

  return (
    <>
      <div style={{ marginLeft: width <= 600 ? 0 : 180, width: "100%", height: "100%" }}>
        <Drawer />
        <div>
          <Dialog
            open={openCropDialog}
            onClose={closeCropDialogHandler}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Crop Image"}
            </DialogTitle>
            <DialogContent>

              <ReactCrop
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeCropDialogHandler} autoFocus>
                Cancel
              </Button>
              <Button onClick={confirmCropDialogHandler} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Grid>
          <Grid item xs={4} md={8}>
            <Card sx={{ minWidth: 275, marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Create Plane
                </Typography>
                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Typography variant="h6" component="div">
                  Plane Name
                </Typography>
                <Grid item xs={4} md={10}>
                  <TextField
                    {...(isInvalidPlanename && { ...inputPropsErrorValidPlaneName })}
                    id="plane_name"
                    label="Enter PlaneName"
                    variant="standard"
                    fullWidth
                    value={planeName}
                    onChange={(e) => {
                      onChangePlaneName(e);
                    }}
                  />
                </Grid>
                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Plane Code
                </Typography>
                <Grid item xs={4} md={10}>
                  <TextField
                    {...(isInvalidPlanecode && { ...inputPropsErrorValidPlaneCode })}
                    id="plane_code"
                    label="Enter PlanCode"
                    variant="standard"
                    fullWidth
                    value={planeCode}
                    onChange={(e) => {
                      onChangePlaneCode(e);
                    }}
                  />
                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Airline
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


                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div">
                  Model
                </Typography>
                <Grid item xs={4} md={4}>
                  <TextField
                    {...(isInvalidPlanemodel && { ...inputPropsErrorValidPlaneModel })}
                    id="plane_name"
                    label="Enter Model"
                    variant="standard"
                    fullWidth
                    value={planeModel}
                    onChange={(e) => {
                      onChangePlaneModel(e);
                    }}
                  />
                </Grid>

                <Box sx={{ minHeight: 10 }}></Box>
                <Typography variant="h6" component="div" >
                  Image
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                >
                  Select File
                  <input onChange={onSelectFile} onClick={(event) => {
                    event.target.value = null
                  }}
                    type="file"
                    hidden
                  />
                </Button>
                <Box sx={{ minHeight: 5 }}></Box>
                <div>  {completedCrop !== null ? <canvas
                  ref={previewCanvasRef}
                  // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                  style={{
                    width: Math.round(completedCrop?.width ?? 0),
                    height: Math.round(completedCrop?.height ?? 0)
                  }}
                /> : <div>  {isInvalidImg && <FormHelperText sx={{ color: '#d32f2f' }}>Please Select Image</FormHelperText>}</div>}
                </div>

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
                <Button size="small" variant="contained" onClick={createPlane}>
                  Create Plane
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default CreatePlanePage;
