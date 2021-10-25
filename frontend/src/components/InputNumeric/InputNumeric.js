import React from 'react'
import NumberFormat from 'react-number-format'

export default function InputNumeric({name, onChange, value, className, style, negative, format, placeholder, onFocus, onBlur}) {
    
  /*   const onChange = (e) => {
        handleChange(name, e.target.value)
    } */


    return (
            <NumberFormat
                name= {name && name }
                value = {value && value }
                onChange= {onChange && onChange }
                placeholder={placeholder || 'Enter numbers'}
                className= {`form-control ${className ? className : ''}`} 
                style = {style && style }
                allowNegative={negative && negative }
                format={format && format }
                onFocus= {onFocus && onFocus }
                onBlur={onBlur && onBlur }
            />
    )
}