import { useState, useEffect, createContext, useContext } from 'react'

export default class Context {
  constructor (load, functions) {
    this.raw = createContext(value)
    this.load = load
    this.functions = functions
  }

  Provider ({ children }) {
    const [value, setValue] = useState(undefined)
    const Provider = this.raw.Provider

    useEffect(() => {
      if (!(this.load instanceof Function))
        return setValue(this.load)
      this.load().then(setValue)
    }, [setValue])

    const functions = Object.entries(this.functions).reduce((functions, [key, func]) => {
      functions[key] = (...args) => func(...args, value, setValue)
      return functions
    }, {})

    return <Provider value={{ ...value , ...functions }}>
      {children}
    </Provider>
  }

  use () {
    return useContext(this.raw)
  }
}