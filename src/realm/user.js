export default class User {
  constructor (raw, app) {
    this.raw = raw
    this.app = app
    Object.assign(this, this.raw.functions)
  }

  get id () {
    return this.raw.id
  }

  get profile () {
    return this.raw.profile
  }

  get username () {
    return this.profile.name || this.profile.email.split('@')[0]
  }

  async logOut () {
    return await this.raw.logOut()
  }

  mongoClient (cluster) {
    return this.raw.mongoClient(cluster)
  }
}

