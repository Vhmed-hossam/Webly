"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Material UI
import { Box, Button, Container, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

// Redux and it's Branches
import { RootState } from "../../../store/store";
import { useSelector } from "react-redux";

// Interfaces
import { ChangePasswordI } from "@/Interfaces/interfaces";

// Components

// Styling
import "./passwordforgot.css";

// Others
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import Spinner from "@/app/_Components/loadingspinner/SideLoad/spinner";

export default function ChangePassword() {
  const { push } = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showNewPassword, setshowNewPassword] = React.useState<boolean>(false);
  const [errmsg, seterrmsg] = React.useState<string>("");

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleClickShowNewPassword() {
    setshowNewPassword(!showNewPassword);
  }

  function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  const initialValues = {
    password: "",
    newPassword: "",
  };
useEffect(() => {
    if (!isLoggedIn) {
      push("/login");
    }
  }, [isLoggedIn, push]); // Add all dependencies

  async function onSubmit(values: ChangePasswordI) {
    try {
      setIsLoading(true);
      seterrmsg("");
      const { data } = await axios.patch(
        "https://linked-posts.routemisr.com/users/change-password",
        values,
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      if (data.message === "success") {
        toast.success("Password changed successfully!");
        Cookie.set("token", data.token);
      }
    } catch {
      seterrmsg("Incorrect Password");
      toast.error(errmsg || "Incorrect Password");
    } finally {
      setIsLoading(false);
      if (isLoggedIn) {
        push("/settings");
      } else {
        push("/login");
      }
    }
  }

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short")
      .max(30, "Password is too long")
      .trim(),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "Password is too short")
      .max(30, "Password is too long")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        `Password must contain at least one uppercase letter
         ,one lowercase letter, one number, 
         and one special 
         character`
      )
      .trim(),
  });

  const { handleSubmit, values, handleBlur, handleChange, errors, touched } =
    useFormik({
      initialValues,
      onSubmit,
      validationSchema,
    });

  return (
    <Box className="login-page">
      <Box className="logo-container">
        <Image
          src="/Webly Logo.png"
          alt="Webly Logo"
          width={175}
          height={175}
        />
      </Box>
      <Container maxWidth="sm" className="form-container">
        <Box className="form-flex">
          <form onSubmit={handleSubmit}>
            <Box style={{ gridColumn: "span 2" }}>
              <TextField
                id="newPassword"
                label="New Password"
                name="newPassword"
                fullWidth
                required
                value={values.newPassword.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
                type={showNewPassword ? "text" : "password"}
                variant="outlined"
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
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "white" }}
                      >
                        {showNewPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {touched.newPassword && errors.newPassword && (
                <p className="error">{errors.newPassword}</p>
              )}
            </Box>
            <div style={{ gridColumn: "span 2" }}>
              <TextField
                id="password"
                label="Password"
                name="password"
                fullWidth
                required
                value={values.password.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                variant="outlined"
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
              {IsLoading ? <Spinner /> : "Change Password"}
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
}
