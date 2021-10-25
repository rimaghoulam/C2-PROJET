import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PickerDate = ({disabled, minDate, style ,className, name, selected, onChange ,onFocus ,onBlur, placeholder, dateFormat}) => {

 /*  const onChange = (date) => {
    handleChange(name, date)
} */
  
  return (

    <DatePicker 
    name = {name && name}
    selected={selected && selected } 
    onChange={onChange && onChange }
    style={style && style }
    className={className && className }
    onBlur={onBlur && onBlur }
    onFocus={onFocus && onFocus }
    minDate={minDate && minDate }
    placeholderText={ placeholder || "pick a date"}
    disabled={disabled ? disabled : false}
    dateFormat={dateFormat || 'yyyy/MM/dd'}
    />
  );
};

export default PickerDate;