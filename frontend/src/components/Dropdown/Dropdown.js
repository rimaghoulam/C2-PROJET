import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { getSessionInfo } from '../../variable';

// title:string
// caret:boolean
//noHover:boolean
//onClick:function for the dropDown
//data:array of objects{onClick:function   text:string|JSX   divider:boolean}
//menuRight:boolean
//dropDownStyle dropDownToggleStyle dropDownMenuStyle dropDownItemStyle className

export default function DropdownComponent(props) {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);

    const doNothing = () => {

    }

    return (
        <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            onMouseEnter={!props.noHover ? toggle : doNothing}
            onMouseLeave={!props.noHover ? toggle : doNothing}
            style={props.dropDownStyle}
            className={props.className}
        >
            <DropdownToggle caret={props.caret} style={props.dropDownToggleStyle} onClick={props.onClick || (!props.noHover ? toggle : doNothing)}>
                {props.title}
            </DropdownToggle>
            <DropdownMenu style={props.dropDownMenuStyle} right={props.menuRight}>
                {
                    props.data.map(item =>
                        <>
                            <DropdownItem
                                style={{ textAlign: getSessionInfo('language') === 'english' ? 'left' : 'right', ...props.dropDownItemStyle }}
                                onClick={item.onClick || doNothing}
                            >
                                {item.text}
                            </DropdownItem>

                            {item.divider && <DropdownItem divider />}
                        </>
                    )
                }
            </DropdownMenu>
        </Dropdown>
    )
}
