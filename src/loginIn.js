import * as React from 'react';
import { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import fondoLogin from './assets/fondoLogin.png'
import './formulario.css';
import { auth } from './firebase/firebaseConfig';
import { AuthContext } from './firebase/firebaseAuth';

const theme = createTheme();

function SignIn({ history }) {
  const handleSubmit = useCallback(async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData =({
      email: data.get('email'),
      password: data.get('password'),
      });
    try {
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      history.push('/Monitoreo');
    } catch (error) {
      alert(error);
    }
  }, [history]);

  const { currentUser } = useContext(AuthContext);

  if(currentUser){
    return <Redirect to='/Monitoreo' />;
  }

  return (
    <div className='container'>
      <div className='formulario'>
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography component="h1" variant="h5">
                Iniciar Sesiòn
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 8 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 5, mb: 2 }}
                >
                Iniciar Sesion
                </Button>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
      <div className='logo'>
        <img src={fondoLogin} alt="fondo" width='800px' />
      </div>
    </div>

  );
}

export default withRouter(SignIn);