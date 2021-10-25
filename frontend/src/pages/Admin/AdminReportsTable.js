import React, { useState } from 'react';
import axios from 'axios'

import Table from '../../../components/Table/Table'
import Modal from '../../../components/Modal/Modal';

import {WS_LINK} from '../../../globals'
import { getSessionInfo } from '../../../variable';

import { Button } from 'reactstrap';

import '../../../App.css';

// import Selector from "../../components/Selector/Selector";
// import DatePicker from '../../components/Date-Picker/PickerDate'
// import InputText from "../../components/InputText/InputText";
// import Calendar from '../../assets/images/calendar.svg'


export default function AdminReports(props) {

    // STATE
    const [modalState, setModalState] = useState(false)
    const [reportData, setReportData] = useState('')

    // SET STATE
    const toggleModalState = () => {
        setModalState(!modalState)
    }
    const handleChange = (name, value) => {
        setReportData({...reportData, [name] : value})
    }

    // FUNCTIONS
    const reset = () => {
        document.getElementById("user").value = ""
        document.getElementById("position").value = ""
        document.getElementById("company").value = ""
        document.getElementById("industry").value = ""
        document.getElementById("challenge").value = ""
        document.getElementById("status").value = ""
        document.getElementById("challengeName").value = ""
        document.getElementById("date").value = ""

        setReportData('')
    }

    const fillReport = () => {
        const postedData = {
            
        }

        props.toggleSpinner(true)

        const cancelToken = axios.CancelToken;
        const source = cancelToken.source()
        axios({
            method: "post",
            url: `${WS_LINK}create_report`,
            data: postedData,
            cancelToken: source.token,
        })
        .then(res => {
            
        })
        .catch(err => {
            props.toggleSpinner(false)
            if (axios.isCancel(err)) {
                console.log('request canceled');
            }
            else {
                console.log("request failed")

            }
        })
    }


    // TABLE DATA
    const cols1 = [
        { title: 'NAME', field: 'Name', },
        { title: 'TYPE', field: 'type', },
        { title: 'UPLOADER', field: 'createdBy', },
        { title: 'CREATED ON', field: 'createdOn', },
        { title: '', field: 'status' }
    ]


    // MODAL BODY

    const modalBody =
        <>
            <div className="row ml-auto">
                <Button className="ml-auto mr-4 mt-1" color='link close' onClick={toggleModalState}>X</Button>
            </div>

            <div className="container">
                <div className="h4 mb-5 font-weight-bold ">Create a new report</div>

                <div className="font-weight-bold">By user</div>
                <div className="col-lg-12 p-0 d-flex mb-3">

                    <div className='col-lg-6 pl-0'>

                        <select id="user" onChange={ (e, name="user") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Select user</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>

                    </div>
                    <div className='col-lg-6 pr-0 '>
                        <select id="position" onChange={ (e, name="position") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Select Position</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>
                    </div>
                </div>

                <div className="font-weight-bold mt-5">By company</div>
                <div className="col-lg-12 p-0 d-flex mb-3">

                    <div className='col-lg-6 pl-0'>
                        <select id="company" onChange={ (e, name="company") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Select company</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>
                    </div>
                    <div className='col-lg-6 pr-0 '>
                        <select id="industry" onChange={ (e, name="industry") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Industry</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>
                    </div>
                </div>


                <div className="font-weight-bold mt-5">By type</div>
                <div className="col-lg-12 p-0 d-flex mb-3">

                    <div className='col-lg-6 pl-0'>
                        <select id="challenge" onChange={ (e, name="challenge") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Challenge</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>
                    </div>
                    <div className='col-lg-6 pr-0 '>
                        <select id="status" onChange={ (e, name="status") => handleChange(name, e.target.value)} required className="w-100 mt-2" style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', }}>
                            <option value="" disabled selected>Status</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-12 p-0 d-flex">

                    <div className='col-lg-6 pl-0'>
                        <input
                            id="challengeName"
                            type="text"
                            placeholder='Challenge name'
                            style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                            className="w-100"
                            onChange={ (e, name="challengeName") => handleChange(name, e.target.value)}
                        />

                       
                    </div>

                    <div className='col-lg-6 pr-0 mb-3 '>

                        {/* <DatePicker
                            className='form-control'
                            placeholder={"Submission date"}
                        /> */}
                        <input
                            type="date"
                            // placeholder="mm"
                            id="date"
                            name="date"
                            className="w-100"
                            style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                            onChange={ (e, name="date") => handleChange(name, e.target.value)}
                        />
                    </div>
                </div>

                <hr />

                <div className="d-flex mb-3">
                    <button style={{ background: 'none', border: "none", fontSize: '15px' }} onClick={reset}>Reset</button>

                    <Button style={{ fontWeight: '600', background: 'grey', padding: '0.6rem 1.2rem', border: 'none' }} className="ml-auto mr-3" onClick={toggleModalState}>Cancel</Button>
                    <Button style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 1.2rem', border: 'none' }} onClick={fillReport}>Generate</Button>

                </div>
            </div>
        </>


    return <>
    {
        getSessionInfo('language') === 'english' ? 
        (
            <div>
                <div className="hide_scrollbar" style={{ height: 'calc(100vh - 118px)', overflowY: 'scroll' }}>
            <div >
                {modalState &&
                    <Modal
                        name="modal"
                        modalState={modalState}
                        changeModalState={toggleModalState}
                        modalBody={modalBody} />
                }
                <Table
                    name='Reports-table'
                    title={<div className="font-weight-bold text-nowrap" style={{ fontSize: '17px' }}>Reports</div>}
                    columns={cols1}
                    //data={rows1}
                    options={{
                        pageSize: 5,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5, 10],

                        paging: true,
                        headerStyle:
                        {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                        }
                    }}

                    actions={[
                        {
                            icon: () => <Button style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.5rem 1.8rem', border: 'none' }}>New report</Button>,
                            tooltip: "",
                            position: "toolbar",
                            onClick: () => toggleModalState()
                        }
                    ]}


                />
            </div>
        </div>
            </div>
        )

        :

        (
            <div style={{ textAlign:'right', fontFamily:'cnam-ar' }}>
                <div className="hide_scrollbar" style={{ height: 'calc(100vh - 118px)', overflowY: 'scroll' }}>
            <div >
                {modalState &&
                    <Modal
                        name="modal"
                        modalState={modalState}
                        changeModalState={toggleModalState}
                        modalBody={modalBody} />
                }
                <Table
                    name='Reports-table'
                    title={<div className="text-nowrap" style={{ fontSize: '17px', fontFamily:'cnam-bold-ar' }}>تقارير</div>}
                    columns={cols1}
                    //data={rows1}
                    options={{
                        pageSize: 5,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [5, 10],

                        paging: true,
                        headerStyle:
                        {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                        }
                    }}

                    actions={[
                        {
                            icon: () => <Button style={{ background: 'rgb(198 2 36)', padding: '0.5rem 1.8rem', border: 'none', fontFamily:'cnam-ar' }}>تقرير جديد</Button>,
                            tooltip: "",
                            position: "toolbar",
                            onClick: () => toggleModalState()
                        }
                    ]}


                />
            </div>
        </div>
            </div>
        )
    }
        
    </>
}