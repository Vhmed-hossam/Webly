import React from "react";
import Link from "next/link";
import Image from "next/image";

// Material UI
import { Box, Button, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function NotFound() {
  return (
    <Box style={{ isolation: "isolate" }}>
      <Box>
        <Box
          style={{
            paddingLeft: "3rem",
            paddingRight: "3rem",
            paddingTop: ".875rem",
          }}
        >
          <Button
            endIcon={<ArrowForwardIosIcon />}
            sx={{
              transition: "all 0.3s ease-in-out",
              "& .MuiButton-endIcon": {
                transition: "all 0.3s ease-in-out",
              },
              "&:hover": {
                color: "secondary.main",
                "& .MuiButton-endIcon": {
                  transform: "translateX(7px)",
                  color: "secondary.main",
                },
              },
            }}
            href={"/"}
            LinkComponent={Link}
          >
            Go to HomePage
          </Button>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "fit-content",
              gap: "10px",
            }}
          >
            <Image
              src="/Webly Logo.png"
              alt="Webly Logo"
              width={40}
              height={40}
            />
            <Typography style={{ marginTop: "10px", fontSize: "40px" }}>
              Not Found
            </Typography>
          </Box>
        </Box>
        <Box style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
          <Box>
            <h4
              style={{
                marginTop: "25px",
                marginBottom: "25px",
                fontSize: "20px",
              }}
            >
              This page doesn’t exist.
            </h4>
            <h4
              style={{
                marginTop: "25px",
                marginBottom: "25px",
                fontSize: "20px",
              }}
            >
              If this is a mistake,{" "}
              <span style={{ color: "#DC143C", cursor: "pointer" }}>
                Let us know
              </span>
              , and we will try to fix it!
            </h4>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
