import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Page from './page'
import ThemeProvider from './helpers/theme'
import LoadingContext from './helpers/loading'

export default function App({ pages, contexts, theme }) {
  let Component = () => <Router>
    <Routes>
      {Object.entries(pages).map(([path, Component]) => <Route key={path} path={path} element={<Component/>} />)}
    </Routes>
  </Router>

  contexts.forEach(context => {
    Component = () => <context.Provider>
      <Component/>
    </context.Provider>
  })

  if (theme) Component = () => <ThemeProvider theme={theme}>
    <Component/>
  </ThemeProvider>

  return <LoadingContext.Provider>
    <Component/>
  </LoadingContext.Provider>
}
