import '../styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tabulator/css/tabulator_simple.css'
import styles from '../styles/Main.module.scss';

import React from 'react'

import NextApp from 'next/app'
import Head from 'next/head';

import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeProvider as MaterialThemeProvider, createMuiTheme, StylesProvider } from '@material-ui/core/styles';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';


import CookieConsent from 'react-cookie-consent';
import Header from '../components/Header'
import { IProfileStatus } from '../lib/auth_helper';

const theme = {
  primary: '#ffaabb',
  ...createMuiTheme({      
    typography: {
      button: {
        textTransform: 'none'
      }
    }
  })
}

class App extends NextApp {
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode)
      jssStyles.parentNode.removeChild(jssStyles)
  }

  render() {
    return (
      <StylesProvider injectFirst>
        <StyledThemeProvider theme={theme}>
          <MaterialThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Head>
                <title>Web shop</title>
                <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
              </Head>
              <Header path={this.props.router.asPath} profile={(this.props as any).profile as IProfileStatus} />
              <CookieConsent>This website uses cookies to enhance the user experience.</CookieConsent>
              <div className={styles.root}>
                <this.props.Component profile={(this.props as any).profile as IProfileStatus} {...this.props.pageProps} />
              </div>
            </MuiPickersUtilsProvider>
          </MaterialThemeProvider>
        </StyledThemeProvider>
      </StylesProvider>
    )
  }
}



App.getInitialProps = async (appContext) => {
  if(typeof window !== 'undefined') {
    // This was called from the browser, we get the profile through the api
    const appProps = await NextApp.getInitialProps(appContext);
    if (!Object.keys(appProps.pageProps).length) {
      delete appProps.pageProps;
    }
    let myprofile: IProfileStatus = await (await fetch('/api/profile')).json();
    return { profile: myprofile, ...appProps }
  }
  else {
    // This was called from the server, so we can get the profile directly
    let {getCookie, GetProfileStatus} = await import('../lib/auth_helper');

    const appProps = await NextApp.getInitialProps(appContext);
    if (!Object.keys(appProps.pageProps).length) {
      delete appProps.pageProps;
    }
    let token = getCookie("token", appContext.ctx.req.headers.cookie);
    let myprofile = GetProfileStatus(token);
    return { profile: myprofile, ...appProps }
  }
}

export default App;
