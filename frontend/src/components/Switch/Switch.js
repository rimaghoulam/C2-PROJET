import React, { useState } from 'react'

import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';

const CustomisedSwitch = withStyles({
    switchBase: {
        color: '#f6944a',
        '&$checked': {
            color: '#00ab9e',
        },
        '&$checked + $track': {
            backgroundColor: '#00ab9e',
        },
    },
    checked: {},
    track: {},
})(Switch);


// checked     id     onChange
export default function SwitchComponent(props) {

    const [checked, setChecked] = useState(props.checked)

    const handleChange = () => {
        props.onChange()
        setChecked(p => !p)
    }


    return (
        <CustomisedSwitch
            id={props.id && props.id}
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
    )
}
