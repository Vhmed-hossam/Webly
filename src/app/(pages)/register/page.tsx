"use client";
import * as React from "react";
import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Material UI
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Interfaces
import { RegisterData } from "@/Interfaces/interfaces";

// Components
import Spinner from "@/app/_Components/loadingspinner/SideLoad/spinner";

// Styling
import "./page.css";

// Others
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";

export default function Register() {
  const { push } = useRouter();
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRePassword, setShowRePassword] = React.useState<boolean>(false);
  useEffect(() => {
    const token = Cookie.get("token");
    if (token) {
      push("/");
    }
  }, [push]);

  function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowRePassword() {
    setShowRePassword(!showRePassword);
  }

  const initialValues = {
    name: "",
    email: "",
    password: "",
    rePassword: "",
    dateOfBirth: "",
    gender: "",
  };

  async function onSubmit(values: RegisterData) {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signup",
        values
      );
      console.log(data);
      if (data.message === "success") {
        push("/login");
        toast.success("Account created successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
      }
    }
    
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name is too short")
      .max(20, "Name is too long"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email")
      .trim(),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short")
      .max(30, "Password is too long")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .trim(),
    rePassword: Yup.string()
      .required("Please enter the password again")
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .trim(),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required"),
  });

  const { handleSubmit, values, handleBlur, handleChange, errors, touched } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema,
    });

  return (
    <div className="login-page">
      <div className="logo-container">
        <Image
          src="/Webly Logo.png"
          alt="Webly Logo"
          width={175}
          height={175}
        />
        <h1 style={{ color: "#FF0844" }}>Create An account</h1>
      </div>
      <Container maxWidth="sm" className="form-container">
        <div className="form-grid">
          <form onSubmit={handleSubmit}>
            <div style={{ gridColumn: "span 2" }}>
              <TextField
                id="name"
                label="Name"
                name="name"
                required
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                sx={{
                  input: { color: "primary.light" },
                  label: { color: "primary.light" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              />
              {touched.name && errors.name && (
                <p className="error">{errors.name}</p>
              )}
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <TextField
                id="email"
                label="Email"
                required
                name="email"
                value={values.email.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                fullWidth
                sx={{
                  input: { color: "primary.light" },
                  label: { color: "primary.light" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              />
              {touched.email && errors.email && (
                <p className="error">{errors.email}</p>
              )}
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <TextField
                id="password"
                required
                label="Password"
                name="password"
                value={values.password.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{
                  input: { color: "primary.light" },
                  label: { color: "primary.light" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "white" }}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {touched.password && errors.password && (
                <p className="error">{errors.password}</p>
              )}
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <TextField
                id="rePassword"
                label="RePassword"
                name="rePassword"
                required
                value={values.rePassword.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
                type={showRePassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                sx={{
                  input: { color: "primary.light" },
                  label: { color: "primary.light" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle re-password visibility"
                        onClick={handleClickShowRePassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "white" }}
                      >
                        {showRePassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {touched.rePassword && errors.rePassword && (
                <p className="error">{errors.rePassword}</p>
              )}
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <TextField
                id="dateOfBirth"
                label="Date of Birth"
                name="dateOfBirth"
                value={values.dateOfBirth}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
                sx={{
                  input: { color: "primary.light" },
                  label: { color: "primary.light" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                    },
                    "&:hover fieldset": {
                      borderColor: "secondary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                }}
              />
              {touched.dateOfBirth && errors.dateOfBirth && (
                <p className="error">{errors.dateOfBirth}</p>
              )}
            </div>
            <div style={{ gridColumn: "span 1" }}>
              <Box sx={{ minWidth: 120, color: "primary.light" }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "primary.main",
                      },
                      "&:hover fieldset": {
                        borderColor: "secondary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "secondary.main",
                      },
                    },
                  }}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    required
                    sx={{ color: "primary.light" }}
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Gender"
                    startAdornment={
                      values.gender === "male" ? (
                        <MaleIcon />
                      ) : values.gender === "female" ? (
                        <FemaleIcon />
                      ) : null
                    }
                    sx={{
                      color: "primary.light",
                      "& .MuiSelect-select": {
                        color: "primary.light",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {touched.gender && errors.gender && (
                <p className="error">{errors.gender}</p>
              )}
            </div>
            <Button
              variant="contained"
              color="primary"
              disabled={IsLoading}
              type="submit"
              size="large"
              sx={{
                gridColumn: "span 2",
                padding: "10px",
                paddingBottom: "10px",
                backgroundColor: "primary.main",
                border: IsLoading ? "1px solid #DC143C" : null,
                color: IsLoading ? "white !important" : null,
                "&:hover": {
                  backgroundColor: IsLoading ? "blue" : "secondary.main",
                },
                textTransform: "none",
              }}
            >
              {IsLoading ? <Spinner /> : "Sign up"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
