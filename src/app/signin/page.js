'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Divider 
} from '@mui/material';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import GoogleIcon from '@mui/icons-material/Google';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(email, password);
      if (res) {
        router.push('/dashboard');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      if (res) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: '20px 0' }}
          >
            Sign In
          </Button>
        </form>
        <Divider style={{ margin: '20px 0' }}>OR</Divider>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Sign in with Google
        </Button>
        <Grid container justifyContent="flex-end" style={{ marginTop: '20px' }}>
          <Grid item>
            <Link href="/signup">
              <Button>
                Sign up
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SignInPage;