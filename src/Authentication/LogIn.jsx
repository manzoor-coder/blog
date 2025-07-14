import React, { useEffect, useState } from 'react'
import { Box, TextField, Button, Typography, Paper, MenuItem } from '@mui/material';
import { Google } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {UserLogin, signInWithGoogle} from './UserLogin';// Implement this function


const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [messageLogin, setMessageLogin] = useState('');


    const handleLogin = async () => {
        if (email && password) {
            try {
                const user = await UserLogin(email, password); 
                console.log("User signed in:", user);

                setEmail('');
                setPassword('');

                if (user.role === 'admin') {
                    navigate('/admin');  // user is a plain object
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Login error:", error.message);
                setMessageLogin("Email or password is incorrect");
            }
        } else {
            console.error("Please enter email and password.");
        }
    };


    const handleLoginWithGoogle = async () => {
        try {
            const user = await signInWithGoogle(); // Implement this function
            console.log("User signed in with Google:", user);

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error.message);
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
                    Log In
                </Typography>


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



                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, textTransform: 'none' }}
                    onClick={() => handleLogin()}
                >
                    Log In
                </Button>

                <Typography variant='subtitle1' component='p' sx={{ marginTop: '10px', }}>
                    If you don't have account then.
                    <Link to={"/register"} style={{ textDecoration: 'none', color: '#1976d2' }}>Sign Up</Link>
                </Typography>


                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, textTransform: 'none' }}
                    onClick={() => handleLoginWithGoogle()}
                >
                    <Google sx={{ color: '#fff' }} /> Sign In With Google
                </Button>
                <Typography variant='subtitle1' component='p' color='error' sx={{ marginTop: '10px' }}>
                    {messageLogin}
                </Typography>
            </Paper>
        </Box>
    )
}

export default LogIn
