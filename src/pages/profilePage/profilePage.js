import { useParams } from 'react-router-dom';
import React, { useEffect, useState, createRef, useRef, useCallback } from "react";
import Drawer from "../../components/Drawer";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CreateIcon from '@mui/icons-material/Create';
import CallHttp from "../../services/callHttp";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import uuid from 'react-uuid'
import CallHttpMultipart from '../../services/callHttpMultipart';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const profileImgHolder = require('../../assets/images/profile-image-placeholder.jpg').default;

function ProfilePage(props) {
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [width, setWindowWidth] = useState(1000);
    const [profileImg, setProfileImg] = useState(null)
    const [upImg, setUpImg] = useState();
    const [selectedFile, setSelectedFile] = useState(null)
    const [openCropDialog, setOpenCropDialog] = React.useState(false);
    const [isChoosedImg, setIsChoosedImg] = useState(false);
    const previewCanvasRef = useRef(null);
    let tempImgUrl = '';
    const [extFile, setExtFile] = useState();
    const imgRef = useRef(null);
    const MySwal = withReactContent(Swal)
    const [profileName, setProfileName] = useState({ firstname: '', lastname: '' })

    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)

    }

    window.addEventListener("resize", updateDimensions)

    const onChangeFirstName = (event) => {

        /*    if (event.target.value.length < 6) {
               setIsInvalidUsername(true)
           }
           else {
               setIsInvalidUsername(false)
           } */
        setProfileName({ ...profileName, firstname: event.target.value })
    };



    const onChangeLastName = (event) => {

        /*   if (event.target.value.length < 6) {
              setIsInvalidUsername(true)
          }
          else {
              setIsInvalidUsername(false)
          } */
        setProfileName({ ...profileName, lastname: event.target.value })
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
        /*    setExplore({ ...explore, imageUrl: "" }) */
        setOpenCropDialog(false)
    }





    useEffect(() => {
        getProfile();
    }, [])




    const getProfile = async () => {
        const token = localStorage.getItem("token")
        let profileRes = await CallHttp('GET', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_USER_BY_ME}`,
            null, token)

        console.log(profileRes)
        setProfileName({ ...profileName, firstname: profileRes.resultData.first_name, lastname: profileRes.resultData.last_name })
        setProfileImg(profileRes.resultData.profile_url)

    }

    const onSelectFile = (e) => {
        console.log(e)
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

        /*         setIsInvalidImg(true) */

    }

    const onLoad = useCallback((img) => {
        imgRef.current = img;
    }, []);


    function base64StringtoFile(base64String, filename) {
        var arr = base64String.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
    }



    const upLoadImg = async () => {

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
        return uploadImageRes.resultData.path
    }


    const updateUser = async () => {
        tempImgUrl = "chosedImg"

        let imgPath = ''

        if (isChoosedImg) {
            imgPath = await upLoadImg()

            if (!imgPath) {
                MySwal.fire({
                    icon: 'error',
                    title: <p>Please try again</p>,

                }).then((result) => {

                })

                return
            }

        }



        const token = localStorage.getItem("token")

        const updateObj = {
            profile_url: imgPath,
            first_name: profileName.firstname,
            last_name: profileName.lastname
        }

        if (!isChoosedImg) {
            delete updateObj.profile_url
        }

        let updateUserRes = await CallHttp('PATCH', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_PATCH_USER}`,
            updateObj,
            token
        )

        if (!updateUserRes) {
            MySwal.fire({
                icon: 'error',
                title: <p>Please try again</p>,

            }).then((result) => {

            })
        }

        if (updateUserRes.resultCode === '20000') {
            MySwal.fire({
                icon: 'success',
                title: <p>Data has been change !!!</p>,

            }).then((result) => {
                /*                history.push("/explore/") */
            })
        }


    }







    
    return (
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
                <Grid item xs={4} md={6}>
                    <Card sx={{ minWidth: 275, marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h5" component="div" >
                                Profile
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>

                                <Typography
                                    component="div"
                                    variant="body1"
                                    style={{
                                        height: 100,
                                        width: '100%',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {completedCrop !== null ? <canvas
                                        ref={previewCanvasRef}
                                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            borderRadius: 70,
                                            width: Math.round(140 ?? 0),
                                            height: Math.round(140 ?? 0)
                                        }}
                                    /> : <Box
                                        component="img"
                                        sx={{
                                            borderRadius: 70,
                                            height: 140,
                                            width: 140,
                                            maxHeight: { xs: 140, md: 140 },
                                            maxWidth: { xs: 140, md: 140 },
                                            position: 'absolute',
                                            top: 0,

                                            zIndex: 'mobile stepper',
                                        }}
                                        alt="Profile Image"
                                        src={profileImg !== null ? profileImg : profileImgHolder}


                                    />}
                                    <Box
                                        sx={{
                                            bgcolor: 'primary',
                                            color: 'text.primary',
                                            position: 'absolute',
                                            top: 0,
                                            zIndex: 'mobile stepper',
                                        }}
                                    >
                                        <div style={{
                                            position: 'relative',
                                            top: 110,
                                            left: 45,
                                            width: 25,
                                            height: 25,
                                            borderRadius: 50,
                                            background: 'grey'
                                        }} >
                                            <CreateIcon style={{
                                                width: '80%', height: '80%',
                                                position: 'absolute',
                                                top: '50%',
                                                left: ' 50%',
                                                transform: 'translate(-50%, -50%)'
                                            }} />
                                            <input type="file" onChange={onSelectFile} onClick={(event) => {
                                                event.target.value = null
                                            }} style={{
                                                opacity: 0.0,
                                                position: 'absolute',
                                                top: 0,
                                                left: 0, bottom: 0, right: 0, width: '100%', height: '100%'
                                            }} />
                                        </div>

                                    </Box>
                                </Typography>



                            </div>
                            <Box sx={{ minHeight: 60 }}></Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        id="firstname"
                                        label="Firstname"
                                        variant="standard"
                                        value={profileName.firstname}
                                        onChange={(e) => { onChangeFirstName(e) }}
                                        fullWidth
                                    />

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        id="lastname"
                                        label="Lastname"
                                        variant="standard"
                                        value={profileName.lastname}
                                        onChange={(e) => { onChangeLastName(e) }}
                                        fullWidth

                                    />
                                </Grid>

                                <Grid item xs={6} md={6}>
                                    <TextField
                                        id="role"
                                        label="Role"
                                        variant="standard"
                                        value="Admin"
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                            </Grid>



                        </CardContent>
                        <Divider sx={{ marginTop: 2 }} />
                        <CardActions disableSpacing sx={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <Button startIcon={<CreateIcon />} size="small" variant="contained" onClick={updateUser} >Save</Button>
                        </CardActions>


                    </Card>
                </Grid>
            </Grid>


        </div>
    )

}

export default ProfilePage;