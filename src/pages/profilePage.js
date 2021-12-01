import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Drawer from "../components/Drawer";
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
import CallHttp from "../services/callHttp";
const profileImgHolder = require('../assets/images/profile-image-placeholder.jpg').default;

function ProfilePage(props) {
    const [width, setWindowWidth] = useState(1000);
    const [profileImg , setProfileImg] = useState(null)

    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)

    }


    useEffect(() => {
        getProfile();
    }, [])




    const getProfile = async () => {
        const token = localStorage.getItem("token")
        let profileRes = await CallHttp('GET',`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_USER_BY_ME}`,
        null,token)

        console.log(profileRes)
        setProfileImg(profileRes.resultData.profile_url)
    }


    window.addEventListener("resize", updateDimensions)
    return (
        <div style={
            { marginLeft: width <= 600 ? 0 : 180, width: '100%', height: '100%' }}>
            <Drawer />
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
                                <Box
                                    component="img"
                                    sx={{
                                        borderRadius: 70,
                                        height: 140,
                                        width: 140,
                                        maxHeight: { xs: 140, md: 140 },
                                        maxWidth: { xs: 140, md: 140 },
                                    }}
                                    alt="Profile Image"
                                    src={profileImg !== null ? profileImg :  profileImgHolder  }
                                />
                            </div>
                            <Box sx={{ minHeight: 15 }}></Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        id="firstname"
                                        label="Firstname"
                                        variant="standard"
                                        value="firstName"
                                        fullWidth
                                    />

                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        id="lastname"
                                        label="Lastname"
                                        variant="standard"
                                        value="lastName"
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
                            <Button startIcon={<CreateIcon />} size="small" variant="contained" onClick={getProfile} >Save</Button>
                        </CardActions>


                    </Card>
                </Grid>
            </Grid>


        </div>
    )

}

export default ProfilePage;