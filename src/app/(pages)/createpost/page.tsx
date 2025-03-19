"use client";
import React from "react";

// Material UI
import { Typography } from "@mui/material";

// Redux and it's Branches
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Components
import CreatePost from "@/app/_Components/CreatePost/createPost";


export default function Page() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      {isLoggedIn ? (
        <CreatePost />
      ) : (
        <div style={{ padding: "20px" }}>
          <Typography variant="h6" color="error" sx={{ textAlign: "center" }}>
            You must be logged in to create a post
          </Typography>
        </div>
      )}
    </div>
  );
}
