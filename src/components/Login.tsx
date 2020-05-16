import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import { Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#31BBF3',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    }
  }),
);

const Login = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const [token, setToken] = useState('')

  useEffect(() => {
    if (email.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [email, password]);

  const handleLogin = async () => {

    const responseJson = await remoteLogin();

    if (!!responseJson.message) {
      setError(true);
      setHelperText(responseJson.message);
    } else {
      setToken(responseJson.token)
      setHelperText('Login Successfully');
      setToDashboard(true)
    }
  };

  const remoteLogin = async (): Promise<any> => {
    const response = await fetch(`${process.env.REACT_APP_INSTANCE_URL}/admin_api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      })
    });
    return await response.json();
  }

  const handleKeyPress = (e: any) => {
    setError(false)
    setHelperText('')
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };

  return toDashboard ? (<Redirect to={{
    pathname: '/home',
    state: {
      loggedInEmail: email,
      token
    }
  }}></Redirect>) : (
      <React.Fragment>
        <form className={classes.container} noValidate autoComplete="off">
          <Card className={classes.card}>
            <CardHeader className={classes.header} title="Hikma Health Admin" />
            <CardContent>
              <div>
                <TextField
                  error={error}
                  fullWidth
                  id="email"
                  type="email"
                  label="Email"
                  placeholder="Email"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                />
                <TextField
                  error={error}
                  fullWidth
                  id="password"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  margin="normal"
                  value={password}
                  helperText={helperText}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e)}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                className={classes.loginBtn}
                onClick={() => handleLogin()}
                disabled={isButtonDisabled}>
                Login
            </Button>
            </CardActions>
          </Card>
        </form>
      </React.Fragment>
    );
}

export default Login;