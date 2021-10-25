import React from 'react';
import Modal from "../Modal/Modal";

import { translate } from "../../functions";

import CloseIcon from '@material-ui/icons/Close';


//state    toggleState    icon    text     buttonClick    buttonText   
export default function CheckMail(props) {


    const modalBoday =
        <div className="row">

            <div className={`col-12 ${translate('text-right pr-2', 'text-left pl-2')}`}>
                <CloseIcon className="pointer" onClick={props.toggleState} />
            </div>

            <div className="col-12 text-center">
                {props.icon}
            </div>

            <p
                className={`col-12 mt-3 text-center `}
                style={{ fontWeight: 'bold' }}
            >
                {props.text}
            </p>

            <button
                style={{ border: 'none', borderRadius: '5px', backgroundColor: '#00ab9e', padding: '0.35rem 1.5rem', color: 'white', width: 'fit-content' }}
                className="mx-auto"
                onClick={props.buttonClick}
            >
                {props.buttonText}
            </button>

        </div>

    return (
        <>
            <Modal
                modalState={props.state}
                modalBody={modalBoday}
            />
        </>
    );
}
