import React, { useState } from "react";
import Link from "next/link";

// Material UI
import {
  Box,
  Popover,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import ClearIcon from "@mui/icons-material/Clear";

// Redux and it's Branches
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { GetPosts } from "@/store/slices/slice";

// Interfaces
import { Post as PostI } from "@/Interfaces/interfaces";

// Helpers
import formatDate from "../../../helpers/formatdate";
import formatBytes from "@/helpers/formatBytes";
import VisuallyHiddenInput from "@/helpers/VisuallyHiddenInput";

// Components
import Spinner from "../loadingspinner/MainLoader/Spinner";

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";

export default function Post({ post, page }: { post: PostI; page: number }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [UpdatedContent, setUpdatedContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(post?.image || null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [IsDisabled, setIsDisabled] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [newCommentContent, setnewCommentContent] = useState<string>("");
  const [openCommentDialog, setOpenCommentDialog] = useState<boolean>(false);
  const formData = new FormData();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  function handleClose() {
    setAnchorEl(null);
  }
  function handleDeleteDialogOpen() {
    setOpenDeleteDialog(true);
  }
  function handleMoreClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleDeleteDialogClose() {
    setOpenDeleteDialog(false);
  }

  function handleEditDialogOpen() {
    setOpenEditDialog(true);
    setUpdatedContent(post?.body || "");
    setImgSrc(post?.image || "");
  }

  function handleEditDialogClose() {
    setOpenEditDialog(false);
    setImgSrc("");
    setImage(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImgSrc(URL.createObjectURL(file));
    }
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
  }
  function handleCommentDialogOpen() {
    setOpenCommentDialog(true);
  }

  function handleCommentDialogClose() {
    setOpenCommentDialog(false);
    setnewCommentContent("");
  }

  async function DeletePost() {
    setIsDeleting(true);
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/posts/${post.id}`,
        {
          headers: { token: Cookie.get("token") },
        }
      );
      toast.success("Post deleted successfully!");
      await dispatch(GetPosts(page));
    } catch {
      toast.error("Error deleting post");
    } finally {
      setIsDeleting(false);
      handleDeleteDialogClose();
    }
  }

  async function UpdatePost() {
    setIsUpdating(true);
    formData.append("body", UpdatedContent);
    if (image) {
      formData.append("image", image);
    }
    if (image?.size > 1024 * 1024) {
      setIsDisabled(true);
      formData.delete("image");
    }
    try {
      await axios.put(
        `https://linked-posts.routemisr.com/posts/${post.id}`,
        formData,
        {
          headers: { token: Cookie.get("token") },
        }
      );
      toast.success("Post updated successfully!");
      await dispatch(GetPosts(page));
    } catch {
      toast.error("Error updating post");
    } finally {
      setIsUpdating(false);
      handleEditDialogClose();
    }
  }

  async function AddComment() {
    setIsUpdating(true);
    try {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        {
          content: newCommentContent,
          post: post.id,
        },
        {
          headers: {
            token: Cookie.get("token"),
          },
        }
      );
      if (res.data.message === "success") {
        toast.success("Comment added successfully!");
      }
      await dispatch(GetPosts(page));
    } catch{
      toast.error("Error adding comment");
    } finally {
      setIsUpdating(false);
      handleCommentDialogClose();
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Card sx={{ width: "100%", maxWidth: 600, background: "#E0DADB " }}>
      <Box>
        <CardHeader
          avatar={<Avatar src={post?.user.photo}></Avatar>}
          action={
            <>
              {post?.user?._id === user?._id && (
                <IconButton onClick={handleMoreClick}>
                  <MoreVertIcon />
                </IconButton>
              )}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                  <>
                    <MenuItem
                      onClick={() => {
                        handleEditDialogOpen();
                        handleClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteDialogOpen();
                        handleClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </>
              </Popover>
            </>
          }
          title={post?.user.name}
          subheader={formatDate(post?.createdAt)}
        />
        <Box component={Link} href={`/posts/${post?._id}`}>
          <CardContent>
            <Typography variant="body2">{post?.body}</Typography>
          </CardContent>
          {post?.image && (
            <CardMedia
              component="img"
              height="auto"
              image={post?.image}
              alt={post?.image}
              sx={{ maxHeight: 400, objectFit: "cover" }}
            />
          )}
        </Box>
        <CardActions
          sx={{
            padding: "10px 25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton aria-label="comment">
            <CommentIcon />
            <p style={{ fontSize: "16px", marginLeft: "4px" }}>
              {post?.comments?.length}
            </p>
          </IconButton>
          <Button variant="outlined" onClick={handleCommentDialogOpen}>
            Add comment
          </Button>
        </CardActions>
      </Box>
      {post?.comments?.length > 0 && (
        <Box sx={{ borderTop: "1px solid #ccc" }}>
          <CardHeader
            avatar={
              <Avatar src={post?.comments[0]?.commentCreator?.photo}></Avatar>
            }
            
            title={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingRight: "10px",
                }}
              >
                {post?.comments[0]?.commentCreator?.name}{" "}
                <Typography>
                  {formatDate(post?.comments[0]?.createdAt)}
                </Typography>
              </Box>
            }
            subheader={post?.comments[0]?.content}
            sx={{
              ".MuiCardHeader-subheader": {
                fontSize: "18px",
                color: "#0D0003",
              },
              ".MuiCardHeader-title": { fontSize: "14px" },
            }}
          />
        </Box>
      )}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={DeletePost}
            color="primary"
            autoFocus
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="error"
            onClick={() => {
              setImgSrc("");
              setImage(null);
              handleEditDialogClose();
            }}
          >
            <ClearIcon />
          </IconButton>
          Selected image
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "10px" }}>
            Update the content of your post below.
          </DialogContentText>
          <TextField
            multiline
            label="Post Content"
            fullWidth
            variant="outlined"
            value={UpdatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          <Box sx={{ paddingTop: "10px" }}>
            {imgSrc ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    position: "relative",
                  }}
                >
                  <img
                    src={imgSrc}
                    alt="Post Image"
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                  <Button
                    sx={{ position: "absolute", bottom: "10px", left: "10px" }}
                    variant="contained"
                    component="label"
                  >
                    Change Image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleImageChange}
                    />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  {image && (
                    <>
                      <Typography>{formatBytes(image?.size)}</Typography>
                      <Typography color="error">
                        {image?.size > 1024 * 1024
                          ? "Image size should be less than 1MB"
                          : null}
                      </Typography>
                    </>
                  )}
                </Box>
              </>
            ) : (
              <Button variant="contained" component="label">
                Add Image
                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEditDialogClose}
            color="warning"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={UpdatePost}
            color="primary"
            disabled={IsDisabled || isUpdating}
          >
            {isUpdating ? <Spinner /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCommentDialog} onClose={handleCommentDialogClose}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>Write your comment below.</DialogContentText>
          <TextField
            autoFocus
            multiline
            margin="dense"
            label="Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={newCommentContent}
            onChange={(e) => setnewCommentContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCommentDialogClose}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={AddComment}
            color="primary"
            disabled={isUpdating}
            variant="contained"
          >
            {isUpdating ? <Spinner /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
