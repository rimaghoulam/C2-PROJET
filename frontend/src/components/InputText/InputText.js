import React from 'react'
import './InputText.css'

function InputText({ id, type, value, className, style, name, maxLength, placeholder, onFocus, onBlur, disabled, ref, onChange, onKeyPress, defaultValue, required }) {

    /*    const onChange = (e) => {
          handleChange(name, e.target.value)
      }  */

    return (
        <input
            id={id && id}
            type={type || "text"}
            name={name && name}
            value={value && value}
            onChange={onChange && onChange}
            placeholder={placeholder || 'Enter text'}
            maxLength={maxLength || 100}
            className={`form-control ${className ? className : ''}`}
            style={style && style}
            onFocus={onFocus && onFocus}
            onBlur={onBlur && onBlur}
            disabled={disabled ? disabled : false}
            ref={ref && ref}
            onKeyPress={onKeyPress && onKeyPress}
            defaultValue={defaultValue && defaultValue}
            required={required && required}
        />
    )
}

export default InputText