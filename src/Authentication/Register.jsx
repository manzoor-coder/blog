import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';
import UserSignUp from './UserSignUp';
import { Google } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  // Register user 
  const handleSubmit = async () => {
    if (email && password && image && name && role) {
      try {
        const user = await UserSignUp(email, password, name, image, role);
        setEmail('');
        setPassword('');
        setName('');
        setImage(null);
        setRole('');
        navigate("/login");
        return user;
      } catch (err) {
        console.error("Registration failed: ", err.message);
      }
    } else {
      console.error("Please fill all fields.");
    }
  };

  return (



    <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            sx={{ backgroundColor: '#f0f2f5' }}
        >
            <Paper elevation={6} sx={{ padding: 4, width: 350, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                    Sign Up
                </Typography>

                <TextField
                    label="Full Name"
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold"
                        }
                    }}
                />

                <TextField
                    label="Email"
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold"
                        }
                    }}
                />
                <TextField
                    label="Password"
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold"
                        }
                    }}
                />

                 <TextField
                    label="Role"
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold",
                        },
                    }}
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                <TextField
                    label=""
                    required
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    sx={{
                        "& .MuiFormLabel-asterisk": {
                            color: "red",
                            fontWeight: "bold"
                        }
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, textTransform: 'none' }}
                    onClick={() => handleSubmit()}
                >
                    Sign Up
                </Button>

                <Typography variant='subtitle1' component='p' sx={{ marginTop: '10px', }}>
                    If you have already account then. 
                    <Link to={"/login"} style={{ textDecoration: 'none', color: '#1976d2' }}>login</Link>
                </Typography>


                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, textTransform: 'none' }}
                    // onClick={() => handleGoogleLogin()}
                >
                    <Google sx={{ color: '#fff' }} /> Sign In With Google
                </Button>
                <Typography variant='subtitle1' component='p' color='error' sx={{ marginTop: '10px' }}>
                {/* {message} */}
                </Typography>
            </Paper>
        </Box>
  )
}

export default Register
