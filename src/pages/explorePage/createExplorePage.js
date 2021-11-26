import Drawer from "../../components/Drawer";
import React, { useEffect, useState, createRef, useRef, useCallback } from "react";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { minWidth } from "@mui/system";
import uuid from 'react-uuid'

function CreateExplorePage() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [width, setWindowWidth] = useState(1000);
    const [openCropDialog, setOpenCropDialog] = React.useState(false);
    const imagePreviewCanvasRef = React.createRef();
    const [pixelCrop, setPixelCrop] = useState(null);
    const fileInputRef = React.createRef()

    const [upImg, setUpImg] = useState();
    const [extFile, setExtFile] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
    const [completedCrop, setCompletedCrop] = useState(null);


    useEffect(() => {
        console.log("TSTTT")
    }, []);

    /* useEffect(() => {
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
    }, [completedCrop]);

 */
    const handleDownloadClick = (event) => {
        event.preventDefault()
        const canvasRef = previewCanvasRef.current
        const imageData64 = canvasRef.toDataURL('image/png')
        const myFilename = uuid() + "." + 'png';


        const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
        console.log(myNewCroppedFile)

        var data = new FormData()
        data.append('file', myNewCroppedFile)


        fetch(`${process.env.REACT_APP_BASE_URL}upload/profileImage`, {
            method: 'POST',
            body: data
        })
            .then(res => res.json())
            .then(
                (result) => {


                },
                (error) => {

                }
            )

    }

    function base64StringtoFile(base64String, filename) {
        var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
    }


    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)

    }
    window.addEventListener("resize", updateDimensions)
    /*     const [crop, setCrop] = useState({ aspect: 16 / 9 }); */



    /* const fileSelectedHandler = (event) =>{
        console.log("----------------" + event.target.files[0])
        const myFileItemReader = new FileReader()   
        if(event.target.files[0]){
            myFileItemReader.addEventListener("load", ()=>{
                // console.log(myFileItemReader.result)
                const myResult = myFileItemReader.result
                setSelectedFile(myResult)
            }, false)
            myFileItemReader.readAsDataURL(event.target.files[0])
            openCropDialogHandler()
        }
    
    } */

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setExtFile(e.target.files[0].type.toString().slice(e.target.files[0].type.toString().indexOf("image/") + ("image/").length))
            const reader = new FileReader();
            reader.addEventListener('load', () => setUpImg(reader.result));
            reader.readAsDataURL(e.target.files[0]);
            openCropDialogHandler()
        }
        else {
            console.log("DAWAFAWF")
        }
    };


    const openCropDialogHandler = () => {
        setOpenCropDialog(true)
    }

    const closeCropDialogHandler = () => {
        setSelectedFile(null)
        setOpenCropDialog(false)
    }

    const handleOnCropComplete = (crop, pixelCrop) => {
        /*  setPixelCrop(pixelCrop)
         console.log(pixelCrop) */

    }

    const handleOnCropChange = (crop) => {
        setPixelCrop(crop)


    }

    const confirmCropDialogHandler = () => {
        setOpenCropDialog(false)
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
        /*     const canvasRef = imagePreviewCanvasRef.current
            image64toCanvasRef(canvasRef, selectedFile, crop) */
    }


    const fileUploadHandler = (event) => {
        /*   setSelectedFile(event.target.files[0])
          console.log(event.target.files[0]); */
    }

    const confirmCropHandler = () => {
        console.log(crop)
    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);


    /*   function image64toCanvasRef(canvasRef, image64, pixelCrop) {
          const canvas = canvasRef 
          canvas.width = pixelCrop.width
          canvas.height = pixelCrop.height
          const ctx = canvas.getContext('2d')
          const image = new Image()
          image.src = image64
          image.onload = function () {
              ctx.drawImage(
                  image,
                  pixelCrop.x,
                  pixelCrop.y,
                  pixelCrop.width,
                  pixelCrop.height,
                  0,
                  0,
                  pixelCrop.width,
                  pixelCrop.height
              )
          }
      } */


    return (<>
        <div style={
            { marginLeft: width <= 600 ? 0 : 180, width: '100%', height: '100%' }}>
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
                                Add New Explore
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                            >
                                Upload File
                                <input onChange={onSelectFile} onClick={(event) => {
                                    event.target.value = null
                                }}
                                    type="file"
                                    hidden
                                />
                            </Button>
                            <Typography variant="body2">
                                well meaning and kindly.
                                <br />
                                {'"a benevolent smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={handleDownloadClick}>Learn More</Button>
                        </CardActions>
                        <div>  {crop !== null ? <canvas
                            ref={previewCanvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0)
                            }}
                        /> : <div></div>}</div>

                    </Card>
                </Grid>
            </Grid>

        </div>
    </>)

}

export default CreateExplorePage