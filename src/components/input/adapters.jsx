import mapObject from 'map-obj'

import Layout from './layout'
import { ROOT_SCOPE, childScope } from './scope'

export default class Adapter {
  static create (options) {
    if (options.type.constructor !== String) return ObjectAdapter.create(options)
    if (options.type.startsWith('array ')) return ArrayAdapter.create(options)
    return BasicAdapter.create(options)
  }

  onChange ({ data, errors }) {
    return this.onChange(data, errors)
  }

  value (value) {
    return value === undefined ? this.defaultData : value
  }
}

class BasicAdapter extends Adapter {
  constructor (adapter, { type, scope, layout, name, onChange, ...options }) {
    super()
    this.ui = options.ui || {}
    delete options.ui
    Object.assign(this, { adapter, type, scope, layout, name, onChange, options })
  }

  get schema () {
    return { type: this.adapter.jsonformsType, ...(this.adapter.options || {}), 'default': this.defaultData, ...this.options }
  }

  get uiSchema () {
    return { type: 'Control', options: { ...(this.adapter.ui || {}), hideRequiredAsterisk: true, ...this.ui }, scope: this.scope, label: this.name }
  }

  get defaultData () {
    if (this.options.defaultData !== undefined) return this.options.defaultData
    if (this.adapter.defaultData !== undefined) return this.adapter.defaultData
    return undefined
  }

  validate (value) {
    return this.adapter.validate instanceof Function ? this.adapter.validate(value) : []
  } 

  static create ({ type, scope, layout, name = 'value', onChange, ...options }) {
    if (scope === ROOT_SCOPE) return BasicAdapter.createBasicRootAdapter({ type, scope, layout, name, onChange, ...options })
    if (!BASIC_ADAPTERS[type]) throw new Error(`No basic adapter found for type ${type}`)
    return new BasicAdapter(BASIC_ADAPTERS[type], { type, scope, layout, name, onChange, ...options })
  }

  static createBasicRootAdapter ({ type, scope, layout, name = 'value', onChange, ...options }) {
    const adapter = ObjectAdapter.create({ ...options, type: { [name]: type } })
    adapter.uiSchema.elements[0].label = name
    adapter.value = value => (value ? ({ [name]: value }) : adapter.defaultData)
    adapter.onChange = ({ data, errors }) => onChange(data[name], errors)
    return adapter
  }
}

class ObjectAdapter extends Adapter {
  constructor (adapters, defaultData, { type, scope, layout, name, onChange, ...options }) {
    super()
    Object.assign(this, { adapters, defaultData, type, scope, layout, name, onChange, options })
  }

  get schema () {
    return { type: 'object', properties: mapObject(this.adapters, (field, adapter) => [field, adapter.schema]) }
  }

  get uiSchema () {
    return { type: 'Group', elements: Object.entries(this.adapters).map(([_field, adapter]) => adapter.uiSchema), scope: this.scope, label: this.name }
  }

  validate (value) {
    return Object.entries(this.adapters).flatMap(([field, adapter]) => adapter.validate(value[field]))
  }

  static create ({ type, scope, layout, name, onChange, ...options }) {
    const fieldOptions = mapObject(type, field => [field, options[field] || {}])
    Object.keys(type).forEach(field => delete options[field])
    const adapters = mapObject(type, (field, subtype) => [field, Adapter.create({ type: subtype, scope: childScope(scope, field), layout: Layout.flip(layout), field, onChange, ...fieldOptions[field], ...options })])
    const defaultData = mapObject(adapters, (field, adapter) => [field, adapter.defaultData])
    return new ObjectAdapter(adapters, defaultData, { type, scope, layout, name, onChange, ...options })
  }
}

class ArrayAdapter extends Adapter {
  constructor (itemsAdapter, { type, scope, layout, name, onChange, ...options }) {
    super()
    Object.assign(this, { itemsAdapter, type, scope, layout, name, onChange, options, defaultData: [] })
  }

  get schema () {
    return { type: 'array', items: this.itemsAdapter.schema }
  }

  get uiSchema () {
    return { type: 'ListWithDetail', options: { ...(this.itemsAdapter.ui || {}), hideRequiredAsterisk: true }, scope: this.scope, label: this.name }
  }

  validate (value) {
    return value.flatMap(item => this.itemsAdapter.validate(item))
  }

  static create ({ type, scope, layout, name, onChange, ...options }) {
    const itemType = type.replace(/^array /, '')
    const itemsAdapter = Adapter.create({ type: itemType, scope, layout: Layout.flip(layout), name, onChange, ...options })
    return new ArrayAdapter(itemsAdapter, { type, scope, layout, name, onChange, ...options })
  } 
}

const BASIC_ADAPTERS = {
  text: {
    jsonformsType: 'string',
  },
  'long text': {
    jsonformsType: 'string',
    ui: { multiline: true }
  },
  integer: {
    jsonformsType: 'number',
    defaultData: 0,
    options: { multipleOf: 1 }
  },
  number: {
    jsonformsType: 'number',
    defaultData: 0
  },
  range: {
    jsonformsType: 'range',
    defaultData: 0
  },
  date: {
    jsonformsType: 'date',
  },
  time: {
    jsonformsType: 'time',
  },
  datetime: {
    jsonformsType: 'datetime',
  },
  boolean: {
    jsonformsType: 'boolean',
    defaultData: false,
    ui: { toggle: true }
  },
  enum: {
    jsonformsType: 'string',
    ui: { format: 'select' }
  },
  file: {
    jsonformsType: 'string',
    ui: { format: 'file' }
  },
  image: {
    jsonformsType: 'string',
    ui: { format: 'image' }
  },
  color: {
    jsonformsType: 'string',
    defaultData: '#000000',
    ui: { format: 'color' }
  },
  password: {
    jsonformsType: 'string',
    ui: { format: 'password' }
  },
  confirmation: {
    jsonformsType: 'string',
    options: { confirmation: true },
    ui: { format: 'password' }
  },
  email: {
    jsonformsType: 'string',
    options: { format: 'email' },
    ui: { format: 'email' }
  },
  phone: {
    jsonformsType: 'string',
    ui: { format: 'tel' }
  }
}
