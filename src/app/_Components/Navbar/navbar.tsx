"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Material UI
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";

// Redux and it's Branches
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserData, logout } from "@/store/slices/authslice";

// Others
import Cookie from "js-cookie";

export default function NavBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [isMounted, setIsMounted] = React.useState<boolean>(false);
useEffect(() => {
    setIsMounted(true);
    if (isLoggedIn && !user) {
      dispatch(getUserData());
    }
  }, [dispatch, isLoggedIn, user]);

  function handleOpenNavMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElNav(event.currentTarget);
  }

  function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  function handleLogout() {
    dispatch(logout());
  }

  if (!isMounted) {
    return null;
  }
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#3A0506",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        color: "black",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Image
              src="/Webly Logo.png"
              alt="Webly Logo"
              width={40}
              height={40}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".2rem",
                color: "#FF0844",
                textDecoration: "none",
              }}
            >
              Webly
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleOpenNavMenu}
              sx={{ color: "#FCE8EC" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "5px",
                }}
              >
                {isLoggedIn ? (
                  <Link href="/posts" onClick={handleCloseNavMenu}>
                    Posts
                  </Link>
                ) : (
                  <>
                    <Link href="/register" onClick={handleCloseNavMenu}>
                      Register
                    </Link>
                    <Link href="/login">Login</Link>
                  </>
                )}
              </Box>
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {isLoggedIn && Cookie.get("token") ? (
              <>
                <Link href={`/user/${user?._id}`} passHref>
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    Profile
                  </Button>
                </Link>
                <Link href="/posts" passHref>
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    Posts
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" passHref>
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    Register
                  </Button>
                </Link>
                <Link href="/login" passHref>
                  <Button sx={{ my: 2, color: "white", display: "block" }}>
                    Login
                  </Button>
                </Link>
              </>
            )}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {isLoggedIn && user && Cookie.get("token") && (
              <>
                <Tooltip title="Create Post">
                  <Link href="/createpost" passHref>
                    <IconButton color="primary" sx={{ marginRight: "10px" }}>
                      <AddIcon />
                    </IconButton>
                  </Link>
                </Tooltip>
                <Tooltip title="Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      src={user.photo}
                      alt="User"
                      sx={{ width: "40px", height: "40px" }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box>
                    <Link href="/settings">
                      <MenuItem onClick={handleCloseUserMenu}>
                        Settings
                      </MenuItem>
                    </Link>
                    <Link href="/login">
                      <MenuItem
                        onClick={() => {
                          handleCloseUserMenu();
                          handleLogout();
                        }}
                      >
                        Logout
                      </MenuItem>
                    </Link>
                  </Box>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
