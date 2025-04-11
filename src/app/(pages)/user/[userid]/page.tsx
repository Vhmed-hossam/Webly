"use client";
import React, { useEffect, useState } from "react";

// Material UI
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

// Redux
import { GetUserPosts } from "@/store/slices/slice";
import { AppDispatch, RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

// Interfaces
import { AxiosSuccessResponse, Post } from "@/Interfaces/interfaces";

// Components
import UPosts from "../../../_Components/userposts/UPosts";

export default function UserId() {
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [Res, setRes] = useState<AxiosSuccessResponse<Post> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      dispatch(GetUserPosts(user._id)).then((res) => {
        setRes(res.payload as AxiosSuccessResponse<Post>);
        setIsLoading(false);
      });
    }
  }, [dispatch, user]);

  const totalComments = Res?.data?.posts.reduce(
    (total: number, post: Post) => total + (post.comments?.length || 0),
    0
  );
  if (!isLoggedIn) {
    return (
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
          You must be logged in to view this page
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        style={{
          display: "grid",
          placeItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
console.log(typeof setRes);
  return (
    <>
      <Container sx={{padding: "20px"}}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <Avatar
              src={user?.photo}
              sx={{ width: 100, height: 100, border: "3px solid #DC143C" }}
            />
            <Box>
              <Typography variant="h6">{user?.name}</Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>{user?.email}</Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px",
            }}
          >
            <Box flex={1} sx={{ display: "flex", gap: "30px" }}>
              <Box>
                <Typography variant="h6">
                  {Res?.data?.paginationInfo?.total || 0}
                </Typography>
                <Typography>Posts</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{totalComments  || 0}</Typography>
                <Typography>Comments</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ background: "#DC143C", marginTop: "20px" }} />
      </Container>

      <Box sx={{ width: "100%" }}>
        <Box sx={{ padding: "0px 20px" }}>
          <Typography variant="h6">Your Posts</Typography>
        </Box>

        {Res?.data?.posts?.length > 0 ? (
          <Grid container spacing={2} sx={{ padding: "20px" }}>
            {Res?.data?.posts.map((post: Post) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={post._id}>
                <UPosts key={post._id} post={post} setRes={setRes} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Container sx={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h6" color="error">
              No posts found
            </Typography>
          </Container>
        )}
      </Box>
    </>
  );
}
