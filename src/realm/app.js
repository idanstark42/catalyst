import * as Realm from 'realm-web'
import env from 'react-dotenv'
import Cookies from 'js-cookie'

import User from './user'

const REALM_APP_ID = env?.REALM_APP_ID || process.env.REACT_APP_REALM_APP_ID
const MOGNO_CLUSTER = env?.MOGNO_CLUSTER || process.env.REACT_APP_MOGNO_CLUSTER
const MONGO_DB = env?.MONGO_DB || process.env.REACT_APP_MONGO_DB

const CALLBACK_COOKIE = '__callback__'

export default class AuthApp {
  constructor () {
    this.realm = new Realm.App(REALM_APP_ID)
    this.ObjectId = Realm.BSON.ObjectID
    this._clients = []
    this.providers = AuthApp.PROVIDERS
  }

  get user () {
    return this.realm.currentUser ? new User(this.realm.currentUser, this) : undefined
  }

  get mongo () {
    if (!this._clients[this.user.id])
      this._clients[this.user.id] = this.user.mongoClient(MOGNO_CLUSTER).db(MONGO_DB)
    return this._clients[this.user.id]
  }

  async login (data) {
    if (data.constructor === String) {
      await this.logInWithProvider(data)
    } else {
      await this.logInWithUsernameAndPassword(data)
    }
    return this.user
  }

  async logInWithUsernameAndPassword ({ email, password }) {
    return await this.realm.logIn(Realm.Credentials.emailPassword(email, password))
  }

  async logInWithProvider (provider) {
    Cookies.set(CALLBACK_COOKIE, Date.now())
    return await this.realm.logIn(Realm.Credentials[provider](document.location.origin))
  }

  async logout () {
    return await this.user.logOut()
  }

  async registerUser ({ email, password, confirmation }) {
    if (password !== confirmation) {
      throw new Error('Password and Confirmation don\'t match')
    }
    await this.realm.emailPasswordAuth.registerUser({ email, password })
    await this.login({ email, password })
  }

  async sendResetPasswordEmail ({ email }) {
    return await this.realm.emailPasswordAuth.sendResetPasswordEmail({ email })
  }

  async resetPassword ({ token, tokenId, password }) {
    return await this.realm.emailPasswordAuth.resetPassword({ token, tokenId, password })
  }

  static init () {
    if (Cookies.get(CALLBACK_COOKIE)) {
      Cookies.remove(CALLBACK_COOKIE)
      Realm.handleAuthRedirect()
    }

    return new AuthApp()
  }
}

AuthApp.PROVIDERS = { FACEBOOK: 'facebook', GOOGLE: 'google' }
