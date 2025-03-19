import React, { useState } from "react";

// Material UI
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear";

// Redux and it's Branches
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { GetSinglePost } from "@/store/slices/slice";
import { RootState } from "../../../store/store";

// Interfaces
import { Comment, User } from "@/Interfaces/interfaces";

// Helpers
import formatDate from "@/helpers/formatdate";

// Components

// Others
import axios from "axios";
import Cookie from "js-cookie";
import toast from "react-hot-toast";
import Spinner from "../loadingspinner/MainLoader/Spinner";

const CommentCard = ({
  comment,
  index,
  user,
}: {
  comment: Comment;
  index: number;
  user: User;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { post } = useSelector((state: RootState) => state.posts);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [UpdateCommentContent, setUpdateCommentContent] = useState<string>("");
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [ComingsoonDialog, setComingsoonDialog] = useState<boolean>(false);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  function handlePopoverClose() {
    setAnchorEl(null);
  }
  function handleEditDialogClose() {
    setOpenEditDialog(false);
  }
  function handleEditDialogOpen() {
    setOpenEditDialog(true);
    setUpdateCommentContent(comment.content);
    setAnchorEl(null);
  }
  function handleDeleteDialogOpen() {
    if (
      post?.user._id === user._id ||
      comment.commentCreator._id === user._id
    ) {
      setOpenDeleteDialog(true);
    } else {
      toast.error("You are not authorized to delete this comment.");
    }
    setAnchorEl(null);
  }
  function handleDeleteDialogClose() {
    setOpenDeleteDialog(false);
  }
  function handlecomingsoonopen() {
    if (post?.user._id === user._id) {
      async function DeleteComment() {
        setIsLoading(true);
        try {
          const data = await axios.delete(
            "https://linked-posts.routemisr.com/comments/" + comment._id,
            {
              headers: { token: Cookie.get("token") },
            }
          );
          await dispatch(GetSinglePost(post?._id));
          if (data.data.message === "success") {
            toast.success("Comment deleted successfully!");
          }
        } catch {
          toast.error("Error deleting comment");
          setIsLoading(false);
        } finally {
          setIsLoading(false);
          setOpenDeleteDialog(false);
        }
      }
      DeleteComment();
    } else {
      toast.error("You are not authorized to delete this post.");
      setComingsoonDialog(true);
      setOpenDeleteDialog(false);
    }
    setAnchorEl(null);
  }

  function handlecomingsoonclose() {
    setComingsoonDialog(false);
  }
  const open = Boolean(anchorEl);
  async function UpdateComment() {
    setIsLoading(true);
    try {
      const data = await axios.put(
        "https://linked-posts.routemisr.com/comments/" + comment._id,
        {
          content: UpdateCommentContent,
        },
        {
          headers: { token: Cookie.get("token") },
        }
      );
      await dispatch(GetSinglePost(post?._id));
      if (data.data.message === "success") {
        toast.success("Comment updated successfully!");
      }
    } catch{
      toast.error("Error updating comment");
      setIsLoading(true);
    } finally {
      setIsLoading(false);
      setOpenEditDialog(false);
      setUpdateCommentContent("");
    }
  }
  return (
    <Card
      sx={{
        marginBottom: "10px",
        background: index === 0 ? "transparent" : "#FCE8EC",
        border: index === 0 ? "2px solid #DC143C" : "none",
        color: index === 0 ? "#FCE8EC" : "#0D0003",
      }}
    >
      <CardHeader
        avatar={<Avatar src={comment.commentCreator.photo} />}
        action={
          <>
            {user?._id === comment.commentCreator._id && (
              <IconButton
                aria-label="settings"
                onClick={handlePopoverOpen}
                sx={{
                  color: index === 0 ? "#dc143c" : "#0D0003",
                }}
              >
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
              <MenuItem onClick={handleEditDialogOpen}>Update</MenuItem>
              <MenuItem onClick={handleDeleteDialogOpen}>Delete</MenuItem>
            </Popover>
            <Dialog
              open={openEditDialog}
              onClose={handleEditDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="error" onClick={handleEditDialogClose}>
                  <ClearIcon />
                </IconButton>
                Update Comment
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
                  value={UpdateCommentContent}
                  onChange={(e) => setUpdateCommentContent(e.target.value)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                ></Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleEditDialogClose}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  autoFocus
                  disabled={
                    UpdateCommentContent?.trim() == "" ||
                    UpdateCommentContent === comment.content ||
                    IsLoading
                  }
                  onClick={UpdateComment}
                >
                  {IsLoading ? <Spinner /> : "Update"}
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openDeleteDialog}
              onClose={handleDeleteDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Delete Comment</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this post?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleEditDialogClose} variant="outlined">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={handlecomingsoonopen}
                  disabled={IsLoading}
                >
                  {IsLoading ? <Spinner /> : "Delete"}
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog open={ComingsoonDialog} onClose={handlecomingsoonclose}>
              <DialogTitle>Coming Soon</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  This feature is under development and will be available soon.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handlecomingsoonclose}
                  color="primary"
                  variant="contained"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </>
        }
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: "10px",
            }}
          >
            {comment.commentCreator.name}
            <Typography sx={{ fontSize: "12px", margin: 0 }}>
              {formatDate(comment.createdAt)}
            </Typography>
          </Box>
        }
        subheader={comment.content}
        sx={{
          ".MuiCardHeader-subheader": {
            fontSize: "16px",
            color: index === 0 ? "#FCE8EC" : "#0D0003",
          },
        }}
      />
      {index === 0 && <p className="firstcomment">First comment</p>}
    </Card>
  );
};
export default CommentCard;
