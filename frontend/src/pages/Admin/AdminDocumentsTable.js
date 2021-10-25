/* eslint-disable jsx-a11y/anchor-has-content */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

import { Button } from 'reactstrap'

import Table from '../../components/Table/Table'
import Modal from '../../components/Modal/Modal'

import { WS_LINK } from '../../globals';
import { formatDate, downloadFile, translate } from '../../functions'
import { getSessionInfo, clearSessionInfo } from '../../variable';

import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import '../../App.css';

export default function AdminDocuments(props) {

  let { company_id, type } = useParams();
  company_id = decodeURIComponent(atob(company_id));

  ////////////// STATES
  const [loaded, setLoaded] = useState(false)
  const [modalState, setModalState] = useState(false)
  const [modalDetails, setModalDetails] = useState({
    id: '',
    type: '',
    document: ''
  })
  const [documentsObj, setDocumentsObj] = useState({

    challenge_details: [],
    industry_details: [],
    nda: []

  })

  const [rows1, setRows1] = useState([])

  /////////////////// SET STATES
  const toggleModalState = () => {
    setModalState(!modalState)
  }

  const checkDelete = (docName, id, type) => {
    setModalDetails({
      id: id,
      document: docName,
      type: type
    })
    setModalState(true)
  }

  ////////////////// PAGE CREATION
  useEffect(() => {
    props.setPageTitle('Industry Documents', 'وثائق الصناعة')
    get_request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get_request = () => {

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      adminid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      id: company_id,
      type: type
    }
    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}get_documents_by_industry_id`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {

        if (res.data !== "role error" && res.data !== "token error") {
          let challenge = res.data[2]
          let nda = res.data[1]
          let industry = res.data[0]
          setDocumentsObj({ 'challenge_details': challenge, 'industry_details': industry, 'nda': nda })
          props.toggleSpinner(false)
          setLoaded(true)
          setModalState(false)
        }

        else {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
      })


      .catch(err => {

        props.toggleSpinner(false)
        if (axios.isCancel(err)) {
          console.log('request canceled')
        }
        else {
          console.log("request failed")
        }
      });
  }


  ///////////////////////// FUNCTIONS

  // delete document
  const delete_rows = (info) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      documenttype: info.type,
      idrow: info.id,
      // idrow: 123123123
    }
    setModalState(false)
    props.toggleSpinner(true)
    axios({
      method: "post",
      url: `${WS_LINK}delete_document`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        if (getSessionInfo('role') === 4 && res.data !== "token error") {
          setModalDetails({
            id: '',
            type: '',
            document: ''
          })
          setLoaded(false)
          get_request()
          setModalState(false)
          // setTimeout(() => {
          //   props.toggleSpinner(false)
          // }, 1000);
        }

        else {
          clearSessionInfo()
          window.location.reload(false).then(props.history.replace('/'))
        }
      })
      .catch(err => {
        props.toggleSpinner(false)
        if (axios.isCancel(err)) {
          console.log('request canceled')
        }
        else {
          console.log("request failed")
        }
      });
  }


  /////////////////////////////// STYLES

  const iconsStyle = {
    background: '#ccf0eb',
    borderRadius: '13%',
    fontSize: '40px',
    padding: '8px',
    color: 'rgb(198 2 36)'
  }


  //////////// PAGE COMPONENTS


  // delete document modal
  const modalBody =
    <>
      {
        getSessionInfo('language') === 'english' ?
          (
            <>
              <div className="row ml-auto">
                <Button className="text-right pr-2" color='link close' onClick={toggleModalState}>X</Button>
              </div>
              <div className="row text-center" >
                <DeleteOutlineIcon className="col-12 mx-auto mb-3 mt-2" style={{ fontSize: "55" }} />
              </div>
              <div className="col-12 text-center">
                <h6 className="text-center">
                  Are you sure you want to delete this?
                </h6>
              </div>
              <div className="col-12 text-center">
                <p className="text-center" style={{ overflow: 'visible' }}>
                  Be careful, if you click yes the following row will be deleted forever!
                </p>
              </div>
              <div className="col-12 text-center">
                <Button onClick={() => delete_rows(modalDetails)} >Yes</Button>
              </div>
            </>
          )

          : // ARABIC modal body

          (
            <div style={{ fontFamily: 'cnam-ar', textAlign: 'right' }}>
              <div className="row mr-auto">
                <Button className="text-left pl-2" color='link close' onClick={toggleModalState}>X</Button>
              </div>
              <div className="row text-center" >
                <DeleteOutlineIcon className="col-12 mx-auto mb-3 mt-2" style={{ fontSize: "55" }} />
              </div>
              <div className="col-12 text-center">
                <h6 className="text-center">
                  هل أنت متأكد أنك تريد حذف هذا؟
                </h6>
              </div>
              <div className="col-12 text-center">
                <p className="text-center" style={{ overflow: 'visible' }}>
                  !كن حذرا، إذا قمت بالنقر فوق "نعم" سيتم حذف الصف التالي إلى الأبد
                </p>
              </div>
              <div className="col-12 text-center">
                <Button onClick={() => delete_rows(modalDetails)} >نعم</Button>
              </div>
            </div>
          )
      }
    </>





  // TABLE

  //table data jsx


  const LastIcons = (id, type, fullDocName, docName) =>
    <>
      <div className="d-flex" style={{ color: '#959595' }}>
        <div className="ml-2 mr-4 pointer ml-auto" onClick={() => { downloadFile(fullDocName, docName) }}>
          <GetAppIcon style={{ marginTop: '3px', color: '#e98300' }} /></div>
        <div><button style={{ border: 'none', background: 'none', color: 'rgb(198 2 36)' }} onClick={() => checkDelete(document, id, type)}><DeleteOutlineIcon /></button></div>
      </div>
    </>

  const LastIcons_nda = (fullDocName, docName) =>
    <>
      <div className="d-flex" style={{ color: '#959595' }}>
        <div className="ml-2 mr-4 pointer ml-auto" onClick={() => { downloadFile(fullDocName, docName) }}>
          <GetAppIcon style={{ marginTop: '3px', color: '#e98300' }} /></div>
        <div><button style={{ border: 'none', background: 'none', cursor: 'default', color: 'grey' }} ><DeleteOutlineIcon /></button></div>
      </div>
    </>



  // table columns



  const cols2 = [
    {
      title: getSessionInfo('language') === 'english' ? ' NAME' : 'اسم', field: 'Name',
      render: (rowData) =>
        <div className="d-flex pl-1">
          <PictureAsPdfIcon style={iconsStyle} />
          <div style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }} className={`${translate('ml-2', 'mr-2')}`}>
            {rowData.Name.name}<br />
            <div key={rowData.Name.fullDocName} style={{ color: '#6C6C6C' }}>
              {rowData.Name.docName}
            </div>
          </div>
        </div>,
      customFilterAndSearch: (term, rowData) =>
        (rowData.Name.name.toLowerCase()).indexOf(term) !== -1 || (rowData.Name.docName).indexOf(term) !== -1,
      customSort: (a, b) => a.Name.name.localeCompare(b.Name.name)
    },
    { title: getSessionInfo('language') === 'english' ? 'TYPE' : 'نوع', field: 'type', render: rowData => <div style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }}>{rowData.type}</div> },
    { title: getSessionInfo('language') === 'english' ? 'CREATED ON' : 'تم إنشاؤها ', field: 'createdOn', defaultSort: 'desc', render: rowData => <div style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }}>{rowData.createdOn}</div> },
    { title: getSessionInfo('language') === 'english' ? '' : '', field: 'status', sorting: false }
  ]

  // table rows


  useEffect(() => {

    let rows = []





    if (documentsObj.industry_details.length !== 0) {
      for (let i = 0; i < documentsObj.industry_details.length; i++) {
        let item = documentsObj.industry_details[i]
        rows.push(
          {
            key: item.industry_details_id,
            Name: { name: `company profile ${documentsObj.industry_details.length > 1 ? `(${i + 1})` : ''}`, docName: item.profile_name, fullDocName: item.profile_path },
            type: "Industry document",
            createdOn: item.created_date && formatDate(item.created_date, true),
            status: LastIcons(item.industry_details_id, 'profile', item.profile_path, item.profile_name)
          }
        )
      }
    }


    if (documentsObj.nda.length !== 0) {
      let item = documentsObj.nda[0]
      let docName
      if (item.signed_file)
        docName = `${documentsObj.nda[0].file_name}`
      else docName = "No document"


      rows.push(
        {
          key: item.signed_id,
          Name: { name: 'NDA', docName: docName, fullDocName: item.signed_file },
          type: 'NDA document',
          createdOn: item.created_date && formatDate(item.created_date, true),
          status: LastIcons_nda(item.signed_file, docName)
        }
      )
    }


    let item
    if (type === 'industry') {
      for (let i = 0; i < documentsObj.challenge_details.length; i++) {
        item = documentsObj.challenge_details[i]
        for (let j = 0; j < item.length; j++) {
          if (item[j].document_path !== null) {
            const docName = item[j].document_name
            rows.push(
              {
                key: item[j].challenge_id,
                Name: { name: item[j].challenge_name, docName: docName, fullDocName: item[j].document_path },
                type: "Challenge Document",
                createdOn: item[j].date && formatDate(item[j].date, true),
                status: LastIcons(item[j].document_id, 'challenge', item[j].document_path, docName)
              }
            )
          }
        }
      }

    }
    else {
      item = documentsObj.challenge_details
      for (let j = 0; j < item.length; j++) {

        if (item[j].document_path !== null) {
          const docName = item[j].document_name
          rows.push(
            {
              key: item[j].challenge_id,
              Name: { name: item[j].challenge_name, docName: docName, fullDocName: item[j].document_path },
              type: "Challenge Document",
              createdOn: item[j].created_date && formatDate(item[j].created_date, true),
              status: LastIcons(item[j].document_path, item[j].challenge_id, item[j].document_path, docName)
            }
          )
        }
      }
    }





    setRows1(rows)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])




  return <>
    {
      getSessionInfo('language') === 'english' ?
        (
          <>
            <div className="hide_scrollbar w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'scroll' }}>
              <div >
                {modalState &&
                  <Modal
                    name="deleteModal"
                    modalState={modalState}
                    changeModalState={toggleModalState}
                    modalBody={modalBody} />
                }

                {
                  loaded &&
                  <>
                    <div className="mt-3 back ml-1" style={{ color: 'rgb(198 2 36)' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '13px', marginTop: "-2px" }} />Back</div>
                    <Table
                      name='Documents-table'
                      title={<div className="font-weight-bold text-nowrap ml-3 ml-md-0" style={{ fontSize: '17px' }}>Industry Documents</div>}
                      columns={cols2}
                      data={rows1}
                      options={{

                        emptyRowsWhenPaging: false,
                        headerStyle:
                        {
                          fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                          paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap'
                        }
                      }}
                    // rowClick={(event, rowData) => {
                    //   downloadFile(rowData.Name.fullDocName, rowData.Name.docName)
                    // }}

                    />
                  </>
                }
              </div>
            </div>
          </>
        )

        :

        (
          <div style={{ width: '100%', fontFamily: 'cnam-ar', textAlign: 'right' }}>
            <div className="hide_scrollbar w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'scroll' }}>
              <div >
                {modalState &&
                  <Modal
                    name="deleteModal"
                    modalState={modalState}
                    changeModalState={toggleModalState}
                    modalBody={modalBody} />
                }
                <div className='table-arabic'>
                  {
                    loaded &&
                    <>
                      <div className=" back text-right mr-2 mt-3" style={{ color: 'rgb(198 2 36)', fontFamily: 'cnam-ar' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon className="ml-1" style={{ fontSize: '13px', marginTop: "-2px", transform: 'rotate(180deg)' }} />إرجع</div>
                      <Table
                        name='Documents-table'
                        title={<div className="font-weight-bold text-nowrap mr-3 mr-md-0" style={{ fontSize: '17px', fontFamily: 'cnam-ar' }}>وثائق الصناعة</div>}
                        columns={cols2}
                        data={rows1}
                        options={{

                          emptyRowsWhenPaging: false,
                          headerStyle:
                          {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                            fontFamily: 'cnam-ar',
                            textAlign: 'center'
                          }
                        }}
                      // rowClick={(event, rowData) => {
                      //   downloadFile(rowData.Name.fullDocName, rowData.Name.docName)
                      // }}

                      />
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
        )
    }

  </>
}