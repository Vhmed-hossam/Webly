"use client";
import React, { useState } from "react";
import Link from "next/link";

// Material UI
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import ClearIcon from "@mui/icons-material/Clear";

// Redux and it's Branches
import { AppDispatch, RootState } from "../../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { getUserData } from "@/store/slices/authslice";

// Interfaces
import { User } from "@/Interfaces/interfaces";

// Helpers
import formatDateOnly from "@/helpers/formatdateonly";
import formatBytes from "@/helpers/formatBytes";
import VisuallyHiddenInput from "../../../helpers/VisuallyHiddenInput";

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";

export default function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [imageDialogOpen, setImageDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [Img, setImg] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [UserData, setUserData] = useState<User | null>(user);

  function handleDialogOpen() {
    setOpenDialog(true);
  }

  function handleDialogClose() {
    setOpenDialog(false);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImg(file);
      setImageDialogOpen(true);
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
  }

  function handleImageDialogClose() {
    setImageDialogOpen(false);
    setSelectedImage(null);
  }

  function handleConfirmDialogOpen() {
    setImageDialogOpen(false);
    setConfirmDialogOpen(true);
    setOpenDialog(false);
  }

  function handleConfirmDialogClose() {
    setConfirmDialogOpen(false);
  }

  async function ChangeAvatar() {
    setIsLoading(true);
    const formData = new FormData();
    if (Img) {
      formData.append("photo", Img);
      try {
        const { data } = await axios.put(
          "https://linked-posts.routemisr.com/users/upload-photo",
          formData,
          {
            headers: {
              token: Cookie.get("token"),
            },
          }
        );
        if (data.message === "success") {
          toast.success("Avatar changed successfully!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error changing avatar");
      } finally {
        setIsLoading(false);
        setOpenDialog(false);
        setConfirmDialogOpen(false);
        dispatch(getUserData()).then((res) => {
          setUserData(res.payload);
        });
      }
    }
  }
  if (!isLoggedIn) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          You must be logged in to view this page
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: "80vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 3,
          borderRadius: 2,
          background: "#510B0E",
        }}
      >
        <Avatar
          alt={UserData?.name}
          src={UserData?.photo}
          sx={{
            width: 100,
            height: 100,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {UserData?.name}
          </Typography>
          <Typography variant="body1">{UserData?.email}</Typography>
        </Box>
        <Button variant="contained" component="label">
          Change Avatar
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
        <Box
          sx={{
            flex: 2,
            minWidth: 300,
            p: 3,
            borderRadius: 2,
            background: "#510B0E",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Your Details
            </Typography>
            <Tooltip title="Edit">
              <IconButton color="primary" onClick={handleDialogOpen}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              Name: {UserData?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {UserData?.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Gender:
              {UserData?.gender === "male" ? (
                <Tooltip title="Male">
                  <MaleIcon />
                </Tooltip>
              ) : (
                <Tooltip title="Female">
                  <FemaleIcon />
                </Tooltip>
              )}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Birthday: {formatDateOnly(UserData?.dateOfBirth)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Account created: {formatDateOnly(UserData?.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingTop: "15px", display: "flex", justifyContent: "end" }}>
        <Button variant="outlined" component={Link} href="/changepassword">
          Forgot password?
        </Button>
      </Box>
      <Dialog open={imageDialogOpen} onClose={handleImageDialogClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="error" onClick={handleImageDialogClose}>
            <ClearIcon />
          </IconButton>
          Selected image
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                style={{
                  maxWidth: "100%",
                  borderRadius: "10px",
                  maxHeight: "400px",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <Typography>{formatBytes(Img?.size || 0)}</Typography>
                <Typography color="error">
                  {Img?.size > 1024 * 1024 &&
                    "Image size must be less than 1MB"}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" component="label">
            Change
            <VisuallyHiddenInput
              type="file"
              accept={"image/png, image/jpeg image/jpg"}
              onChange={handleImageChange}
            />
          </Button>

          <Button
            onClick={() => {
              handleConfirmDialogOpen();
            }}
            color="primary"
            variant="contained"
            disabled={Img?.size > 1024 * 1024}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton color="error" onClick={handleImageDialogClose}>
            <ClearIcon />
          </IconButton>
          Confirm image
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to set this image as your avatar?
          </DialogContentText>
          <DialogContent>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {selectedImage && (
                <Avatar
                  src={selectedImage}
                  alt="Selected"
                  sx={{
                    width: 150,
                    height: 150,
                    border: "2px solid #DC143C",
                  }}
                />
              )}
            </Box>
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmDialogClose}
            color="primary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            onClick={ChangeAvatar}
            color="primary"
            variant="contained"
            loading={isLoading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Typography
        variant="body2"
        sx={{ textAlign: "center", mt: 4 }}
        color="primary.light"
      >
        Version 1.10.00
      </Typography>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Coming Soon</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This feature is under development and will be available soon.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
