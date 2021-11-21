
import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Button, Grid, Pagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });



export default function ExolerPage() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [page, setPage] = React.useState(1);
    const [currentIdDelete, setCurrentIdDelete] = React.useState();
    const [currentTitleDelete, setCurrentTitleDelete] = React.useState();
    const [totalPage, setTotalPage] = React.useState(0);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [open, setOpen] = React.useState(false);
 


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}?offset=0&limit=7`)
            .then(res => res.json())
            .then(
                (result) => {
                    setItems(result.resultData);
                    if (result.totalCount % 7 ===  0) setTotalPage((result.totalCount / 7));
                    else setTotalPage(Math.floor(((result.totalCount / 7) + 1)));
                    setIsLoaded(true);
                },
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                }
            )
    }, [])


    const getAllExplore = (offset,limit,method = "common") => {
        fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}?offset=${offset}&limit=${limit}`)
        .then(res => res.json())
        .then(
            (result) => {
                setItems(result.resultData);
                if (result.totalCount % 7 ===  0) setTotalPage((result.totalCount / 7));
                else setTotalPage(Math.floor(((result.totalCount / 7) + 1)));
                setIsLoaded(true);
                if (method === "delete"){
                    setPage(1);
                }
            },
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        )
    };

    const handleChangePage = (event, value) => {
        setPage(value);
        getAllExplore((7*(value-1)),7)
      
        console.log(value)
    };


    const handleCreateContentButton = (id) => {
        console.log(id);
    };

    const handleChangeButton = (id) => {
        console.log(id);
    };


    const handleDeleteButton = (id , title) => {
        setCurrentTitleDelete(title)
        setCurrentIdDelete(id)
        console.log(id);
        handleClickOpenDeleteDialog()
    };


    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const confirmDeleteHandle = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        console.log("CF Delete")
        fetch(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_EXPLORE}${currentIdDelete}`,requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                getAllExplore(0,7,"delete");
                openSuccessAlert();
            },
            (error) => {
             
            }
        )
        setOpenDeleteDialog(false);
        setCurrentIdDelete()
    };


    const changeDateTimeFormat = (dateTime) => {
        let year = dateTime.toString().substring(0, 4)
        let month = dateTime.toString().substring(5, 7)
        let day = dateTime.toString().substring(8, 10)
        let time = dateTime.toString().substring(11, 16)
        return `${day}/${month}/${year} ${time}`
    }


    const openSuccessAlert = () => {
        setOpen(true);
      };
    
      const handleCloseSuccessAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };



    if (error) {
        return <div style={{ marginTop: 70, width: '100%' }}>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div style={{ marginTop: 70, width: '100%' }}>Loading...</div>;
    } else {
        return (
            <div style={{ marginTop: 70, width: '100%' }}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSuccessAlert}>
        <Alert onClose={handleCloseSuccessAlert} severity="success" sx={{ width: '100%' }}>
          สำเร็จ !!
        </Alert>
      </Snackbar>
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"ยืนยันการลบ?"}
                    </DialogTitle>
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


                <Box mr={3} ml={3} mt={3} sx={{ justifyContent: 'center' }}>
                </Box>
                <Box mr={3} ml={3} sx={{ justifyContent: 'center' }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="10%">ลำดับ</TableCell>
                                    <TableCell width="25%">ชื่อ Explore</TableCell>
                                    <TableCell width="15%">ผู้เขียน</TableCell>
                                    <TableCell width="15%">วัน-เวลา</TableCell>
                                    <TableCell >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow
                                        key={item.exploreId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {item.exploreId}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {item.header}
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
                                                    <Button onClick={() => handleCreateContentButton(item.exploreId)} color="info" variant="contained" startIcon={<AddCircleIcon />}>Content</Button>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Button onClick={() => handleChangeButton(item.exploreId)} color="warning" variant="contained" startIcon={<CreateIcon />}>แก้ไข</Button>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Button onClick={() => handleDeleteButton(item.exploreId,item.header)} color="error" variant="contained" startIcon={<DeleteIcon />}>ลบ</Button>
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


                <Grid container mt={5}
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
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