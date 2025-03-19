"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Material UI
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import { Box, Button, Divider } from "@mui/material";

// Styling
import styles from "./page.module.css";

// Others

export default function Home() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Image
            src="/Webly Logo.png"
            alt="Webly Logo"
            width={100}
            height={100}
          />

          <h2 style={{ padding: "10px" }}>
            Hello Customer , Welcome to{" "}
            <span className={styles.webly}>Webly</span>!
          </h2>
          <Divider
            sx={{
              background: "#DC143C",
              padding: "0.1px",
              width: "100%",
              margin: "10px 0px 10px 0px",
            }}
          />
        </div>
        <div className={styles.content}>
          <h3 style={{ textAlign: "center", paddingBottom: "14px" }}>
            What is <span className={styles.webly}>Webly</span>?
          </h3>
          <Typography className={styles.psel}>
            Webly is a dynamic social media platform designed to bring people
            together through spontaneous communication, attractive materials and
            personal experiences. Whether you want to share your ideas, connect
            with friends, or search for trending topics, the web gives a
            comfortable and interactive place to express yourself. With features
            such as customized profiles, instant messaging, multimedia sharing,
            and community-driven discussion, web makes social networking more
            exciting and meaningful. Stay updated with real-time feed, create
            meaningful connections, and find out the world of ideas-all in one
            place. Join the web today and be a part of a vibrant digital
            community where your voice matters!
          </Typography>
        </div>
        <Divider
          sx={{
            background: "#DC143C",
            padding: "0.1px",
            width: "100%",
            margin: "10px 0px 10px 0px",
          }}
        />
        <div className={styles.content}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleClick}
            aria-describedby={id}
          >
            The Developer
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Link href="https://github.com/Vhmed-hossam">GitHub</Link>
                <Link href="https://https://www.behance.net/Ahmed_Hossam16">
                  Behance
                </Link>
                <Link href="https://www.linkedin.com/in/ahmed-hossam-81260634a">
                  Linkedin
                </Link>
              </Box>
            </Box>
          </Popover>
        </div>
      </div>
    </div>
  );
}