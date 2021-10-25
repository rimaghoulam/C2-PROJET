import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useForm, Controller } from "react-hook-form";

import { WS_LINK, } from '../../globals';
import { checkTextAlignment, formatDate, translate } from '../../functions'
import { getSessionInfo, clearSessionInfo } from '../../variable';

import Table from '../../components/Table/Table'
import Modal from '../../components/Modal/Modal'
import InputText from "../../components/InputText/InputText";

import { Button, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from 'reactstrap';

import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'

import '../../components/Table/Table.css';
import '../../App.css';
import './AdminCompanyUsers.css'

import headerLogo from '../../assets/images_png/header_logo.png'
// import pdf from "../../assets/images_svg/pdf.svg";
// import csv from "../../assets/images_svg/csv.svg";
// import moment from 'moment'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default function AdminUsers(props) {

  // styles 
  const iconsStyle = {
    background: '#ccf0eb',
    borderRadius: '13%',
    display: 'flex',
    fontSize: '18px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.6rem',
    height: '2.6rem'
  }

  let { company_id } = useParams();
  company_id = decodeURIComponent(atob(company_id));

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      password: '',
    }
  });

  // states
  const [exist, setExist] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [modalDetails, setModalDetails] = useState({
    del: ''

  })
  const [userObj, setUserObj] = useState({
    user_details: '',

  })
  const [loaded, setLoaded] = useState(false)

  //set states

  const toggledelete = () => {
    setDeleteModal(!deleteModal)
  }
  const toggleadd = () => {
    setAddModal(!addModal)
  }
  const togglesuccess = () => {
    setSuccessModal(!successModal)
  }

  const checkDelete = (event, del) => {
    event.stopPropagation()
    setModalDetails({
      del: del,
    })
    setDeleteModal(true)
  }

  // fill page on creation
  useEffect(() => {
    props.setPageTitle('Industry Users', 'مستخدمي الصناعة')
    get_request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const get_request = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      adminid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      industryid: company_id,

    }
    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}get_users_by_industry_id`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {

        if (res.data !== "role error" && res.data !== "token error") {

          setUserObj({ 'user_details': res.data, })
          props.toggleSpinner(false)
          setLoaded(true)
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

  // 	const exportTable = (data, users_id, exportType, isCompany) => {
  // 	const cancelToken = axios.CancelToken;
  // 	const source = cancelToken.source();

  // 	let users = [];
  // 	for (let i = 0; i < data.length; i++) {
  // 		users[i] = data[i].key;
  // 	}

  // 	var postedData;

  // 	postedData = {
  // 		userid: getSessionInfo("id"),
  // 		token: getSessionInfo("token"),
  // 		toe: exportType,
  //     industry_id: company_id,
  // 		users_id: users,
  // 	};

  // 	props.toggleSpinner(true);
  // 	axios({
  // 		method: "post",
  // 		url: `${WS_LINK}export_industry_users`,
  // 		data: postedData,
  // 		cancelToken: source.token,
  // 	})
  // 		.then((res) => {
  // 			if (getSessionInfo("role") === 4 && res.data !== "token error") {
  // 				props.toggleSpinner(false);
  // 				downloadFileWithExtension(res.data, `industry-users.${exportType}`, exportType);
  // 			} else {
  // 				clearSessionInfo();
  // 				window.location.reload(false).then(props.history.replace("/"));
  // 			}
  // 		})

  // 		.catch((err) => {
  // 			props.toggleSpinner(false);
  // 			if (axios.isCancel(err)) {
  // 				console.log("request canceled");
  // 			} else {
  // 				console.log("request failed");
  // 			}
  // 		});
  // };

  // function to add user

  const add_user = (data) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      adminid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      industryid: company_id,
      name: data.name,
      email: data.email
    }
    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}admin_add_new_user`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {

        if (res.data !== "role error" && res.data !== "token error") {
          if (res.data === "user email already existe")
            setExist(true)
          else {
            toggleadd()
            togglesuccess()
            reset()
          }
          props.toggleSpinner(false)
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


  // function to delete a user
  const delete_rows = (info) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      id_to_delete: info.del,
    }

    setDeleteModal(false)
    props.toggleSpinner(true)
    axios({
      method: "post",
      url: `${WS_LINK}deactivate_user`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {

        if (getSessionInfo('role') === 4 && res.data !== "token error") {

          get_request();
          setDeleteModal(false)
          setModalDetails({

            del: '',
          })
          setTimeout(() => {
            props.toggleSpinner(false)
          }, 1000);

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









  const modalBody =
    <>
      {
        getSessionInfo('language') === 'english' ?
          (
            <div>
              <div className="row ml-auto">
                <Button className="ml-auto text-right pr-2" color='link close' onClick={() => { toggleadd(); reset(); setExist(false) }}>X</Button>
              </div>
              <div className="col-12 text-center">
                <h6 className="text-center">
                  <div className="text-center">
                    <div><img src={headerLogo} width="100%" alt="" /></div>
                    <form onSubmit={handleSubmit(add_user)}>
                      <div className=" mt-4 mb-4">
                        <div className="mt-3 col-12" style={{ textAlign: 'left' }}>Name *</div>
                        <div className="col-12 mt-3">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                onChange={(e) => { onChange(e) }}
                                style={{ border: errors.name ? "1px solid red" : "" }}
                                placeholder="Name"
                              />
                            )}
                            rules={{ required: true }}
                            name="name"
                            control={control}
                          />
                          {errors.name && errors.name.type === "required" && (
                            <span className="errors">Name is required.</span>
                          )}
                        </div>
                        <div className="mt-3 col-12" style={{ textAlign: 'left' }}>Email*</div>
                        <div className="col-12 mt-3">
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                onChange={(e) => { onChange(e); setExist(false) }}
                                style={{ border: errors.email || exist ? "1px solid red" : "" }}
                                placeholder="Email"
                              />
                            )}
                            rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                            name="email"
                            control={control}
                          />
                          {errors.email && errors.email.type === "required" && (
                            <span className="errors">Email is required.</span>
                          )}
                          {errors.email && errors.email.type === "pattern" && (
                            <span className="errors">
                              Email is not valid
                            </span>
                          )}
                          {exist && (
                            <span className="errors">
                              Email is not valid
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="px-4 mt-3"
                        style={{
                          backgroundColor: "rgb(198 2 36)",
                          border: 'none',
                          fontSize: "0.9rem",
                          padding: '0.7rem 2.4rem',
                          fontWeight: '600',
                          float: 'right'
                        }}
                      >
                        Submit
                      </Button>


                    </form>
                  </div>

                </h6>
              </div>
            </div>
          )

          : // Modal Body Arabic

          (
            <div style={{ fontFamily: 'cnam-ar', textAlign: 'right' }}>
              <div className="row mr-auto">
                <Button className="ml-auto text-left pl-2" color='link close' style={{ fontFamily: 'cnam-bold' }} onClick={() => { toggleadd(); reset(); setExist(false) }}>X</Button>
              </div>
              <div className="col-12 text-center">
                <h6 className="text-center">
                  <div className="text-center">
                    <div><img src={headerLogo} width="100%" alt="" /></div>
                    <form onSubmit={handleSubmit(add_user)} className="text-right">
                      <div className=" mt-4 mb-4">
                        <div className="mt-3 col-12" style={{ textAlign: 'right' }}>اسم *</div>
                        <div className="col-12 mt-3 text-right" style={{ direction: 'rtl' }}>
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                onChange={(e) => { onChange(e) }}
                                style={{ border: errors.name ? "1px solid red" : "", textAlign: 'right' }}
                                placeholder="اسم"
                              />
                            )}
                            rules={{ required: true }}
                            name="name"
                            control={control}
                          />
                          {errors.name && errors.name.type === "required" && (
                            <span className="errors text-right">مطلوب اسم.</span>
                          )}
                        </div>
                        <div className="mt-3 col-12" style={{ textAlign: 'right' }}>بريد إلكتروني*</div>
                        <div className="col-12 mt-3 text-right" style={{ direction: 'rtl' }}>
                          <Controller
                            render={({ field: { onChange, value } }) => (
                              <InputText
                                value={value}
                                onChange={(e) => { onChange(e); setExist(false) }}
                                style={{ border: errors.email || exist ? "1px solid red" : "" }}
                                placeholder="بريد إلكتروني"
                              />
                            )}
                            rules={{ required: true, pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/ }}
                            name="email"
                            control={control}
                          />
                          {errors.email && errors.email.type === "required" && (
                            <span className="errors">البريد الالكتروني مطلوب.</span>
                          )}
                          {errors.email && errors.email.type === "pattern" && (
                            <span className="errors">
                              البريد الإلكتروني غير صالح
                            </span>
                          )}
                          {exist && (
                            <span className="errors">
                              البريد الإلكتروني غير صالح
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="px-4 mt-3"
                        style={{
                          backgroundColor: "rgb(198 2 36)",
                          border: 'none',
                          fontSize: "0.9rem",
                          padding: '0.7rem 2.4rem',
                          fontWeight: '600',
                          float: 'left'
                        }}
                      >
                        إرسال
                      </Button>


                    </form>
                  </div>

                </h6>
              </div>
            </div>
          )
      }
    </>

  const modaldelete =
    <>
      {
        getSessionInfo('language') === 'english' ?
          (
            <>
              <div className="row ml-auto">
                <Button className="ml-auto pr-1 text-right" color='link close' onClick={toggledelete}>X</Button>
              </div>
              <div className="row justify-content-center" >
                <DeleteOutlineIcon className="col-12 mb-3 mt-2" style={{ fontSize: "50" }} />
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

          : // DELETE modal ARABIC

          (
            <div style={{ textAlign: 'right', fontFamily: 'cnam-ar' }}>
              <div className="row mr-auto">
                <Button className="mr-auto ml-4" color='link close' style={{ fontFamily: 'cnam' }} onClick={toggledelete}>X</Button>
              </div>
              <div className="row text-center" >
                <DeleteOutlineIcon className="col-12 mr-auto mb-3 mt-2" style={{ fontSize: "50" }} />
              </div>
              <div className="col-12 text-center">
                <h6 className="text-center">
                  هل أنت متأكد أنك تريد حذف هذا؟
                </h6>
              </div>
              <div className="col-12 text-center">
                <p className="text-center" style={{ overflow: 'visible' }}>
                  كن حذرا، إذا قمت بالنقر فوق "نعم" سيتم حذف الصف التالي إلى الأبد!
                </p>
              </div>
              <div className="col-12 text-center">
                <Button onClick={() => delete_rows(modalDetails)} >نعم</Button>
              </div>
            </div>
          )
      }

    </>

  const modalsuccess =
    <>
      {
        getSessionInfo('language') === 'english' ?
          (
            <>
              <div className="row  ">
                <Button className="text-right pr-2" color='link close' onClick={() => { togglesuccess(); get_request() }}>X</Button>
              </div>

              <div className="col-12 text-center">
                <h6 className="text-center">
                  <div className="text-center">
                    <div><CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                    <div className="font-weight-bold mt-4 mb-4">Email sent </div>
                    <div className="text-center">
                    </div>
                  </div>
                </h6>
              </div>
            </>
          )

          : // SUCCESS MODAL ARABIC

          <div style={{ textAlign: 'right' }}>
            <div className="row  ">
              <Button className="mr-auto ml-4" color='link close' onClick={() => { togglesuccess(); get_request() }}>X</Button>
            </div>

            <div className="col-12 text-center">
              <h6 className="text-center">
                <div className="text-center">
                  <div><CheckCircleOutlineIcon className="" style={{ fontSize: "50", color: 'rgb(198 2 36)' }} /></div>
                  <div className=" mt-4 mb-4" style={{ fontFamily: 'cnam-bold-ar' }}>أرسل البريد الإلكتروني </div>
                  <div className="text-center">
                  </div>
                </div>
              </h6>
            </div>
          </div>
      }
    </>

  const LastIcons = (user_id, noDelete) =>
    <>
      <div className="d-flex" style={{ color: '#959595' }}>
        {/*       <div className=""><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/discussion/' + btoa(encodeURIComponent(company_id)))}} >View Discussions</button></div>
      <div className="ml-4"><button style={{ border: 'none', background: 'none',color:'rgb(198 2 36)'  }} onClick={(e) =>{e.stopPropagation(); props.history.push('/documents/' + btoa(encodeURIComponent(company_id)))}}>View Documents</button></div>
 */}

        <UncontrolledDropdown className={getSessionInfo('language') === 'english' ? "ml-auto" : "mr-auto"} id={user_id} onClick={e => e.stopPropagation()}>
          <DropdownToggle className="drop-button" style={{ background: 'transparent' }}>
            <EditIcon className="pb-2" style={{ fontSize: "23px", color: 'rgb(198 2 36)' }} />
          </DropdownToggle>
          <DropdownMenu right={getSessionInfo('language') === 'english' ? true : false} style={{ textAlign: getSessionInfo('language') === 'english' ? '' : 'right' }} >
            {
              getSessionInfo('language') === 'english' ?
                (
                  <div>
                    <DropdownItem><button style={{ border: 'none', background: 'none', color: 'rgb(198 2 36)' }} onClick={(e) => { e.stopPropagation(); props.history.push('/discussion/user/' + btoa(encodeURIComponent(user_id))) }} >View Discussions</button></DropdownItem><hr />
                    <DropdownItem><button style={{ border: 'none', background: 'none', color: 'rgb(198 2 36)' }} onClick={(e) => { e.stopPropagation(); props.history.push('/documents/user/' + btoa(encodeURIComponent(user_id))) }}>View Documents</button></DropdownItem>
                  </div>
                )

                : // ARABIC

                (
                  <div>
                    <DropdownItem><button style={{ border: 'none', background: 'none', color: 'rgb(198 2 36)', fontFamily: 'cnam-ar', textAlign: 'right' }} onClick={(e) => { e.stopPropagation(); props.history.push('/discussion/user/' + btoa(encodeURIComponent(user_id))) }} >عرض المناقشات</button></DropdownItem><hr />
                    <DropdownItem><button style={{ border: 'none', background: 'none', color: 'rgb(198 2 36)', fontFamily: 'cnam-ar', textAlign: 'right' }} onClick={(e) => { e.stopPropagation(); props.history.push('/documents/user/' + btoa(encodeURIComponent(user_id))) }}>عرض المستندات</button></DropdownItem>
                  </div>
                )
            }
          </DropdownMenu>
        </UncontrolledDropdown>
        <div >
          {!noDelete && <button style={{ border: 'none', background: 'none', color: '#959595' }} onClick={(event) => checkDelete(event, user_id)}><DeleteOutlineIcon className="hov" style={{ fontSize: "25px", color: 'rgb(198 2 36)' }} /></button>}</div>
      </div>
    </>


  // the columns

  const cols1 = [
    {
      key: 'Name', title: getSessionInfo('language') === 'english' ? ' NAME' : 'اسم', field: 'Name', cellStyle: { whiteSpace: 'pre-line', paddingLeft: '10px' },
      render: rowData =>
        <div className="d-flex pl-1">
          <div style={iconsStyle}>{rowData.Name.name.charAt(0).toUpperCase()}</div>
          <div className={`${translate('ml-1', 'mr-1')} ${checkTextAlignment()}`}>{rowData.Name.name}<br /> <span style={{ color: '#6C6C6C' }}>{rowData.Name.email}</span></div>
        </div>,
      customFilterAndSearch: (term, rowData) => (rowData.Name.props.children[0].toLowerCase()).indexOf(term) !== -1 || (rowData.Name.props.children[1].props.children).indexOf(term) !== -1,
      customSort: (a, b) => a.Name.name.localeCompare(b.Name.name)
    },
    { key: 'mobile', title: getSessionInfo('language') === 'english' ? 'MOBILE' : 'التليفون المحمول', field: 'mobile' },
    { key: 'role', title: getSessionInfo('language') === 'english' ? 'ROLE' : 'وظيفة', field: 'role', },
    {
      key: 'status', title: getSessionInfo('language') === 'english' ? 'STATUS' : 'الحالة', field: 'status',
      render: rowData => <span style={{ color: rowData.status === 'Not Active' ? 'red' : 'black' }} >{rowData.status}</span>,
      customFilterAndSearch: (term, rowData) => (rowData.status.toLowerCase()).indexOf(term) !== -1
    },
    { key: 'createdOn', title: getSessionInfo('language') === 'english' ? 'CREATED ON' : 'تم إنشاؤها ', field: 'createdOn', defaultSort: 'desc' },
    { key: 'icon', title: '', field: 'icon', sorting: false }
  ]


  const rows1 = []
  if (typeof userObj.user_details !== 'undefined') {
    for (let i = 0; i < userObj.user_details.length; i++) {
      let item = userObj.user_details[i]
      rows1.push(
        {
          key: item.user_id,
          roleid: item.user_role_role_id,
          Name: { name: item.user_name, email: item.user_email },
          mobile: item.user_mobile,
          createdOn: formatDate(item.created_date, true),
          role: item.user_role,
          status: item.user_active === 1 ? "Active" : "Not Active",
          icon: LastIcons(item.user_id, item.user_active === 1 ? true : false)
        })
    }

  }


  return <>

    {
      getSessionInfo('language') === 'english' ?
        (
          <>
            <div className="hide_scrollbar" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto', width: '100%' }}>
              <div >

                {deleteModal &&
                  <Modal
                    name="deleteModal"
                    modalState={deleteModal}
                    changeModalState={toggledelete}
                    modalBody={modaldelete} />
                }
                {addModal &&
                  <Modal
                    name="addModal"
                    modalState={addModal}
                    changeModalState={toggleadd}
                    modalBody={modalBody} />
                }
                {successModal &&
                  <Modal
                    id="success"
                    name="successModal"
                    modalState={successModal}
                    changeModalState={togglesuccess}
                    modalBody={modalsuccess} />
                }


                {
                  loaded &&
                  <>
                    <div className="mt-3 back ml-1" style={{ color: 'rgb(198 2 36)' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon style={{ fontSize: '13px', marginTop: "-2px" }} />Back</div>
                    <div className="tableWithEdit">
                      <Table
                        name='cnam-user'
                        key='cnam-users'
                        title={<div className="font-weight-bold text-nowrap ml-3 ml-md-0" style={{ fontSize: '17px' }}>Industry Users</div>}
                        columns={cols1}
                        data={rows1}
                        options={{
                          pageSize: 5,
                          emptyRowsWhenPaging: false,
                          pageSizeOptions: [5, 10],

                          // selection: true,
                          // rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
                          paging: true,
                          headerStyle:
                          {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap'
                          },
                          rowStyle: {
                            fontSize: '0.95rem',
                          }
                        }}

                        actions={[
                          {
                            tooltip: '',
                            position: 'toolbar',
                            icon: () => <div><Button className="d-block ml-1 ml-md-0" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none' }} >+ Add Users</Button></div>,
                            onClick: () => toggleadd()
                          },
                          //   											{
                          // 	tooltip: "Download as CSV", icon: () => (
                          // 		<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
                          // 			<img src={csv} alt="" style={{ width: "20px" }} />
                          // 			<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as CSV</span>
                          // 		</button>
                          // 	),
                          // 	onClick: (evt, data) => exportTable(data, "challenge", "csv", true),
                          // },
                          // {
                          // 	tooltip: "Download as PDF",
                          // 	icon: () => (
                          // 		<button style={{ background: "none", borderRadius: "4px", border: "1px solid lightgrey" }}>
                          // 			<img src={pdf} alt="" style={{ width: "20px" }} />
                          // 			<span style={{ fontSize: "13px", fontWeight: "bold" }}> Download as PDF</span>
                          // 		</button>
                          // 	),
                          // 	onClick: (evt, data) => exportTable(data, "challenge", "pdf", true),
                          // },
                        ]}
                        rowClick={(event, rowData) => {
                          props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}`)
                        }}


                      />
                    </div>
                  </>
                }

              </div>
            </div>
          </>
        )

        : // ----------ARABIC----------

        (
          <div style={{ width: '100%', fontFamily: 'cnam-ar', textAlign: 'right' }}>
            <div className="hide_scrollbar" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto', width: '100%' }}>
              <div >

                {deleteModal &&
                  <Modal
                    name="deleteModal"
                    modalState={deleteModal}
                    changeModalState={toggledelete}
                    modalBody={modaldelete} />
                }
                {addModal &&
                  <Modal
                    name="addModal"
                    modalState={addModal}
                    changeModalState={toggleadd}
                    modalBody={modalBody} />
                }
                {successModal &&
                  <Modal
                    id="success"
                    name="successModal"
                    modalState={successModal}
                    changeModalState={togglesuccess}
                    modalBody={modalsuccess} />
                }


                {
                  loaded &&
                  <>
                    <div className="  back text-right mr-2 mt-3" style={{ color: 'rgb(198 2 36)', fontFamily: 'cnam-ar' }} onClick={() => props.history.goBack()}><ArrowBackIosIcon className="ml-1" style={{ fontSize: '13px', marginTop: "-2px", transform: 'rotate(180deg)' }} />إرجع</div>
                    <div className="tableWithEdit table-arabic">
                      <Table
                        name='cnam-user'
                        key='cnam-users'
                        title={<div className="text-nowrap mr-3 mr-md-0" style={{ fontSize: '17px', fontFamilt: 'cnam-bold-ar' }}>مستخدمي الصناعة</div>}
                        columns={cols1}
                        data={rows1}
                        options={{
                          pageSize: 5,
                          emptyRowsWhenPaging: false,
                          pageSizeOptions: [5, 10],

                          // selection: true,
                          // rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
                          paging: true,
                          headerStyle:
                          {
                            fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                            paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                            fontFamily: 'cnam-ar',
                          },
                          rowStyle: {
                            fontSize: '0.95rem',
                          }
                        }}

                        actions={[
                          {
                            tooltip: '',
                            position: 'toolbar',
                            icon: () => <div><Button className="d-block mr-1 mr-md-0" style={{ fontWeight: '600', background: 'rgb(198 2 36)', padding: '0.6rem 2rem', border: 'none', fontFamily: 'cnam-ar', textAlign: 'right' }} >+ إضافة المستخدمين</Button></div>,
                            onClick: () => toggleadd()
                          }
                        ]}
                        rowClick={(event, rowData) => {
                          props.history.push(`/user_details/${btoa(encodeURIComponent(rowData.key))}`)
                        }}


                      />
                    </div>
                  </>
                }

              </div>
            </div>
          </div>

        )
    }

  </>

}