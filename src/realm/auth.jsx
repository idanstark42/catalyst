import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import ApplicationContext from '../helpers/realm'
import LoadingContext from '../helpers/loading'
import Form from '../components/input/form'

const FORMS = { LOGIN: 'login', SIGNUP: 'signup', SEND_RESET_PASSWORD_EMAIL: 'sendResetPasswordEmail', RESET_PASSWORD: 'resetPassword' }
const MESSAGE_TIMEOUT = 5000

export default function Auth ({ providers }) {
  const app = ApplicationContext.use()
  const { whileLoading } = LoadingContext.use()
  const navigate = useNavigate()
  const [message, setMessage] = useState()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const tokenId = params.get('tokenId')
    if (token && tokenId) {
      navigateInternaly(FORMS.RESET_PASSWORD)
    }
  }, [])

  const navigateInternaly = subpage => navigate(`/auth/${subpage}`, { replace: true })

  const setTimedMessage = message => {
    setMessage(message)
    setTimeout(() => setMessage(''), MESSAGE_TIMEOUT)
  }

  const login = async data => {
    await app.login(data)
    navigate('/')
  }

  const signup = async data => {
    await app.registerUser(data)
    navigate('/')
  }

  const sendResetPasswordEmail = async data => {
    await app.sendResetPasswordEmail(data)
    navigateInternaly(FORMS.LOGIN)
    setTimedMessage('Password reset email sent. Please check you inbox.')
  }

  const resetPassword = async data => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const tokenId = params.get('tokenId')
    await app.resetPassword({ ...data, token, tokenId })
    navigateInternaly(FORMS.LOGIN)
    setTimedMessage('Password reset successful')
  }

  const Login = () => <>
    <Form id='login' key='login-form' title='Login' submit={data => whileLoading(async () => await login(data))} type={{ email: 'email', password: 'password' }} />,
    <Divider />
    {providers.map(provider => <Button key={provider} onClick={() => app.login(provider).then(() => navigate('/'))}>{provider}</Button>)}
    <Links navigate={navigateInternaly} {...{ 'Register': FORMS.SIGNUP, 'Forgot Password': FORMS.SEND_RESET_PASSWORD_EMAIL }} />
  </>

  const Signup = () => <>
    <Form id='signup' key='signup-form' title='Signup' submit={() => whileLoading(async () => await signup(data))} type={{ email: 'email', password: 'password', confirmation: 'confirmation' }} />,
    <Links navigate={navigateInternaly} {...{ 'I have a user': FORMS.LOGIN }} />
  </>

  const SendResetPasswordEmail = () => <>
    <Form id='login' key='login-form' title='Reset Password' submitText='Send Reset Email' submit={() => whileLoading(async () => await sendResetPasswordEmail(data))} type={{ email: 'email' }} />,
    <Links navigate={navigateInternaly} {...{ 'Go back to login': FORMS.LOGIN }} />
  </>

  const ResetPassword = () => <Form id='password-reset' title='Reset Password' submit={() => whileLoading(async () => await resetPassword(data))} type={{ password: 'password', confirmation: 'confirmation' }} />

  return <Stack justifyContent='center' alignItems='center'>
    <Paper padding={1}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/send-reset-password-email' element={<SendResetPasswordEmail />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </Router>
    </Paper>
    {/* TODO use toaster context */}
    {message ? <Alert severity='success'>{message}</Alert> : ''}
  </Stack>
}

const Links = ({ navigate, ...links }) => <Stack direction='row' justifyContent='space-between'>
  {Object.entries(links).map(([label, path]) => <Button key={label} onClick={() => navigate(path)}>{label}</Button>)}
</Stack>