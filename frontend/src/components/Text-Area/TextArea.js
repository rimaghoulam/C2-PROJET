import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const TextArea = ({id, value,defaultValue, placeholder, name, onChange, maxRows, minRows ,className,style,onBlur,onFocus, disabled, maxLength, onKeyPress}) => {

    /* const onChange = (e) => {
        handleChange(name, e.target.value)
    } */
    
    return (
        
        <TextareaAutosize 
        id={id && id}
         name={name && name }
         onChange={onChange && onChange }
         value={value && value }
         defaultValue={defaultValue && defaultValue }
         placeholder={ placeholder || 'Enter text Here'}
         maxRows={maxRows && maxRows }
         minRows={minRows && minRows }
         className={className && className }
         style = { style && style }
         onFocus= {onFocus && onFocus }
         onBlur={onBlur && onBlur } 
        disabled= {disabled ? disabled : false}
        maxLength={maxLength && maxLength }
        onKeyPress={onKeyPress && onKeyPress }
         />  
    )
}

export default TextArea
