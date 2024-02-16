import { useState } from "react";
import { toast } from "react-toastify";
import { Link as RouterLink, useNavigate, Navigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "@mui/material/Link";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { forgotPassword, saveTokenData, tokenExists } from "../Util/auth";
import { TOAST_CONFIG } from "../Util/constants";
import { isValidEmail } from "../Util/validators";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("")

  const [isLoading, setIsLoading] = useState(false);

  if (tokenExists()) {
    console.log("Here");
    return <Navigate to={"/dashboard"} replace />;
  }

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    if (!email || !isValidEmail){
      validateEmail({target: {value: email}})
      toast.error("Form contains errors", TOAST_CONFIG);
      return;
    }
    setIsLoading(true);
    forgotPassword(email)
      .then((data) => {
        console.log(data);
        if (!data.success || data.errors)
          throw new Error(data.message || data.errors);

        setIsLoading(false);
        toast.success(data.message, TOAST_CONFIG);
        navigate("/login");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message, TOAST_CONFIG);
      });
  }

  const handleChange = (changeEvent) => {
    changeEvent.persist();
    const { name, value } = changeEvent.target;
    setEmail(value);
  }

  const validateEmail = (event) =>{
    const { name, value } = event.target;
    if (!value) setEmailError("Field Cannot Be Empty")
    else if (!isValidEmail(value)) setEmailError("Invalid Email Supplied")
    else setEmailError("")
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            onBlur={validateEmail}
            error={Boolean(emailError)}
            helperText={emailError}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to={"/login"} component={RouterLink} variant="body2">
                Remember Password?
              </Link>
            </Grid>
          </Grid>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Box>
    </Container>
  );
}
