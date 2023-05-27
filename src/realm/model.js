export default class Model {
  constructor (raw, app, enrichment = {}) {
    Object.assign(this, Object.assign({}, this.constructor.TEMPLATE || {}, raw), { app }, enrichment)
  }

  get id () {
    return this._id ? this._id.toString() : false
  }

  set id (id) {
    this._id = id
  }

  get objectId () {
    return this.app.ObjectId(this.id)
  }

  get collection () {
    return this.app?.mongo.collection(this.constructor.COLLECTION)
  }

  async save (update = {}) {
    if (this.presave) this.presave()
    Object.assign(this, update)
    if (!this.id) {
      const { insertedId } = await this.collection.insertOne(this.toJson())
      this._id = insertedId
    } else {
      await this.collection.updateOne(this.idJson, this.toJson())
    }
    return this
  }

  presave () { /* default to doing nothing */ }

  get idJson () {
    return this.constructor.ID_FIELDS.reduce((obj, field) => ({ ...obj, [field === 'id' ? '_id' : field]: (field === 'id' ? this.objectId : this[field]) }), { })
  }

  toJson () {
    return this.constructor.JSON_FIELDS.reduce((obj, field) => ({ ...obj, [field]: this[field] }), { })
  }

  static async loadOne (app, query, additionalFields) {
    if (query.id) {
      query._id = app.ObjectId(query.id)
      delete query.id
    }
    const raw = await app.mongo.collection(this.COLLECTION).findOne(query)
    return new this(raw, app, additionalFields)
  }

  static async loadMany (app, query, additionalFields) {
    const raw = await app.mongo.collection(this.COLLECTION).find(query)
    return raw.map(entry => new this(entry, app, additionalFields))
  }

  static ID_FIELDS = ['id']
  static TEMPLATE = {}
}
