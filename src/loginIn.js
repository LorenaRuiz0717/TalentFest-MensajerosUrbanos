import * as React from 'react';
import { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
/*import Avatar from '@mui/material/Avatar';*/
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import fondo from './assets/fondo.png'
// import logotype from './assets/logotype.png'
import fondoLogin from './assets/fondoLogin.png'
import './formulario.css';
import { auth } from './firebase/firebaseConfig';
import { AuthContext } from './firebase/firebaseAuth';

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

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
  // (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const formData =({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  //   // eslint-disable-next-line no-console
  //   console.log(formData);
  // };

  return (
    <div className='container'>
      <div className='formulario'>
        <h1>hola titulo</h1>
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
              {/*<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon />
          </Avatar>*/}
              <Typography component="h1" variant="h5">
                Iniciar Sesion
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
                {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 5, mb: 2 }}
                >
                Iniciar Sesion
                </Button>
                {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}

              </Box>
            </Box>
            {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
          </Container>

        </ThemeProvider>
      </div>
      <div className='logo'>
        {/* <img src={logotype} alt="logotype" width='380px'  />
        <img src={fondo} alt="fondo" width='600px' /> */}
        <img src={fondoLogin} alt="fondo" width='800px' />
      </div>
    </div>

  );
}

export default withRouter(SignIn);