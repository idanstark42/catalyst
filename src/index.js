import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

export { default as Context } from './helpers/context'

export function init (props) {
  ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <App {...props} />
  </React.StrictMode>)
}
