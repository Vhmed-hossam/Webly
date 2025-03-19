"use client";
import React, { useEffect, useState } from "react";

// Material UI
import {
  Box,
  CircularProgress,
  Container,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";

// Redux and it's Branches
import { GetPosts } from "@/store/slices/slice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

// Interfaces
import { Post as PostI } from "@/Interfaces/interfaces";

// Components
import Post from "../../_Components/post/post";

export default function Posts() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error, totalPages } = useSelector(
    (state: RootState) => state.posts
  );
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    dispatch(GetPosts(page));
  }, [dispatch, page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  return (
    <div>
      <Box sx={{ width: "100%", padding: "20px 0" }}>
        <Container maxWidth="xl">
          {loading ? (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                height: "80vh",
              }}
            >
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          ) : (
            <>
              <Stack spacing={3} alignItems="center">
                {posts.map((post: PostI, index: number) => (
                  <Post key={index} post={post} page={page} />
                ))}
              </Stack>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <Stack
                  spacing={2}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      "&.Mui-selected": {
                        color: "#FCE8EC",
                        backgroundColor: "#DC143C",
                      },
                      "&:not(.Mui-selected)": {
                        color: "#DC143C",
                      },
                    },
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Stack>
              </div>
            </>
          )}
        </Container>
      </Box>
    </div>
  );
}
