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
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import uuid from 'react-uuid'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from '@mui/material/FormHelperText';
import CallHttp from "../../services/callHttp";
import CallHttpMultipart from "../../services/callHttpMultipart";


function CreateExplorePage(props) {
    const { history } = props;
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
    const [explore, setExplore] = useState({ title: "", paragraph: "", author: "", imageUrl: "" })
    let tempImgUrl = '';
    const [isChoosedImg, setIsChoosedImg] = useState(false);
    const MySwal = withReactContent(Swal)

    const [isInvalidTitle, setIsInvalidTitle] = React.useState(false);
    const [isInvalidParagraph, setIsInvalidParagraph] = React.useState(false);
    const [isInvalidAuthor, setIsInvalidAuthor] = React.useState(false);
    const [isInvalidImg, setIsInvalidImg] = React.useState(false);

    const useStyles = makeStyles({
        root: {
            "& .MuiFormHelperText-root": {
                marginLeft: 0
            }
        }
    });

    const classes = useStyles();


    var inputPropsErrorValidTitle = {
        error: true,
        helperText: "Please Enter Title"
    };


    var inputPropsErrorValidParagraph = {
        error: true,
        helperText: "Please Enter Paragraph",
        marginLeft: 0
    };

    var inputPropsErrorValidAuthor = {
        error: true,
        helperText: "Please Enter Author"
    };



    useEffect(() => {
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
        /*    if(!isChoosedImg)  tempImgUrl = "" */
        setExplore({ ...explore, imageUrl: "" })
        setOpenCropDialog(false)
    }

    const handleOnCropComplete = (crop, pixelCrop) => {
        /*  setPixelCrop(pixelCrop)
         console.log(pixelCrop) */

    }

    const handleOnCropChange = (crop) => {
        setPixelCrop(crop)
    }

    const onChangeTitle = (event) => {
        setExplore({ ...explore, title: event.target.value })
        setIsInvalidTitle(false)
    }

    const onChangeParagraph = (event) => {
        setExplore({ ...explore, paragraph: event.target.value })
        setIsInvalidParagraph(false)
    }

    const onChangeAuthor = (event) => {
        setExplore({ ...explore, author: event.target.value })
        setIsInvalidAuthor(false)
    }

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
        /*     const canvasRef = imagePreviewCanvasRef.current
            image64toCanvasRef(canvasRef, selectedFile, crop) */
    }

    const upLoadImg = async () => {
        /*    event.preventDefault() */
        const canvasRef = previewCanvasRef.current
        const imageData64 = canvasRef.toDataURL('image/png')
        const myFilename = uuid() + "." + 'png';


        const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)


        var data = new FormData()
        data.append('file', myNewCroppedFile)
        const token = localStorage.getItem("token")

        let uploadImageRes = await CallHttpMultipart('POST', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_UPLOAD}${process.env.REACT_APP_URL_PATH_UPLOAD_EXPLORE}`,
            data, token
        )

        if (!uploadImageRes) {
            return null
        }

        /*   let uploadImageRes = await fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_UPLOAD}${process.env.REACT_APP_URL_PATH_UPLOAD_EXPLORE}`, {
              method: 'POST',
              body: data
          }); */

        return uploadImageRes.resultData.path
        /*  fetch(`${process.env.REACT_APP_BASE_URL}upload/profileImage`, {
             method: 'POST',
             body: data
         })
             .then(res => res.json())
             .then(
                 (result) => {
 
 
                 },
                 (error) => {
 
                 }
             ) */
    }

    const createExplore = async () => {
        tempImgUrl = "chosedImg"
        if (!validated()) {

            return
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


        const token = localStorage.getItem("token")

        let createExploreRes = await CallHttp('POST', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}`,
            {
                title: explore.title,
                paragraph: explore.paragraph,
                author: explore.author,
                image_url: imgPath
            },
            token
        )

        /*      let createExplore = await fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     title: explore.title,
                     paragraph: explore.paragraph,
                     author: explore.author,
                     image_url: tempImgUrl
                 })
             });
      */



        /*  const createExploreRes = await createExplore.json() */

        if (!createExploreRes) {
            MySwal.fire({
                icon: 'error',
                title: <p>Please try again</p>,

            }).then((result) => {

            })
        }

        if (createExploreRes.resultCode === '20100') {
            MySwal.fire({
                icon: 'success',
                title: <p>New Explore has been add !!!</p>,

            }).then((result) => {
                history.push("/explore/")
            })
        }


    }

    const validated = () => {
        if (explore.title === "" || explore.paragraph === "" || explore.author === "" || completedCrop === null) {
            if (explore.title === "") setIsInvalidTitle(true)
            if (explore.paragraph === "") setIsInvalidParagraph(true)
            if (explore.author === "") setIsInvalidAuthor(true)
            if (completedCrop === null) setIsInvalidImg(true)


            return false
        }
        else return true
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
                            <Typography variant="h5" component="div" >
                                Add New Explore
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                            <Typography variant="h6" component="div" >
                                Title
                            </Typography>
                            <Grid item xs={4} md={10}>
                                <TextField
                                    {...isInvalidTitle && { ...inputPropsErrorValidTitle }}
                                    id="title"
                                    label="Enter Title"
                                    variant="standard"
                                    fullWidth
                                    value={explore.title}
                                    onChange={(e) => { onChangeTitle(e) }} />
                            </Grid>
                            <Box sx={{ minHeight: 10 }}  ></Box>
                            <Typography variant="h6" component="div" >
                                Paragraph
                            </Typography>

                            <Grid item xs={4} md={10}>
                                <TextField
                                    {...isInvalidParagraph && { ...inputPropsErrorValidParagraph }}
                                    placeholder="Enter Paragraph"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    rowsMax={4}
                                    value={explore.paragraph} onChange={(e) => { onChangeParagraph(e) }}
                                    className={classes.root}
                                />
                            </Grid>

                            <Box sx={{ minHeight: 10 }}></Box>
                            <Typography variant="h6" component="div" >
                                Author
                            </Typography>
                            <Grid item xs={4} md={10}>
                                <TextField
                                    {...isInvalidAuthor && { ...inputPropsErrorValidAuthor }}
                                    id="author"
                                    label="Enter Author"
                                    variant="standard"
                                    fullWidth
                                    value={explore.author}
                                    onChange={(e) => { onChangeAuthor(e) }} />
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
                        </CardContent>
                        <Divider sx={{ marginTop: 2 }} />
                        <CardActions>
                            <Button size="small" variant="contained" onClick={createExplore}>Create Explore</Button>
                        </CardActions>


                    </Card>
                </Grid>
            </Grid>

        </div>
    </>)

}

export default CreateExplorePage