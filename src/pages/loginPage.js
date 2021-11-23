import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core"
import { Button, TextField } from '@mui/material';
import auth from '../services/auth'

function LoginPage(props) {
    document.body.style.overflow = 'hidden';
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isInvalidUsername, setIsInvalidUsername] = React.useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = React.useState(false);
    const { history } = props;

    
  useEffect(() => {
    if(auth.isAuthenticated()){
        history.push("/explore")
    }
    }, [])

 

    const onChangeUsername = (event) => {
        console.log(event.target.value.length)
        if(event.target.value.length < 6){
            setIsInvalidUsername(true)
        }
        else{
            setIsInvalidUsername(false)
        }
        setUsername(event.target.value)
    };

    const onChangePassword = (event) => {
        if(event.target.value.length < 6){
            setIsInvalidPassword(true)
        }
        else{
            setIsInvalidPassword(false)
        }
        setPassword(event.target.value)
    };

    const login = () => {
        localStorage.setItem("token", "asdasdas")
        auth.login(() => {
            history.push("/explore")
        })
 /*   if(!isInvalidUsername && !isInvalidPassword){
            console.log(username,password)
            goLogin()
      setUsername('')
            setPassword('')
        } 
         */
    };

    const  goLogin =  async () =>   {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body :JSON.stringify( {
                user_name :username,
                password :password
            })
        };
        fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_USER_LOGIN}`,requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
            },
            (error) => {
             
            }
        )

    }

    var inputPropsErrorValidUsername = {
        error : true,
        helperText : "Invalid Username Format"
      };


      var inputPropsErrorValidPassword = {
        error : true,
        helperText : "Invalid Password Format"
      };

      if(!auth.isAuthenticated()){
        return (
            <div>
                <Grid container style={{ minHeight: '100vh' }}>
                    <Grid item xs={12} sm={6}>
                        <img src="https://scontent.fhdy2-1.fna.fbcdn.net/v/t39.30808-6/259976312_1795736280816490_9174967368936110458_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=730e14&_nc_eui2=AeHDbfhee8KbKAnZq5Lj5nSYnMKl_a6VCnacwqX9rpUKdrkWFfRdehSdAnmOtLDpu4ZijZK0DJjCo8H1aaq-408O&_nc_ohc=NEZnJXgCJ8cAX_ydMkg&_nc_ht=scontent.fhdy2-1.fna&oh=761d0b22cb1f154a41f06b16d117bc4d&oe=61A115B5" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="brand" />
                    </Grid>
                    <Grid container item xs={12} sm={6} alignItems="center" direction="column" justifyContent="space-between" style={{ padding: 10 }}>
                        <div />
                        <div style={{ display : "flex" , flexDirection : "column" , maxWidth : 400 , minWidth : 300}}>
                            <Grid container justifyContent="center">
                                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/2560px-Genshin_Impact_logo.svg.png" width={300} alt="logo" />
                            </Grid>
                            <TextField  {...isInvalidUsername && {...inputPropsErrorValidUsername}}  label="Username"  onChange={(e) => {onChangeUsername(e)}} size="small" margin="normal" value={username}></TextField>
                            <TextField  {...isInvalidPassword && {...inputPropsErrorValidPassword}}  label="Password" type="password"  onChange={(e) => {onChangePassword(e)}}  size="small" margin="dense" value={password}></TextField>
                            <div style={{height : 10}}/>    
                            <Button color="primary" variant="contained" onClick={login}>Log in</Button>
                         
                        </div>
                        <div />
                    </Grid>
    
                </Grid>
            </div>
    
        )
      }  
      else{
          return(<></>)
      }
   

}

export default LoginPage