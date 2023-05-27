import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ThemeProvider from './helpers/theme'
import LoadingContext from './helpers/loading'
import RealmContext from './helpers/realm'
import AuthPage from './realm/auth'

export default function App({ useRealm, auth, theme, pages, contexts }) {
  let Component = () => <Router>
    <Routes>
      {auth ? <Route path="/auth/*" element={<AuthPage {...auth}/>} /> : null}
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

  if (useRealm) Component = () => <RealmContext.Provider>
    <Component/>
  </RealmContext.Provider>

  return <LoadingContext.Provider>
    <Component/>
  </LoadingContext.Provider>
}
