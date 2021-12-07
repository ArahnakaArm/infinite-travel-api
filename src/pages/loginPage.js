import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core"
import { Button, TextField } from '@mui/material';
import auth from '../services/auth'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import LockIcon from '@mui/icons-material/Lock';
import CallHttp  from '../services/callHttp';

function LoginPage(props) {
    document.body.style.overflow = 'hidden';
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isInvalidUsername, setIsInvalidUsername] = React.useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [dialogErrMessage, setDialogErrMessage] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const { history } = props;


    useEffect(() => {
        if (auth.isAuthenticated()) {
            history.push("/explore")
        }
        /* 
                const listener = event => {
                    if ((event.code === "Enter" || event.code === "NumpadEnter") && dialogErrMessage === "") {
        
                         login()
                        document.getElementById("logInBut").click();
                        event.preventDefault();
        
                    }
                };
                document.addEventListener("keydown", listener); */
    }, [])



    const onChangeUsername = (event) => {

        if (event.target.value.length < 6) {
            setIsInvalidUsername(true)
        }
        else {
            setIsInvalidUsername(false)
        }
        setUsername(event.target.value)
    };

    const onChangePassword = (event) => {
        if (event.target.value.length < 6) {
            setIsInvalidPassword(true)
        }
        else {
            setIsInvalidPassword(false)
        }
        setPassword(event.target.value)
    };

    const login = () => {

        if (username === "" || password === ""){
            if(username === "") setIsInvalidUsername(true)
            if(password === "") setIsInvalidPassword(true)
            return
        }

        /*     localStorage.setItem("token", "asdasdas")
            auth.login(() => {
                
                history.push("/explore")
            }) */
        if (!isInvalidUsername && !isInvalidPassword && username !== "" && password !== "") {
    
            goLogin()
            /*    setUsername('')
               setPassword('') */
        }
   

    };

    const goLogin = async () => {

            const respone = await CallHttp('POST',`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_USER_LOGIN}`,
            {
                user_name: username,
                password: password
            })

            if (!respone) {
                console.log("NO RESP")
                return
            }


            if (respone.resultCode === "20000") {
                localStorage.setItem("token", respone.token)
                auth.login(() => {
                    history.push("/explore")
                })
            }

          

    /*     const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_name: username,
                password: password
            })
        };
        fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_USER_LOGIN}`, requestOptions)
            .then(res => res.json())
            .then(
                (result) => {

                    if (result.resultCode === "20000") {
                        localStorage.setItem("token", result.token)
                        auth.login(() => {
                            history.push("/explore")
                        })
                    }

                    if (result.resultCode === "40400") {
                        setDialogErrMessage("Not found user ,Please contract admin.")
                        handleClickOpen()
                    }
                    if (result.resultCode === "40100") {
                        setDialogErrMessage("Wrong password ,Please try again.")
                        setPassword('')
                        handleClickOpen()
                    }

                },
                (error) => {

                }
            ) */

    }

    var inputPropsErrorValidUsername = {
        error: true,
        helperText: "Invalid Username Format"
    };


    var inputPropsErrorValidPassword = {
        error: true,
        helperText: "Invalid Password Format"
    };

    if (!auth.isAuthenticated()) {
        return (
            <div>
                <div>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Warnning !!!"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {dialogErrMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} autoFocus>
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <Grid container style={{ minHeight: '100vh' }}>
                    <Grid item xs={12} sm={7}>
                        <img src="https://i.lagmcdn.com/latestappgames/20211124/1463457556457459712.jpeg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="brand" />
                    </Grid>
                    <Grid container item xs={12} sm={5} alignItems="center" direction="column" justifyContent="space-between" style={{ padding: 10 }}>
                        <div />
                        <div style={{ display: "flex", flexDirection: "column", maxWidth: 400, minWidth: 300 }}>
                            <Grid container justifyContent="center">
                                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/2560px-Genshin_Impact_logo.svg.png" width={350} alt="logo" />
                            </Grid>
                            <TextField  {...isInvalidUsername && { ...inputPropsErrorValidUsername }} label="Username" onChange={(e) => { onChangeUsername(e) }} size="small" margin="normal" value={username} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}></TextField>
                            <TextField  {...isInvalidPassword && { ...inputPropsErrorValidPassword }} label="Password" type="password" onChange={(e) => { onChangePassword(e) }} size="small" margin="dense" value={password} InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                            }}></TextField>
                            <div style={{ height: 10 }} />
                            <Button id="logInBut" color="primary" variant="contained" type="submit" onClick={login}>Log in</Button>

                        </div>
                        <div />
                    </Grid>

                </Grid>
            </div>

        )
    }
    else {
        return (<></>)
    }


}

export default LoginPage