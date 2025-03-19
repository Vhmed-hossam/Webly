"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Material UI
import {
  Button,
  Container,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ClearIcon from "@mui/icons-material/Clear";

// Helpers
import VisuallyHiddenInput from "@/helpers/VisuallyHiddenInput";
import formatBytes from "@/helpers/formatBytes";

// Components

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import Spinner from "../loadingspinner/SideLoad/spinner";

export default function CreatePost() {
  const [image, setimage] = useState<File | null>(null);
  const [Body, setBody] = useState<string>("");
  const [ImgSrc, setImgSrc] = useState<string>("");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const imageFile = e.target.files[0];
    setimage(imageFile);
    const imgSrc = URL.createObjectURL(imageFile);
    setImgSrc(imgSrc);
  }

  function handledeleteImage() {
    setimage(null);
    setImgSrc("");
  }
  async function AddPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("body", Body);
    if (image) {
      formData.append("image", image);
      if (image.size > 1024 * 1024) {
        setIsLoading(false);
        toast.error("Image size must be less than 1MB.");
        return;
      }
    }
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      if (data.message === "success") {
        setBody("");
        setImgSrc("");
        setimage(null);
        toast.success("Post created successfully!", {
          style: {
            padding: "16px",
            color: "#fff",
            backgroundColor: "#428232",
          },
          iconTheme: {
            primary: "#42D042",
            secondary: "#ededed",
          },
        });
      }
    } catch{
      setBody("");
      setImgSrc("");
      setimage(null);
      toast.error("Error creating post");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <Container sx={{ padding: "10px", borderRadius: 2 }}>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "15px" }}>
            <h1>Create a Post</h1>
          </div>
          <div>
            <form onSubmit={AddPost}>
              <TextField
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
                    color: "#FCE8EC",
                  },
                  marginBottom: 2,
                }}
                rows={2}
                label="Your Message"
                multiline
                value={Body}
                onChange={(e) => setBody(e.target.value)}
                fullWidth
              />
              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                {image && ImgSrc && (
                  <img
                    src={ImgSrc}
                    alt="Selected"
                    style={{
                      display: "block",
                      margin: "auto",
                      marginTop: 2,
                      marginBottom: 2,
                      maxHeight: "250px",
                      borderRadius: "6px",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ textAlign: "center", marginBottom: 2 }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Button>
                {ImgSrc && (
                  <IconButton
                    color="primary"
                    LinkComponent={Link}
                    href="/createpost"
                    onClick={handledeleteImage}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!image && !Body.trim() || IsLoading || (!Body.trim() && !!image)}
                  sx={{
                    backgroundColor: !image && !Body ? "success" : undefined,
                    "&:disabled": {
                      backgroundColor: "transparent",
                      border: "1px solid",
                      color: "primary.main",
                    },
                  }}
                >
                  {IsLoading ? <Spinner /> : "Add Post"}
                </Button>
              </Box>
            </form>
          </div>
        </div>
        {image && (
          <Box sx={{ textAlign: "center", padding: "10px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="primary">
                Image Size: {formatBytes(image.size)}
              </Typography>
            </Box>
          </Box>
        )}
      </Container>
    </div>
  );
}
