import React, { useState, useEffect, createContext, useContext } from 'react'

export default class Context {
  constructor (load, functions) {
    this.raw = createContext({})
    this.load = load
    this.functions = functions
  }

  get Provider () {
    const context = this
    return ({ children }) => {
      const [value, setValue] = useState(undefined)
      const Provider = context.raw.Provider
  
      useEffect(() => {
        if (!(context.load instanceof Function))
          return setValue(context.load)
          context.load().then(setValue)
      }, [setValue])
  
      const functions = Object.entries(context.functions).reduce((functions, [key, func]) => {
        functions[key] = (...args) => func(...args, value, setValue)
        return functions
      }, {})
      return <Provider value={{ ...value , ...functions }}>
        {children}
      </Provider>
    }
  }

  use () {
    return useContext(this.raw)
  }
}