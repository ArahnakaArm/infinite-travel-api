import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Grid, Pagination } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Drawer from "../../components/Drawer";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import CallHttp from "../../services/callHttp";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function TicketSearchPage(props) {
  const [ticketNumber, setTicketNumber] = useState("");
  const [width, setWindowWidth] = useState(window.innerWidth);
  const updateDimensions = () => {
    const width = window.innerWidth;
    setWindowWidth(width);
    console.log(width);
  };
  const MySwal = withReactContent(Swal)

  window.addEventListener("resize", updateDimensions);

  useEffect(() => {

  }, []);

  const SearchTicket = async () => {
    const token = localStorage.getItem("token")
    let ticketRes = await CallHttp('GET', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_URL_PATH_TICKET}?ticket_number=${ticketNumber}`,
      null,
      token
    )

    if(ticketRes.rowCount === 0){
      MySwal.fire({
        icon: 'error',
        title: <p>Ticket Not Found</p>,

    }).then((result) => {

    })
    }

    
  }
  const onChangeTicketNumber = (event) => {
    setTicketNumber(event.target.value)

  }



  return (
    <div style={{ marginLeft: width <= 600 ? 0 : 180, width: "100%" }}>
      <Drawer />

      <div style={{
        padding: 10
      }}>
        <Typography variant="h5" component="div" >
          Search Ticket Number
        </Typography>
        <Box sx={{ minHeight: 10 }}></Box>

        <TextField
          sx={{
            width: 400
          }}
          id="ticketNumber"
          label="Enter Ticket Number"
          variant="outlined"
          size="small"
          value={ticketNumber}
          onChange={(e) => { onChangeTicketNumber(e) }}
        />
        <Button sx={{
          marginLeft: 1
        }} onClick={SearchTicket} color="primary" variant="contained" startIcon={<SearchIcon />}>
          Search
        </Button>
      </div>

    </div>
  );

}
