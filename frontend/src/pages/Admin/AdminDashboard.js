import React, { useState, useEffect } from 'react';
import axios from 'axios'

import { getSessionInfo, clearSessionInfo } from '../../variable'
import { WS_LINK, MONTHS } from '../../globals'
import { translate, formatDate, downloadFileWithExtension, checkFontFamily } from '../../functions'

import GridChart from '../../components/GridChart/GridChart';
import PieChartComponent from '../../components/pieChart/pieChart';

import { Button } from 'reactstrap';
import DropDownComponent from '../../components/Dropdown/Dropdown'

import challengeIcon from '../../assets/images_png/challenge_icon.png'
import internshipIcon from '../../assets/images_png/internship_icon.png'

import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import ApartmentOutlinedIcon from '@material-ui/icons/ApartmentOutlined';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined';

import '../../App.css';


const makeCard = (props) =>
  <div className="adminDashboardCard shadow pt-3 pointer mt-3 mt-lg-0" style={{ borderBottom: `3px solid ${props.borderColor}` }} onClick={() => props.history.push(props.path)}>
    <div className="row">
      <div className="col-7 col-sm-8 col-lg-9">
        <p style={{ color: props.borderColor, fontSize: '1.3rem' }}><b>{props.number || 0}</b></p>
        <p>{props.text || 'text'}</p>
      </div>
      <div className="col-5 col-sm-4 col-lg-3">
        {props.isImage ?
          <img src={props.icon} alt={props.alt} style={{ width: '100%', color: props.borderColor }} />
          :
          props.icon
        }
      </div>
    </div>
  </div>



const COLORS = ['#00ab9e', '#f6944a', '#bdcd28', '#fec010', '#444'];

// challenge: pedning review, prending info, in progress, closed, completed ( 0-> 4 )
//internship: pending review , in progress, closed, student assigned (5 -> 8)
// cnam : active , inactive (9 10)
//industry: active, inactive (11 12)
//total count : challenges, internships, cnam users, companies (13 -> 16)
//monthly: intern and challenge (17 18)
// settings (19)
//pending challenges, pending internships (20 21)





export default function AdminDashboard(props) {

  const [dashboardObj, setDashboardObj] = useState('')

  const [isPieChart, setIsPieChart] = useState(false)

  const toggleChartState = () => {
    setIsPieChart(p => !p)
  }



  useEffect(() => {
    props.setPageTitle('Dashboard', 'لوحة إدارة المنصة')
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      adminid: getSessionInfo('id'),
      token: getSessionInfo('token')
    }

    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}get_admin_statistics`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          props.toggleSpinner(false)
          setDashboardObj(res.data)
        }
        else {
          clearSessionInfo();
          window.location.reload(false).then(props.history.replace("/"));
        }
      })
      .catch(err => {
        props.toggleSpinner(false)


        if (axios.isCancel(err)) {
          console.log('request canceled');
        }
        else {
          console.log("request failed")

        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  //* ///////////////////////// LINE GRAPHS

  const ChallInternGraphData = []

  if (dashboardObj.length > 1) {
    if (getSessionInfo('language') === 'arabic') {
      for (let i = 0; i < dashboardObj[17].length; i++) {
        ChallInternGraphData.push({
          name: MONTHS[i > 12 ? 12 - i : i],
          'التحديات': dashboardObj[18][i],
          'التدريب الداخلي': dashboardObj[17][i],
        })
      }
      ChallInternGraphData.push({
        name: MONTHS[ChallInternGraphData.length > 12 ? 12 - ChallInternGraphData.length : ChallInternGraphData.length],
        'التحديات': 0,
        'التدريب الداخلي': 0,
      })
    }

    else {
      for (let i = 0; i < dashboardObj[17].length; i++) {
        ChallInternGraphData.push({
          name: MONTHS[i > 12 ? 12 - i : i],
          Challenges: dashboardObj[18][i],
          Internships: dashboardObj[17][i],
        })
      }
      ChallInternGraphData.push({
        name: MONTHS[ChallInternGraphData.length > 12 ? 12 - ChallInternGraphData.length : ChallInternGraphData.length],
        Challenges: 0,
        Internships: 0,
      })
    }
  }




  const exportDashboard = (exportType) => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source()

    const postedData = {
      userid: getSessionInfo('id'),
      token: getSessionInfo('token'),
      toe: exportType
    }

    props.toggleSpinner(true)

    axios({
      method: "post",
      url: `${WS_LINK}export_dashboard`,
      data: postedData,
      cancelToken: source.token,
    })
      .then(res => {
        if (getSessionInfo("role") === 4 && res.data !== "token error") {
          props.toggleSpinner(false)
          downloadFileWithExtension(res.data, `cnamKpp-dashboard.${exportType}`, exportType)
        }
        else {
          clearSessionInfo();
          window.location.reload(false).then(props.history.replace("/"));
        }
      })
      .catch(err => {
        props.toggleSpinner(false)


        if (axios.isCancel(err)) {
          console.log('request canceled');
        }
        else {
          console.log("request failed")

        }
      });
  }







  return (
    <div className="BodyHeight w-100" style={{ overflowX: 'hidden', backgroundColor: '#e6e5e4', fontFamily: checkFontFamily() }}>

      {dashboardObj.length > 0 &&
        <div className="scroll-in-body w-100 pt-3 px-2 d-flex flex-column pb-3" style={{ overflowX: 'hidden' }}>

          {/* <button
            className={`pointer px-4 py-2 mb-3 ${translate('ml-auto mr-2', 'mr-auto ml-2')}`}
            style={{ color: 'white', backgroundColor: '#00ab9e', border: '#00ab9e', borderRadius: '5px', width: 'fit-content' }}
            onClick={exportDashboard}
          >
            {translate('Export', 'يصدر')} </button> */}

          <DropDownComponent
            title={translate('Export ', ' يصدر')}
            caret={true}
            className={`pointer px-4 py-2 mb-3 ${translate('ml-auto mr-2', 'mr-auto')}`}
            dropDownToggleStyle={{ color: 'white', backgroundColor: '#00ab9e', border: '#00ab9e', borderRadius: '5px' }}
            dropDownMenuStyle={{ marginTop: '-35%', marginLeft: translate('0', '0'), marginRight: translate('35%', '0') }}
            data={[
              { text: translate('Report as PDF', 'تقرير باسم PDF.'), divider: true, onClick: () => exportDashboard('pdf') },
              { text: translate('Report as CSV', 'تقرير باسم CSV.'), divider: true, onClick: () => exportDashboard('csv') },
              { text: translate('Database', 'قاعدة البيانات'), divider: false, onClick: () => window.open(WS_LINK + 'export_database') }
            ]}
          />


          {/* // *****************************************************************************************  Cards */}

          <div className="row px-3">

            <div className="col-12 col-sm-6 col-lg-4">
              {makeCard({ borderColor: '#f6944a', number: dashboardObj[14], text: translate("All Internships", "كل التدريب الداخلي"), icon: <WorkOutlineIcon style={{ fontSize: '3rem', color: '#f6944a' }} />, history: props.history, path: '/internships' })}
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              {makeCard({ borderColor: '#bdcd28', number: dashboardObj[15], text: translate("All cnam Users", "كل مجلد المستخدمين"), icon: <SchoolOutlinedIcon style={{ fontSize: '3rem', color: '#bdcd28' }} />, history: props.history, path: '/cnam_users' })}
            </div>
            <div className="col-12 col-sm-6 col-lg-4">
              {makeCard({ borderColor: '#fec010', number: dashboardObj[16], text: translate("All Industry Users", "جميع مستخدمي الصناعة"), icon: <ApartmentOutlinedIcon style={{ fontSize: '3rem', color: '#fec010' }} />, history: props.history, path: '/industry_users' })}
            </div>

          </div>

          {/* // *****************************************************************************************  Stats */}


          <div className="row px-3 mt-3 pt-3 mb-3">

            <div className="col-12 col-lg-7 col-xxl-8 pr-1 statsHeight">
              <div className="d-flex w-100">
                <h5>{translate('Job Statistics:', ':إحصاءات الوظيفة')}</h5>
                <button onClick={toggleChartState} className={`btn-toggleChart ${translate('ml-auto', 'mr-auto')}`}>{isPieChart ? 'View as LineChart' : 'View as PieChart'}</button>
              </div>
              <div className="adminDashboardCard shadow h-100">
                {
                  isPieChart ?
                    <PieChartComponent data={
                      [
                      { name: 'All Internships', value: dashboardObj[14] },]} />
                    :
                    <div className="h-100 w-100 pt-1" style={{ marginLeft: '-5%' }}>
                      <GridChart
                        data={ChallInternGraphData}
                        all1={dashboardObj[17]}
                        all2={dashboardObj[18]}
                        key2={translate('Internships', 'التدريب الداخلي')}
                      />
                    </div>
                }

              </div>
            </div>

            <div className="col-12 col-lg-5 col-xxl-4 statsHeight mt-3 pt-3 mt-lg-0 pt-lg-0">
              <h5 className="mt-3 mt-lg-0">{translate('Users Statistics:', ':إحصائيات المستخدمين')}</h5>
              <div className="adminDashboardCard shadow col-12 h-100 p-0">
                {!dashboardObj[9] && !dashboardObj[10] && !dashboardObj[11] && !dashboardObj[12] ?
                  <h5 className="mt-3 pt-3 ml-3">{translate('No users yet!', '!لا يوجد مستخدمين حتى الآن')}</h5>
                  :
                  <PieChartComponent data={
                    [{ name: 'cnam active', value: dashboardObj[9] },
                    { name: 'cnam inactive', value: dashboardObj[10] },
                    { name: 'industry active', value: dashboardObj[11] },
                    { name: 'industry inactive', value: dashboardObj[12] }]} />
                }
              </div>
            </div>

          </div>

          
          {/* // *****************************************************************************************  Internships */}
          <div className="row px-3" style={{ height: '210px', marginTop: '4rem', marginBottom: '3rem' }}>
            <h5>{translate('Pending Internships:', 'فترات التدريب المعلقة:')}</h5>
            <div className="col-12 col-lg-5 pr-1 h-100">
              <div className="adminDashboardCard shadow h-100 ">
                <div className="w-100 h-100 " style={{ overflowY: 'auto', overflowX: 'hidden' }}>


                  {dashboardObj[21].length > 0 ?
                    dashboardObj[21].map((item, index) =>


                      <div key={item.job_id} className="w-100">
                        <div className="row px-3 my-3 mr-3" >
                          <div className="col-12 col-xxl-9 d-flex">
                            <img src={internshipIcon} alt={`internship icon`} style={{ height: '40px', width: '40px' }} />
                            <div className="w-100 ml-1">
                              <p className="mb-1"><b>{item.internship_job_title}</b></p>
                              <p className="mb-0" style={{ color: 'grey', fontSize: '0.75rem' }}>Created on: <date>{formatDate(item.created_at)}</date><br />Submitted by {item.internship_institution_name}</p>
                            </div>
                          </div>
                          <div className={`col-12 col-xxl-3 ${translate('text-right', 'text-left')}`}>
                            <Button className="mt-1 mt-xxl3" style={{ backgroundColor: '#00ab9e', border: 'none', fontSize: '0.75rem' }} onClick={() => props.history.push(`/internship_details/${btoa(encodeURIComponent(item.job_id))}`)}>
                              {translate('Check Details', 'التحقق من التفاصيل')}
                            </Button>
                          </div>
                        </div>
                        <hr xlassName="px-3 mx-3" />
                      </div>
                    )
                    :
                    <h5 className="pl-3 pt-3">{translate('No Pending Internships!', '!لا في انتظار التدريب الداخلي')}</h5>
                  }

                </div>
              </div>
            </div>

            <div className="col-12 col-lg-3 mt-3 mt-lg-0">
              <div className="adminDashboardCard shadow col-12 h-100 p-0">
                <div className="row px-3 mx-auto w-100 mb-2 pt-1">
                  {['PENDING REVIEW', "IN PROGRESS", 'CLOSED', 'STUDENT ASSIGNED'].map((item, index) =>
                    <div
                      className="col-12 my-2 py-1 text-center pointer shadow"
                      style={{ border: `1px solid ${COLORS[index % COLORS.length]}`, color: COLORS[index % COLORS.length], borderRadius: '5px', fontFamily: 'cnam' }}
                      onClick={() => props.history.push(`/internships/${btoa(encodeURIComponent(item))}`)}
                    >
                      {item} ({dashboardObj[index + 5]})
                    </div>
                  )
                  }
                </div>
              </div>
            </div>


            <div className="col-12 col-lg-4 mt-3 mt-lg-0">
              <div className="adminDashboardCard shadow col-12 h-100 p-3">
                <PieChartComponent
                  small={true}
                  data={
                    [{ name: 'PENDING REVIEW', value: dashboardObj[5] },
                    { name: 'IN PROGRESS', value: dashboardObj[6] },
                    { name: 'CLOSED', value: dashboardObj[7] },
                    { name: 'STUDENT ASSIGNED', value: dashboardObj[8] }]} />
              </div>
            </div>

          </div>






        </div>
      }
    </div>
  );
}



/* <div className="row px-3 mt-3 pt-3" style={{ height: '50vh' }}>

            <div className="col-12 col-lg-9 col-xxl-10 pr-0 pr-lg-1 h-100">
              <div className="adminDashboardCard shadow h-100">
                <div className="w-100 row h-100 custom_scrollbar" style={{ overflowY: 'auto' }}>

                  {dashboardObj[20].length > 0 ?
                    dashboardObj[20].map((item, index) =>
                      <div key={item.job_id} className="col-6 d-flex px-3 my-2 pointer" onClick={() => props.history.push(`/internship_details/${btoa(encodeURIComponent(item.job_id))}`)}>
                        <img src={challengeIcon} alt={`challenge icon`} style={{ height: '40px', width: '40px' }} />
                        <div className="w-100 ml-1">
                          <p className="mb-1"><b>{item.challenge_name}</b></p>
                          <p className="mb-0" style={{ color: 'grey', fontSize: '0.75rem' }}>Created on: <date>{formatDate(item.created_at)}</date><br /> By {item.user_name} From {item.industry_details_company_name}</p>
                        </div>
                      </div>
                    )
                    :
                    <h4 className="pl-3 pt-3">No Pending Challenges!</h4>}

                </div>
              </div>
            </div>



            <div className="col-12 col-lg-3 col-xxl-2">
              <div className="adminDashboardCard shadow col-12 h-100 p-0">
                <div className="row px-3 mx-auto w-100 mb-2 pt-1">
                  {['PENDING REVIEW', 'PENDING INFO', "IN PROGRESS", 'CLOSED', 'COMPLETED'].map((item, index) =>
                    <div
                      className="col-12 my-2 py-1 shadow text-center pointer"
                      style={{ border: `1px solid ${COLORS[index % COLORS.length]}`, color: COLORS[index % COLORS.length], borderRadius: '5px' }}
                      onClick={() => props.history.push(`/challenges/${btoa(encodeURIComponent(item))}`)}
                    >
                      {item} ({dashboardObj[index]})</div>
                  )
                  }
                </div>
              </div>
            </div>

          </div> */
