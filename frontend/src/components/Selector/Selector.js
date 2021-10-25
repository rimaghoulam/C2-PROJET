import React from 'react';
import Select from 'react-select';

export default function Selector({ id,isMulti, required, name, options, value, placeholder, className, style, onChange, onFocus, onBlur, isClearable, defaultValue,styles }) {


  return (
    <Select

      //   styles={{
      //     ...styles,
      //     control: ( provided) => ({
      //         ...provided,
      //         '&:hover': { borderColor: 'rgb(198 2 36)' }, // border style on hover
      //         border: '2px solid lightgray',
      //         boxShadow: '0px 1px 5px -2px #888888'
      //     }),

      // }}

      // styles={styles}
      id={id && id }
      isMulti={isMulti ? true : false}
      name={name && name }
      options={ options || []}
      onChange={onChange && onChange }
      value={value && value }
      placeholder={ placeholder || "Select..."}
      className={className && className }
      style={style && style }
      onFocus={onFocus && onFocus }
      onBlur={onBlur && onBlur }
      isClearable={isClearable ? true : false}
      required={required ? true : false}
      defaultValue={defaultValue && defaultValue }

    />
  );
}