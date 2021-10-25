import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { WS_LINK } from '../../globals';
import { getSessionInfo, clearSessionInfo } from '../../variable';

import { Button } from 'reactstrap'

import Table from '../../components/Table/Table'

import '../../App.css';
import '../../components/Table/Table.css';
import './AdminAnnouncement.css'

export default function AdminAnnouncement(props) {

  // the states

  const [loaded, setLoaded] = useState(false)
  const [info, setInfo] = useState('')

  const get_request = () => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    props.toggleSpinner(true)

    axios({
      method: "get",
      url: `${WS_LINK}get_campaigns`,
      cancelToken: source.token,
    })
      .then(res => {

        if (getSessionInfo('role') === 4 && res.data !== "token error") {


          setInfo(res.data)
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

  useEffect(() => {
    props.setPageTitle('Announcements', 'الإعلانات')
    get_request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log(info)


  // styles 
  const iconsStyle = {
    background: '#ccf0eb',
    borderRadius: '13%',
    display: 'flex',
    fontSize: '18px',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.3rem',
    height: '2.3rem'
  }






  // the columns

  const cols = [
    {
      key: 'icon', field: 'icon', title: getSessionInfo('language') === 'english' ? ' CAMPAIGN NAME' : ' اسم الحملة', cellStyle: { width: '20%' },
      render: rowData =>
        <div className="d-flex" style={{ alignItems: 'center' }}><div className="ml-2" style={iconsStyle}>{rowData.icon.props.children[0].props.children}</div><div className="ml-2">{rowData.icon.props.children[1].props.children}</div></div>,
      customFilterAndSearch: (term, rowData) => (rowData.icon.props.children[1].props.children.toLowerCase()).indexOf(term) !== -1

    },

    { key: 'Subject', title: getSessionInfo('language') === 'english' ? 'SUBJECT' : 'موضوعات', field: 'Subject' },
    { key: 'recipients', title: getSessionInfo('language') === 'english' ? 'RECIPIENTS' : 'المستفيدون', field: 'recipients', cellStyle: { textAlign: getSessionInfo('language') === 'english' && 'center', paddingRight: getSessionInfo('language') === 'english' && '8%' } },
    { key: 'open_rate', title: getSessionInfo('language') === 'english' ? 'OPEN RATE' : 'معدل مفتوح', field: 'open_rate', cellStyle: { textAlign: getSessionInfo('language') === 'english' && 'center', paddingRight: getSessionInfo('language') === 'english' && '8%' } },
    { key: 'click_rate', title: getSessionInfo('language') === 'english' ? 'CLICK RATE' : 'انقر معدل', field: 'click_rate', cellStyle: { textAlign: getSessionInfo('language') === 'english' && 'center', paddingRight: getSessionInfo('language') === 'english' && '8%' } },
    { key: 'Status', title: getSessionInfo('language') === 'english' ? 'STATUS' : 'الحالة', field: 'status' },

    /* { key: 'details', field: 'detail',title:''}, */
  ]


  const rows1 = []

  for (let i = 0; i < info.length; i++) {
    let item = info[i]
    rows1.push(
      {
        key: item.id,
        icon: <div className="d-flex" style={{ alignItems: 'center' }}><div className="" style={iconsStyle}>{item.settings.title.charAt(0).toUpperCase()}</div><div>{item.settings.title}</div></div>,
        Subject: item.settings.subject_line,
        recipients: <div style={{ textAlign: getSessionInfo('language') === 'english' ? 'left' : 'right' }}>{item.status === 'sent' ? item.emails_sent : ''}</div>,
        open_rate: <div style={{ textAlign: getSessionInfo('language') === 'english' ? 'left' : 'right' }}>{item.status === 'sent' ? item.report_summary.open_rate : ''} </div>,
        click_rate: <div style={{ textAlign: getSessionInfo('language') === 'english' ? 'left' : 'right' }}>{item.status === 'sent' ? item.report_summary.click_rate : ''} </div>,
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),

/*           detail: <span className="pointer px-4 py-2" style={{color:'white',fontWeight: '600',background: 'rgb(198 2 36)',  border: 'none', borderRadius:'5px'}}>view details</span>
 */        })
  }




  return <>
    {getSessionInfo('language') === 'english' ?
      (<div className="w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto' }}>

        <div >
          {
            loaded &&
            <Table
              name='announcements'
              key='announcements'
              title={`Announcements (${rows1.length})`}
              columns={cols}
              data={rows1}
              options={{
                pageSize: 10,
                emptyRowsWhenPaging: false,
                pageSizeOptions: [10, 15, 20],

                // selection: true,
                // rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
                paging: true,
                headerStyle:
                {
                  fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                  paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                },
                rowStyle: {
                  fontSize: '0.9rem',
                }
              }}
              actions={[
                {
                  tooltip: '',
                  position: 'toolbar',
                  icon: () => <div><Button className="d-block px-4" style={{ fontWeight: '600', background: 'rgb(198 2 36)', border: 'none' }} >+ Add</Button></div>,
                  onClick: () => props.history.push('/add_announcement')
                }
              ]}


            />
          }

        </div>
      </div>)

      : // ----------------ARABIC----------------

      (
        <div className="w-100" style={{ height: 'calc(100vh - 118px)', overflowY: 'auto' }}>

          <div className='table-arabic'>
            {
              loaded &&
              <Table
                name='announcements'
                key='announcements'
                title={<div className="font-weight-bold text-nowrap ml-2" style={{ fontSize: '17px', fontFamily: 'cnam-ar' }}>الإعلانات</div>}
                columns={cols}
                data={rows1}
                options={{
                  pageSize: 10,
                  emptyRowsWhenPaging: false,
                  pageSizeOptions: [10, 15, 20],

                  // selection: true,
                  // rowStyle: rowData => ({ backgroundColor: rowData.tableData.checked ? '#37b15933' : '' }),
                  paging: true,
                  headerStyle:
                  {
                    fontSize: '12px', backgroundColor: '#F7F7F7', color: '#B3B3B3',
                    paddingTop: '3px', paddingBottom: '3px', whiteSpace: 'nowrap',
                    fontFamily: 'cnam-ar'
                  },
                  rowStyle: {
                    fontSize: '0.9rem',
                  }
                }}
                actions={[
                  {
                    tooltip: '',
                    position: 'toolbar',
                    icon: () => <div><Button className="d-block px-4" style={{ fontWeight: '600', background: 'rgb(198 2 36)', border: 'none', fontFamily: 'cnam-ar' }} >+ إضافة</Button></div>,
                    onClick: () => props.history.push('/add_announcement')
                  }
                ]}


              />
            }

          </div>
        </div>
      )
    }
  </>

}