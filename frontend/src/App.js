import React, { Suspense, lazy } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history'

// import { getSessionInfo } from './variable';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Full from './containers/Full';
import Spinner from "./components/spinner/Spinner";
import NDATemplate from './pages/Industry/NDATemplate';

const Register = lazy(() => import('./pages/Common/Register/Register'));
const IndustryRegister = lazy(() => import('./pages/Common/Register/IndustryRegister/IndustryRegister'));
const adminRegister = lazy(() => import('./pages/Common/Register/adminRegister/adminRegister'));
const postChallenge = lazy(() => import('./pages/Industry/PostChallenge'));
const postInternship = lazy(() => import('./pages/Industry/PostIntern'));
const DownloadJobId = lazy(() => import('./pages/Common/DownloadJobId'));

const IndustryAssist = lazy(() => import('./pages/Common/Register/IndustryRegister/IndustryAssist.js'))
const NDA = lazy(() => import('./pages/Industry/NDAPage.js'))
const UploadNDA = lazy(() => import('./pages/Industry/UploadNDA.js'))


const AddAnnouncement = lazy(() => import('./pages/Admin/AddAnnouncement.js'));




const ScrollToTop = () => {
  window.scrollTo(0, 0)
}

const history = createBrowserHistory();


export default function App() {


  // if (getSessionInfo("loggedIN")) {


  // console.log("it's working!")

  // const client = require('pusher-js');

  // window.Echo = new Echo({
  //   broadcaster: 'pusher',
  //   key: '68291c08c4fcab3045a9',
  //   cluster: 'ap2',
  //   forceTLS: true,
  //   client: client
  // });

  // var channel = Echo.channel('my-channel');
  // channel.listen('.my-event', function (data) {
  //   alert(JSON.stringify(data));
  // });
  // }


  // if(getSessionInfo('language') === 'arabic')
  // document.getElementById("root").style.fontFamily = "cnam-ar";
  // else
  // document.getElementById("root").style.fontFamily = "cnam";


  return <Router onChange={ScrollToTop} history={history}>

    <Suspense fallback={<Spinner />}>
      <Switch>
        <Route path="/industry_register" component={IndustryRegister} />

        <Route path="/post_challenge" component={postChallenge} />
        <Route path="/post_internship" component={postInternship} />
        <Route path="/register" component={Register} />
        <Route path="/download_job/:jobid" component={DownloadJobId} />
        <Route path="/admin_register/:name/:email/:token/:role" component={adminRegister} />
        <Route path="/add_announcement" component={AddAnnouncement} />
        <Route path="/industry_assist" component={IndustryAssist} />
        {/* //! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
        {/* :date/:company_name/:headquarter/:title/:address/:name/:email/:date_ar/:company_name_ar/:headquarter_ar/:title_ar/:address_ar/:name_ar/:email_ar */}
        <Route path="/nda_template/:Params" component={NDATemplate} />
        <Route path="/nda" component={NDA} />
        <Route path="/upload_nda" component={UploadNDA} />

        <Route path="/" component={Full} />
      </Switch>

    </Suspense>

    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
    />

  </Router>
}