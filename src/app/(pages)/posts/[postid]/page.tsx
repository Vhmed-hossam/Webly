"use client";
import React, { useEffect, useState, lazy, Suspense, useCallback } from "react";
import Link from "next/link";

// Material UI
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Popover,
  MenuItem,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import { SpaceBar } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";

// Redux and it's Branches
import { GetSinglePost } from "@/store/slices/slice";
import { AppDispatch } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store/store";

// Interfaces
import { Comment } from "../../../../Interfaces/interfaces";

// Helpers
import formatDate from "../../../../helpers/formatdate";

// Components
import CommentCard from "@/app/_Components/CommentCard/CommentCard";
import Spinner from "@/app/_Components/loadingspinner/MainLoader/Spinner";

// Styling
import "./postdetails.css";

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import VisuallyHiddenInput from "@/helpers/VisuallyHiddenInput";
import formatBytes from "@/helpers/formatBytes";
const Picker = lazy(() => import("emoji-picker-react"));

export default function PostDetails(props: { params: Promise<{ postid: string }> }) {
  const { post, loading, error } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [UpdatedContent, setUpdatedContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(post?.image || null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const formData = new FormData();

  useEffect(() => {
    props.params.then((resolvedParams: { postid: string }) => {
      dispatch(GetSinglePost(resolvedParams.postid));
    });
  }, [props.params, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { user } = useSelector((state: RootState) => state.auth);
  const handleEmojiClick = useCallback((emojiObject: { emoji: string }) => {
    setContent((prev) => prev + emojiObject.emoji);
  }, []);

  function handlePopoverOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handlePopoverClose() {
    setAnchorEl(null);
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
  const open = Boolean(anchorEl);

  function handleDeleteDialogOpen() {
    setOpenDeleteDialog(true);
    setAnchorEl(null);
  }

  function handleDeleteDialogClose() {
    setOpenDeleteDialog(false);
  }

  function handleEditDialogOpen() {
    setOpenEditDialog(true);
    setUpdatedContent(post?.body || "");
    setImgSrc(post?.image || "");
    setAnchorEl(null);
  }

  function handleEditDialogClose() {
    setOpenEditDialog(false);
    setImgSrc("");
    setImage(null);
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
      await dispatch(GetSinglePost(post._id))
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
      await dispatch(GetSinglePost(post._id))
    } catch {
      toast.error("Error updating post");
    } finally {
      setIsUpdating(false);
      handleEditDialogClose();
      toast.success("Post updated successfully!");
    }
  }

  async function AddComment() {
    setIsLoading(true);
    if (content.length >= 30) {
      toast.error("Comment must be less than or equal to 30 characters");
      setIsLoading(false);
    } else {
      await axios
        .post(
          "https://linked-posts.routemisr.com/comments",
          {
            content,
            post: post?._id,
          },
          {
            headers: {
              token: Cookie.get("token"),
            },
          }
        )
        .then(() => {
          setContent("");
          setAnchorEl(null);
          setShowEmojiPicker(false);
        })
        .catch(() => {
          setIsLoading(false);
        })
        .finally(() => {
          toast.success("Comment added successfully!");
          dispatch(GetSinglePost(post?._id));
          setIsLoading(false);
        });
    }
  }

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "80vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }
  return (
    <div className="container">
      {mounted && showEmojiPicker && (
        <div
          style={{
            position: "fixed",
            bottom: "10px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <Suspense fallback={<CircularProgress />}>
            <Picker onEmojiClick={handleEmojiClick} />
            <Button
              onClick={() => setShowEmojiPicker(false)}
              variant="contained"
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                zIndex: "10",
              }}
            >
              Close
            </Button>
          </Suspense>
        </div>
      )}
      <Container className="postdetails">
        <Card
          className="post"
          sx={{
            width: "100%",
            height: "100%",
            maxWidth: 700,
            background: "#E0DADB",
            marginBottom: "20px",
          }}
        >
          <CardHeader
            avatar={<Avatar src={post?.user.photo} />}
            action={
              <>
                {post?.user._id === user._id && (
                  <IconButton aria-label="settings" onClick={handlePopoverOpen}>
                    <MoreVertIcon />
                  </IconButton>
                )}
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleEditDialogOpen}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
                </Popover>
              </>
            }
            title={post?.user.name}
            subheader={formatDate(post?.createdAt)}
          />
          <CardContent>
            <Typography variant="body2">{post?.body}</Typography>
          </CardContent>
          {post?.image && (
            <CardMedia
              component="img"
              height="auto"
              image={post?.image}
              alt={post?.image}
              sx={{ objectFit: "cover" }}
            />
          )}
          <SpaceBar sx={{ padding: "10px" }}></SpaceBar>
        </Card>
        <Box sx={{ width: "100%", padding: "25px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              maxWidth: 700,
              margin: "0 auto",
              background: "#3A0506",
              marginBottom: "10px",
              top: 0,
            }}
          >
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Add a comment"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setShowEmojiPicker(false);
              }}
              sx={{
                margin: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "primary.main" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputBase-input": {
                  padding: "10px",
                  borderRadius: "4px",
                  color: "#FCE8EC",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowEmojiPicker((val) => !val)}
                    >
                      <InsertEmoticonIcon color="primary" />
                    </IconButton>
                    {content.trim() && (
                      <IconButton
                        onClick={async () => {
                          await AddComment();
                        }}
                      >
                        {IsLoading ? <Spinner /> : <SendIcon color="primary" />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Card
            className="comments"
            sx={{
              width: "100%",
              maxWidth: 700,
              maxHeight: 600,
              minHeight: post?.comments?.length === 0 ? "auto" : 400,

              marginX: "auto",
              backgroundColor:
                post?.comments?.length === 0 ? "transparent" : "#3A0506",
              padding: "20px",
              paddingTop: "0px",
              height: post?.comments?.length === 0 ? "auto" : "fit-content",
              overflowY: post?.comments?.length === 0 ? null : "scroll",
            }}
          >
            {post?.comments?.length === 0 && (
              <Typography
                variant="h6"
                color="error"
                sx={{ textAlign: "center" }}
              >
                No comments yet
              </Typography>
            )}
            {post?.comments?.map((comment: Comment, index: number) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                index={index}
                user={user}
              />
            ))}
          </Card>
        </Box>
      </Container>
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
            LinkComponent={Link}
            href={`/user/${user?._id}`}
            onClick={DeletePost}
            color="primary"
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
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "6px",
                    }}
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
            disabled={UpdatedContent.trim() == "" || image?.size > 1024 * 1024}
          >
            {isUpdating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
// const CommentCard = memo(
//   ({
//     comment,
//     index,
//     user,
//   }: {
//     comment: Comment;
//     index: number;
//     user: User;
//   }) => {
//   }
// );
