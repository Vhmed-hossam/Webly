import React, { useState } from "react";
import Link from "next/link";

// Material UI
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  CardHeader,
  Avatar,
  IconButton,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";

// Redux and it's Branches
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { GetUserPosts } from "@/store/slices/slice";

// Interfaces
import { AxiosSuccessResponse, Post } from "@/Interfaces/interfaces";

// Helpers
import formatDate from "@/helpers/formatdate";
import formatBytes from "@/helpers/formatBytes";
import VisuallyHiddenInput from "@/helpers/VisuallyHiddenInput";

// Components

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import Spinner from "../loadingspinner/SideLoad/spinner";

export default function UPosts({
  post,
  setRes,
}: {
  post: Post;
  setRes: (res: AxiosSuccessResponse<Post>) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const formData = new FormData();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [updatedContent, setUpdatedContent] = useState<string>("");
  const [Img, setImg] = useState<File | null>(null);
  const [ImgSrc, setImgSrc] = useState<string>(post.image || "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleMenuClose() {
    setAnchorEl(null);
  }
  function handleDialogOpen() {
    setUpdatedContent(post.body);
    setOpenDialog(true);
    handleMenuClose();
    setUpdatedContent(post.body);
    setImgSrc(post.image || "");
  }

  function handleDialogClose() {
    setOpenDialog(false);
    setImgSrc(post.image || "");
    setUpdatedContent(post.body);
    setImg(null);
  }
  function handleDeleteDialogOpen() {
    setOpenDeleteDialog(true);
    handleMenuClose();
  }
  function handleDeleteDialogClose() {
    setOpenDeleteDialog(false);
  }
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImg(file);
      setImgSrc(URL.createObjectURL(file));
    } else {
      setImg(null);
      setImgSrc("");
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
  }
  function deleteImg() {
    setImg(null);
    setImgSrc(post.image);
  }

  async function DeletePost() {
    setIsLoading(true);
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/posts/${post.id}`,
        {
          headers: { token: Cookie.get("token") },
        }
      );
      toast.success("Post deleted successfully!");
      await dispatch(GetUserPosts(user?._id)).then((res) => {
        setRes(res.payload as AxiosSuccessResponse<Post>);
      });
    } catch {
      toast.error("Error deleting post");
    } finally {
      setIsLoading(false);
      handleDeleteDialogClose();
    }
  }
  async function UpdatePost() {
    setIsLoading(true);
    if (updatedContent.trim() == post.body && ImgSrc == post.image) {
      toast.error("No changes made!");
      setIsLoading(false);
      handleDialogClose();
    } else {
      if (updatedContent !== post.body) {
        formData.append("body", updatedContent);
      }
      if (Img) {
        formData.append("image", Img);
      }
      if (Img?.size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB.");
        setIsLoading(false);
      } else {
        if (updatedContent == "") {
          toast.error("Text cannot be empty when having an image!");
          setIsLoading(false);
        } else {
          try {
            await axios.put(
              `https://linked-posts.routemisr.com/posts/${post.id}`,
              formData,
              {
                headers: { token: Cookie.get("token") },
              }
            );
            await dispatch(GetUserPosts(user?._id)).then((res) => {
              setRes(res.payload as AxiosSuccessResponse<Post>);
            });
          } catch {
            toast.error("Error updating post");
          } finally {
            setIsLoading(false);
            handleDialogClose();
            toast.success("Post updated successfully!");
          }
        }
      }
    }
  }
  if (!isLoggedIn) {
    return (
      <>
        <Card
          sx={{
            maxWidth: 500,
            borderRadius: 3,
            background: "#E0DADB",
            height: "fit-content",
          }}
        >
          <CardContent>
            <Typography variant="body1">
              You must be logged in to view this page
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  }
  return (
    <>
      <Card
        sx={{
          maxWidth: 500,
          borderRadius: 3,
          background: "#E0DADB",
          height: "fit-content",
        }}
      >
        <CardHeader
          avatar={<Avatar src={post.user?.photo} />}
          action={
            <>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDialogOpen}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
              </Menu>
            </>
          }
          title={post.user.name}
          subheader={formatDate(post.createdAt)}
        />
        <Link href={`/posts/${post._id}`}>
          <CardContent>
            <Typography
              variant="body1"
              component={"h2"}
              sx={{
                WebkitlineClamp: 1,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                display: "-webkit-box",
                textOverflow: "ellipsis",
              }}
            >
              {post.body}
            </Typography>
          </CardContent>
          {post.image && (
            <CardMedia
              component="img"
              height="250"
              image={post.image}
              alt="Post image"
              sx={{ objectFit: "cover" }}
            />
          )}
        </Link>
        <Box padding={1}>
          <IconButton aria-label="add comment">
            <CommentIcon />
            <Typography variant="body1">{post.comments.length}</Typography>
          </IconButton>
        </Box>
      </Card>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Update Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the content of your post below.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            margin="dense"
            label="Post Content"
            fullWidth
            variant="outlined"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          {post.image && (
            <div
              style={{
                position: "relative",
                border: "2px solid #DC143C",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <img
                src={ImgSrc || post.image}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />
              {Img && (
                <IconButton
                  sx={{
                    position: "absolute",
                    left: 20,
                    top: 20,
                    background: "#DC143C",
                    color: "#FCE8EC",
                    "&:hover": { background: "#FF0844" },
                  }}
                  onClick={deleteImg}
                >
                  <ClearIcon />
                </IconButton>
              )}
              {Img && (
                <div style={{ padding: "10px" }}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography> {formatBytes(Img?.size)}</Typography>

                    {Img?.size > 1000000 ? (
                      <Typography color="error">
                        Img size must be less than 1mb
                      </Typography>
                    ) : null}
                  </Box>
                </div>
              )}
              <Box>
                <Button variant="contained" component="label">
                  Change image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDialogClose();
              setIsLoading(false);
            }}
            color="warning"
          >
            Cancel
          </Button>
          <Button
            onClick={UpdatePost}
            disabled={updatedContent.trim() == "" || Img?.size > 1024 * 1024}
          >
            {isLoading ? <Spinner /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="warning">
            Cancel
          </Button>
          <Button onClick={DeletePost} color="error">
            {isLoading ? <Spinner /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
