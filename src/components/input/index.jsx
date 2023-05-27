/* A generic JSON forms input component, which can be used to render any input type
 * based on the object type passed to it.
 * The type can be either:
 * 1. The name of a basic input type (text, long text, integer, number, range, date, time, datetime, boolean (toggle), enum, file, image, color, password, confirmation, email, phone)
 * 2. One of the name with a prefix of 'array ' to indicate that the input is an array of the specified type
 * 3. An object with properties to indicate that the input is a complex object
 * 
 * The component also accepts a number of other properties:
 * 1. value: The value of the input
 * 2. onChange: A callback function to be called when the value of the input changes
 * 3. layout: The layout of the input (horizontal, vertical, grid, tabs)
 * 4. name: The name of the input
 * 5. options: An object containing additional options for the input
 * 
 * The component generates the JSONForms schema and UI schema for the input, and passes them to the JSONForms component
 * 
 * The options object can contain the following properties:
 * 1. required: A boolean indicating whether the input is required
 * 2. validation: A function to validate the input value (should return an array of errors)
 * 3. ui: An object containing additional UI schema options
 * 4. default: The default value of the input
 * 5. type specific options:
 *   a. text: maxLength, minLength, pattern
 *   b. long text: maxLength, minLength, pattern
 *   c. integer: minimum, maximum
 *   d. number: minimum, maximum
 *   e. range: minimum, maximum, step
 *   f. date: format
 *   g. time: format
 *   h. datetime: format
 *   i. boolean: no options
 *   j. enum: options
 *   k. file: accept
 *   l. image: accept
 *   m. color: no options
 *   n. password: maxLength, minLength
 *   o. confirmation: maxLength, minLength
 *   p. email: domain
 *   q. phone: country
 */

import { useState, useEffect } from 'react'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import equal from 'fast-deep-equal/react'

import Layout from './layout'
import { ROOT_SCOPE } from './scope'
import Adapter from './adapters'
import { ajv, useErrors } from './validation'
import NumberInput from './renderers/number'
import ColorInput from './renderers/color'

const renderers = [...materialRenderers, NumberInput, ColorInput]

export default function Input ({ value='', type='text', name=undefined, onChange=()=>{}, layout=Layout.VERTICAL, ...options }) {
  const adapter = Adapter.create({ type, scope: ROOT_SCOPE, layout, name, onChange, ...options })
  const [formState, setFormState] = useState({ errors: [], data: undefined })
  const getErrors = useErrors(adapter, ROOT_SCOPE)

  const change = ({ data, errors }) => {
    if (equal(data, formState.data) || equal(data, formState.previousData))  return
    setFormState({ errors: getErrors({ data, errors }), data, previousData: formState.data })
    return adapter.onChange({ data, errors })
  }

  useEffect(() => {
    setFormState({ ...formState, data: adapter.value(value), previousData: formState.data })
  }, [value])

  return <JsonForms schema={adapter.schema}
                    uischema={adapter.uiSchema}
                    renderers={renderers}
                    cells={materialCells}
                    ajv={ajv}
                    data={formState.data}
                    onChange={change}
                    validationMode='ValidateAndHide'
                    additionalErrors={formState.errors}
  />
}

Input.Controlled = function ControlledInput ({ name, type, control, layout }) {
  return <Input type={type} value={control[0]} name={name} onChange={control[1]} layout={layout} />
}

Input.Layout = Layout
