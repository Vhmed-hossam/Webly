"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Material UI
import { Button, Container, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

// Redux and it's Branches
import { useDispatch } from "react-redux";
import { getUserData, login } from "@/store/slices/authslice";

// Interfaces
import { LoginData } from "@/Interfaces/interfaces";

// Components
import Spinner from "@/app/_Components/loadingspinner/SideLoad/spinner";

// Styling
import "./page.css";

// Others
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import { AppDispatch } from "@/store/store";

export default function Login() {
  const { push } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [IsLoading, setIsLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  useEffect(() => {
    const token = Cookie.get("token");
    if (token) {
      push("/");
    }
  }, [push]);

  function handleClickShowPassword() {
    setShowPassword(!showPassword);
  }

  function handleMouseDownPassword(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  const initialValues = {
    email: "",
    password: "",
  };

  async function onSubmit(values: LoginData) {
    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        values
      );
      if (data.message === "success") {
        dispatch(login(data.token));
        await dispatch(getUserData());
        push("/");
        toast.success("Login successfull!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email")
      .trim(),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password is too short")
      .max(30, "Password is too long")
      .trim(),
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
      </div>
      <Container maxWidth="sm" className="form-container">
        <div className="form-flex">
          <form onSubmit={handleSubmit}>
            <div style={{ gridColumn: "span 2" }}>
              <TextField
                id="email"
                label="Email"
                name="email"
                fullWidth
                required
                value={values.email.trim()}
                onChange={handleChange}
                onBlur={handleBlur}
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
              />
              {touched.email && errors.email && (
                <p className="error">{errors.email}</p>
              )}
            </div>
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
              {IsLoading ? <Spinner /> : "Log in"}
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
