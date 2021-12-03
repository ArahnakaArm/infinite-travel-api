import React, { useEffect, useState } from "react";
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
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function ChangePasswordPage(props) {
    const [width, setWindowWidth] = useState(1000);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [invalidPassword, setInvalidPassword] = useState(false)
    const [invalidNewPassword, setInvalidNewPassword] = useState(false)
    const [invalidCFPassword, setInvalidCFPassword] = useState(false)
    const [invalidCF, setInvalidCF] = useState(false)
    const MySwal = withReactContent(Swal)
    const updateDimensions = () => {
        const width = window.innerWidth
        setWindowWidth(width)
    }
    window.addEventListener("resize", updateDimensions)

    const onChangeOldPassword = (e) => {
        if (e.target.value.length < 8) setInvalidPassword(true)
        else setInvalidPassword(false)
        setOldPassword(e.target.value)
    }

    const onChangeNewPassword = (e) => {
        console.log(e.target.value.length)
        if (e.target.value.length < 8) setInvalidNewPassword(true)
        else {
            setInvalidNewPassword(false)
     
        }
        setNewPassword(e.target.value)
    }

    const onChangeConfirmNewPassword = (e) => {
        if (e.target.value.length < 8) setInvalidCFPassword(true)
        else {
            setInvalidCFPassword(false)
      
        }

        setConfirmNewPassword(e.target.value)
    }


    var inputPropsErrorValidOldPassword = {
        error: true,
        helperText: "Old password must be atleast 8 characters"
    };

    var inputPropsErrorValidNewPassword = {
        error: true,
        helperText: "New password must be atleast 8 characters"
    };

    var inputPropsErrorValidConfirmNewPassword = {
        error: true,
        helperText: "Confirm new password must be atleast 8 characters"
    };

    var inputPropsErrorValidSameCF = {
        error: true,
        helperText: "New password & Confirm new password must be the same"
    };


    const validated = () => {

        if (oldPassword === '' || newPassword === '' || confirmNewPassword === '') {
            if(oldPassword === '') setInvalidPassword(true)
            if(newPassword === '') setInvalidNewPassword(true)
            if(confirmNewPassword === '') setInvalidCFPassword(true)
            return false
        }
        else return true
    }



    const changePassword = async () => {
        if(!validated()){
            return
        }

        if(newPassword !== confirmNewPassword){
            MySwal.fire({
                icon: 'error',
                title: <p>New password and Confirm new password must be the same</p>,

            }).then((result) => {

            })

            return
        } 

        const token = localStorage.getItem("token")

        const changePassBody = {
            old_password: oldPassword,
            new_password: newPassword
        }

        const changePasswordRes = await CallHttp('PUT', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_CHANGE_PASSWORD}`,
            changePassBody, token)

        if(changePasswordRes === null){
            MySwal.fire({
                icon: 'error',
                title: <p>Error occur pleas try again</p>,

            }).then((result) => {

            })

            return
        }

        if(changePasswordRes.resultCode === '40100'){
            MySwal.fire({
                icon: 'error',
                title: <p>Wrong password</p>,

            }).then((result) => {
            
            })
            return
        }

        if(changePasswordRes.resultCode === '20000'){
            MySwal.fire({
                icon: 'success',
                title: <p>Data has been change !!!</p>,

            }).then((result) => {
                setOldPassword('')
                setNewPassword('')
                setConfirmNewPassword('')
                
                setInvalidPassword(false)
                setInvalidNewPassword(false)
                setInvalidCFPassword(false)
            })
        }

    }




    return (
        <div style={
            { marginLeft: width <= 600 ? 0 : 180, width: '100%', height: '100%' }}>
            <Drawer />
            <Grid>
                <Grid item xs={4} md={6}>
                    <Card sx={{ minWidth: 275, marginLeft: 2, marginRight: 2, marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h5" component="div" >
                                Change Password
                            </Typography>
                            <Divider sx={{ marginTop: 2, marginBottom: 2 }} />


                            <Grid container spacing={2}>
                                <Grid item xs={6} md={8}>
                                    <TextField
                                        type='password'
                                        {...invalidPassword && { ...inputPropsErrorValidOldPassword }}
                                        id="oldpassword"
                                        label="Old password"
                                        variant="standard"
                                        value={oldPassword}
                                        onChange={(e) => onChangeOldPassword(e)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ minHeight: 25 }}></Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={8}>
                                    <TextField
                                        type='password'
                                        {...invalidNewPassword && { ...inputPropsErrorValidNewPassword }}
                                        {...invalidCF && { ...inputPropsErrorValidSameCF }}
                                        id="newpassword"
                                        label="New password"
                                        variant="standard"
                                        value={newPassword}
                                        onChange={(e) => onChangeNewPassword(e)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>
                            <Box sx={{ minHeight: 25 }}></Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={8}>
                                    <TextField
                                        type='password'
                                        {...invalidCFPassword && { ...inputPropsErrorValidConfirmNewPassword }}
                                        {...invalidCF && { ...inputPropsErrorValidSameCF }}
                                        id="confirmnewpassword"
                                        label="Confirm new password"
                                        variant="standard"
                                        value={confirmNewPassword}
                                        onChange={(e) => onChangeConfirmNewPassword(e)}
                                        fullWidth
                                    />
                                </Grid>
                            </Grid>

                        </CardContent>
                        <Divider sx={{ marginTop: 2 }} />
                        <CardActions disableSpacing sx={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <Button startIcon={<CreateIcon />} size="small" variant="contained" onClick={changePassword} >Change Password</Button>
                        </CardActions>


                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default ChangePasswordPage;