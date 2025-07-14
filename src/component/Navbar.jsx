"use client"

import { useEffect, useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Article as ArticleIcon,
  ContactMail as ContactIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as RegisterIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY || document.documentElement.scrollTop
      setIsSticky(offset > 30)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "About", path: "/about", icon: <InfoIcon /> },
    { text: "Posts", path: "/posts", icon: <ArticleIcon /> },
    { text: "Contact", path: "/contact", icon: <ContactIcon /> },
    { text: "Admin", path: "/admin", icon: <AdminIcon /> },
    // { text: "Register", path: "/register", icon: <RegisterIcon /> },
  ]

  const renderDesktopMenu = () => (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
      {menuItems.map((item) => (
        <Link key={item.text} to={item.path} style={{ textDecoration: "none" }}>
          <Button
            color="inherit"
            sx={{
              color: "black",
              minWidth: "auto",
              px: { md: 1.5, lg: 2 },
              fontSize: { md: "0.875rem", lg: "1rem" },
            }}
          >
            {item.text}
          </Button>
        </Link>
      ))}
    </Box>
  )

  const renderMobileMenu = () => (
    <Drawer
      variant="temporary"
      anchor="right"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 250,
          bgcolor: "#bdbdbd",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={handleDrawerToggle} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link to={item.path} style={{ textDecoration: "none", width: "100%" }} onClick={handleDrawerToggle}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  color: "inherit",
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>{item.icon}</Box>
                <ListItemText primary={item.text} />
              </Box>
            </Link>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )

  const toolbarContent = (
    <Toolbar
      sx={{
        justifyContent: "space-between",
        height: { xs: "64px", sm: "70px", md: "90px" },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "black",
          fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
          fontWeight: 600,
        }}
      >
        My Blog
      </Typography>

      {/* Desktop Menu */}
      {renderDesktopMenu()}

      {/* Mobile Menu Button */}
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 1 }}>
          <MenuIcon />
        </IconButton>
      </Box>
    </Toolbar>
  )

  return (
    <>
      {/* Static top AppBar - always visible at first */}
      {!isSticky && (
        <AppBar
          position="static"
          sx={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            bgcolor: 'rgba(255, 255, 255, 0.6)',  // translucent background
            height: { xs: '64px', sm: '70px', md: '90px' },
            boxShadow: 2,
          }}
        >
          {toolbarContent}
        </AppBar>

      )}

      {/* Sticky AppBar - animates down on scroll */}
      <Slide direction="down" in={isSticky} mountOnEnter unmountOnExit>
        <AppBar
          sx={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            bgcolor: 'rgba(255, 255, 255, 0.6)',
            height: { xs: '64px', sm: '70px', md: '90px' },
            boxShadow: 3,
            zIndex: theme.zIndex.appBar,
          }}
        >
          {toolbarContent}
        </AppBar>
      </Slide>


      {/* Mobile Drawer */}
      {renderMobileMenu()}
    </>
  )
}

export default Navbar
