import React, { useState, useEffect, createContext, useContext } from 'react'

export default class Context {
  
  #listeners = []
  
  constructor (load = {}) {
    this.raw = createContext({})
    this.load = load
    this.Provider = ({ children }) => {
      const [init, setInit] = useState(false)
      const [value, setValue] = useState(undefined)
      const Provider = this.raw.Provider
  
      useEffect(() => {
        if (!(this.load instanceof Function)) {
          setValue(this.load)
          setInit(true)
        } else {
          this.load().then(loadValue => {
            setValue(loadValue)
            setInit(true)
          })
        }
      }, [setValue])

      useEffect(() => {
        if (!init)  return
        this.#listeners.forEach(listener => listener.callback(value, setValue))
      }, [init, value])

      const set = (key, value) => {
        setValue(original => ({ ...original, [key]: value }))
      }

      return <Provider value={{ ...value, set, setValue }}>
        {children}
      </Provider>
    }
  }

  onChange (callback) {
    if (this.#listeners.find(listener => listener.callback.toString() === callback.toString())) return
    this.#listeners.push({ event: 'change', callback })
  }

  onInit (callback) {
    if (this.#listeners.find(listener => listener.callback.toString() === callback.toString())) return
    this.#listeners.push({ event: 'init', callback })
  }

  use () {
    return useContext(this.raw)
  }
}