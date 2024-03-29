import Context from './context'
import App from '../realm/app'

export default new Context(async () => ({ app: await App.init() }))