import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export default function Theme ({ children, theme }) {
  return <ThemeProvider theme={createTheme(theme)}>
    <CssBaseline />
    {children}
  </ThemeProvider>
}
