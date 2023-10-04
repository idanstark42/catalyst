import React from 'react'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { rankWith, isNumberControl, and, not, optionIs } from '@jsonforms/core'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Input from '@mui/material/Input'
import IconButton from '@mui/material/IconButton'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

const STYLES = {
  '.MuiInput-root': {
    '&::before': { content: 'unset' },
    '&::after': { content: 'unset' },
    input: { textAlign: 'center' }
  }
}

const renderer = withJsonFormsControlProps(function NumberControl ({ data, handleChange, path, ...options }) {
  const { minimum, maximum } = options.schema

  const valueInRange = value => {
    value = Number(value)
    if (minimum)  value = Math.max(value, minimum)
    if (maximum)  value = Math.min(value, maximum)
    return value
  }

  return <Stack direction='row' alignItems='center'>
    <Typography variant='button' sx={{ flexGrow: 1 }}>{path} :</Typography>
    <Stack className='number-control' direction='row' width='7rem' alignItems='center' sx={STYLES}>
      <IconButton disabled={data === minimum} onClick={() => handleChange(path, data - 1)}><RemoveCircleIcon fontSize='small'/></IconButton>
      <Input value={data === undefined ? 0 : data} onChange={event => handleChange(path, valueInRange(event.target.value))} />
      <IconButton disabled={data === maximum} onClick={() => handleChange(path, data + 1)}><AddCircleIcon fontSize='small'/></IconButton>
    </Stack>
  </Stack>
})

const tester = rankWith(3, and(isNumberControl, not(optionIs('slider', true))))

export default { renderer, tester }
