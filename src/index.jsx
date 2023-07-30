import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

export { default as Input } from './components/input'
export { default as Form } from './components/input/form'
export { default as Dialog } from './components/dialog'
export { default as Popup } from './components/popup'

export { default as Context } from './helpers/context'
export { default as useMemoryCache } from './helpers/cache'
export { default as useForceUpdate } from './helpers/force-update'
export { default as LoadingContext } from './helpers/loading'
export { default as RealmContext } from './helpers/realm'
export { default as useNavigate } from './helpers/smart-navigation'

export { default as RealmModel } from './realm/model'
export { default as RealmUser } from './realm/user'

export function init (props={}) {
  ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <App {...props} />
  </React.StrictMode>)
}
