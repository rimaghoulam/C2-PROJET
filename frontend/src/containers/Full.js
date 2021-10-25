import React, { lazy, Suspense, useState, useRef } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Loader from 'react-loader-advanced';
import scrollIntoView from 'scroll-into-view';
import { Helmet } from "react-helmet";

import { getSessionInfo, noDataFound } from '../variable'
import { beforeLoginRoutes } from '../globals';

import './Full.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Spinner from '../components/spinner/Spinner';
import AdminLeftNav from '../components/AdminLeftNav/AdminLeftNav';


const Header = lazy(() => import('../components/header/Header'));
const TmpHeader = lazy(() => import('../components/TmpHeader/TmpHeader'))

const TemporaryHomePage = lazy(() => import('../pages/Common/Home'));

const AboutTheProgram = lazy(() => import('../pages/Common/IndustryKpp.js'));
const Home = lazy(() => import('../pages/Common/Home.js'));
const Guidelines = lazy(() => import('../pages/Common/Guidelines.js'));
const Eligibility = lazy(() => import('../pages/Common/Eligibility.js'));
const News = lazy(() => import('../pages/Common/News.js'));
const NewsDetails = lazy(() => import('../pages/Common/NewsDetails.js'));
const Contact = lazy(() => import('../pages/Common/Contact.js'));
const Events = lazy(() => import('../pages/Common/Events.js'));
const Stories = lazy(() => import('../pages/Common/Stories.js'));
const Photos = lazy(() => import('../pages/Common/Photos.js'));
const Privacy = lazy(() => import('../pages/Common/Privacy.js'));
const Terms = lazy(() => import('../pages/Common/Terms.js'));
const AllNotifications = lazy(() => import('../pages/Common/AllNotifications.js'))

const EditCompany = lazy(() => import('../pages/Industry/EditCompany.js'))
const UpdateProfile = lazy(() => import('../pages/Common/editProfile/editProfile.js'))


/////// Admin
const AdminUserDetails = lazy(() => import('../pages/Admin/UsersDetails.js'))
const IndustryDetails = lazy(() => import('../pages/Admin/IndustryDetails.js'))
const AdminUser = lazy(() => import('../pages/Admin/AdminUser.js'))
const AdminDocuments = lazy(() => import('../pages/Admin/AdminDocumentsTable.js'))
// const AdminReports = lazy(() => import('../pages/Admin/AdminReportsTable.js'))
const AdminCompanies = lazy(() => import('../pages/Admin/AdminCompaniesTable.js'))
const AdminCompanyUsers = lazy(() => import('../pages/Admin/AdminCompanyUsers.js'))
const AdminDiscussionTable = lazy(() => import('../pages/Admin/AdminDiscussionTable.js'))
const AdminNewsletter = lazy(() => import('../pages/Admin/AdminAnnouncement.js'))
const MailChimpSettings = lazy(() => import('../pages/Admin/mailChimpSettings/mailchimpSettings.js'))
const NewsLetterSubscribers = lazy(() => import('../pages/Admin/newsletterSubscribers.js'))
const EmailFilter = lazy(() => import('../pages/Admin/AdminEmailFiltering.js'))
const Timeline = lazy(() => import('../pages/Admin/Timeline.js'))

const ManageEvents = lazy(() => import('../components/manageWebsiteCmps/ManageEvents.js'));
const ManageNews = lazy(() => import('../components/manageWebsiteCmps/ManageNews.js'));
const ManagePhotos = lazy(() => import('../components/manageWebsiteCmps/ManagePhotos.js'));
const ManageStories = lazy(() => import('../components/manageWebsiteCmps/ManageStories.js'));
const ManageVideos = lazy(() => import('../components/manageWebsiteCmps/ManageVideos.js'));
const Testimonials = lazy(() => import('../components/manageWebsiteCmps/Testimonials.js'));
const ContactForms = lazy(() => import('../components/manageWebsiteCmps/ContactForm.js'));
const RequestForms = lazy(() => import('../components/manageWebsiteCmps/RequestForm.js'));
const ContactFormDetails = lazy(() => import('../components/manageWebsiteCmps/ContactFormDetails.js'));
const RequestFormDetails = lazy(() => import('../components/manageWebsiteCmps/RequestFormDetails.js'));
const ManageFooter = lazy(() => import('../components/manageWebsiteCmps/ManageFooter.js'));
const ManageAllPages = lazy(() => import('../components/manageWebsiteCmps/ManageAllPages.js'));
const ManagePage = lazy(() => import('../components/manageWebsiteCmps/ManagePage.js'));
const Notifications = lazy(() => import('../components/manageWebsiteCmps/NotificationsPage.js'));
const NotificationsDetails = lazy(() => import('../components/manageWebsiteCmps/NotificationsDetailsPage.js'));
const AddEditMedia = lazy(() => import('../components/manageWebsiteCmps/AddEditMedia.js'));
const AddEditPhotos = lazy(() => import('../components/manageWebsiteCmps/AddEditPhotos.js'));
const AddEditVideos = lazy(() => import('../components/manageWebsiteCmps/AddEditVideos.js'));
const ManageHomeSlider = lazy(() => import('../components/manageWebsiteCmps/manageHomeSlider'));
const AddEditHomeSlider = lazy(() => import('../components/manageWebsiteCmps/AddEditHomeSlider.js'));
const ManageWhyJoinUs = lazy(() => import('../components/manageWebsiteCmps/ManageWhyJoinUs.js'));
const AddEditWhyJoinUs = lazy(() => import('../components/manageWebsiteCmps/AddEditWhyJoinUs.js'));
const ManagePageComponents = lazy(() => import('../components/manageWebsiteCmps/ManagePageComponents.js'));
const addEditEvent = lazy(() => import('../components/manageWebsiteCmps/addEditEvent.js'));
const ManageSocialMedia = lazy(() => import('../components/manageWebsiteCmps/ManageSocialMedia.js'));
const AddEditSocialMedia = lazy(() => import('../components/manageWebsiteCmps/AddEditSocialMedia.js'));


const Dashboard = lazy(() => {
  switch (getSessionInfo("role")) {
    case 3:
      return import('../pages/Industry/IndustryDashboard.js')
    case 1:
      return import('../pages/cnam/UniDashboard.js')
    case 4:
      return import('../pages/Admin/AdminDashboard.js')
    default:
      return noDataFound;
  }
})

const challengeDetails = lazy(() => {
  switch (getSessionInfo("role")) {
    case 4:
      return import('../pages/Admin/AdminChallengeDetails.js')
    case 1:
    case 3:
      return import('../pages/Common/ChallengesDetails/challengeDetails.js')
    default:
      return noDataFound;
  }
})

const Challenge = lazy(() => {
  switch (getSessionInfo("role")) {
    case 1:
      return import('../pages/cnam/Uni-Challenge.js')
    case 3:
      return import('../pages/Industry/Industry-Challenge.js')
    case 4:
      return import('../pages/Admin/AdminChallenges.js')
    default:
      return noDataFound;
  }
})

const Discussion = lazy(() => {
  switch (getSessionInfo("role")) {

    // ADMIN USES UNI DISCUSSION
    case 4: case 1:
      return import('../pages/cnam/UniDiscussion.js')
    case 3:
      return import('../pages/Industry/IndustryChallengeDiscussions.js')

    default:
      return noDataFound;
  }
})

const Internship = lazy(() => {
  switch (getSessionInfo("role")) {
    case 1:
      return import('../pages/cnam/UniInternship.js')
    case 3:
      return import('../pages/Industry/IndustryInternship.js')
    case 4:
      return import('../pages/Admin/AdminInternships.js')
    default:
      return noDataFound;
  }
})

const InternshipDetails = lazy(() => {
  switch (getSessionInfo("role")) {
    case 4:
      return import('../pages/Admin/AdminInternshipDetails.js')
    case 1:
      return import('../pages/cnam/UniInternshipDetails.js')
    case 3:
      return import('../pages/Industry/IndustryInternDetails.js')

    default:
      return noDataFound;
  }
})


const routes = {
  '/': "Home",
  '/auth': null,
  '/auth/dashboard': "Dashboard",
}

export default function Full(props) {

  const location = useLocation();   // we need to use location.pathname



  const [state, setState] = useState({
    spinnerShow: false,
    navmenus: "",
    isrender: true,
    backtotop: false,
    affix: true,
    language: getSessionInfo('language'),
    pageTitle: 'CNAM STUDENT PORTAL',
    pageTitle_ar: 'برنامج الشراكة المعرفية عن'
  })


  const [adminNavOpen, setAdminNavOpen] = useState(false)


  const topRef = useRef()




  const changeLanguage = () => {
    setState(p => ({
      ...p,
      language: p.language === 'english' ? 'arabic' : 'english'
    }));
  }


  const toggleSpinner = (display) => {
    setState(p => ({
      ...p,
      spinnerShow: display
    }));
  }

  const toggleAdminNav = () => {
    setAdminNavOpen(prevState => !prevState)
  }


  const changeTitle = (title, title_ar) => {
    setState(p => ({ ...p, pageTitle: title, pageTitle_ar: title_ar }))
  }




  const children = (MyComponent, props) => {
    window.scrollTo(0, 0);
    return <MyComponent
      {...props}
      routes={routes}
      toggleSpinner={toggleSpinner}
      setPageTitle={changeTitle}
    />
  }





  let childComponent =
    <Switch>
      <Route exact path="/home" render={(props) => <Suspense fallback={<Spinner />}>{children(Home, props)}</Suspense>} />
      <Route exact path="/error" render={() => noDataFound} />
      <Route exact path="/industry_kpp" render={(props) => <Suspense fallback={<Spinner />}>{children(AboutTheProgram, props)}</Suspense>} />

      <Route exact path="/guidelines" render={(props) => <Suspense fallback={<Spinner />}>{children(Guidelines, props)}</Suspense>} />
      <Route exact path="/eligibility" render={(props) => <Suspense fallback={<Spinner />}>{children(Eligibility, props)}</Suspense>} />
      <Route exact path="/news" render={(props) => <Suspense fallback={<Spinner />}>{children(News, props)}</Suspense>} />
      <Route exact path="/news_details/:newsId" render={(props) => <Suspense fallback={<Spinner />}>{children(NewsDetails, props)}</Suspense>} />

      <Route exact path="/contact_us" render={(props) => <Suspense fallback={<Spinner />}>{children(Contact, props)}</Suspense>} />
      <Route exact path="/events" render={(props) => <Suspense fallback={<Spinner />}>{children(Events, props)}</Suspense>} />
      <Route exact path="/success_stories" render={(props) => <Suspense fallback={<Spinner />}>{children(Stories, props)}</Suspense>} />
      <Route exact path="/photos" render={(props) => <Suspense fallback={<Spinner />}>{children(Photos, props)}</Suspense>} />
      <Route exact path="/privacy_policy" render={(props) => <Suspense fallback={<Spinner />}>{children(Privacy, props)}</Suspense>} />
      <Route exact path="/terms_of_service" render={(props) => <Suspense fallback={<Spinner />}>{children(Terms, props)}</Suspense>} />


      {getSessionInfo("loggedIn") && // if the user is logged in
        <Switch>
          <Route exact path="/home" render={(props) => <Suspense fallback={<Spinner />}>{children(Home, props)}</Suspense>} />
          <Route exact path="/dashboard" render={(props) => <Suspense fallback={<Spinner />}>{children(Dashboard, props)}</Suspense>} />
          <Route exact path="/all_notifications" render={(props) => <Suspense fallback={<Spinner />}>{children(AllNotifications, props)}</Suspense>} />
          <Route exact path="/discussion/:discId" render={(props) => <Suspense fallback={<Spinner />}>{children(Discussion, props)}</Suspense>} />

          <Route exact path="/challenges/:status" render={(props) => <Suspense fallback={<Spinner />}>{children(Challenge, props)}</Suspense>} />
          <Route exact path="/challenges" render={(props) => <Suspense fallback={<Spinner />}>{children(Challenge, props)}</Suspense>} />
          <Route exact path="/challenge_details/:challengeid" render={(props) => <Suspense fallback={<Spinner />}>{children(challengeDetails, props)}</Suspense>} />

          <Route exact path="/internships/:status" render={(props) => <Suspense fallback={<Spinner />}>{children(Internship, props)}</Suspense>} />
          <Route exact path="/internships" render={(props) => <Suspense fallback={<Spinner />}>{children(Internship, props)}</Suspense>} />
          <Route exact path="/internship_details/:internshipid" render={(props) => <Suspense fallback={<Spinner />}>{children(InternshipDetails, props)}</Suspense>} />

          <Route exact path="/" render={(props) => <Suspense fallback={<Spinner />}>{children(TemporaryHomePage, props)}</Suspense>} />


          {getSessionInfo("role") === 3 && // if the user role is Industry
            <Switch>
              <Route exact path="/home" render={(props) => <Suspense fallback={<Spinner />}>{children(Home, props)}</Suspense>} />
              {/* <Route path="/editCompany" render={(props) => <Suspense fallback={<Spinner />}>{children(EditCompany, props)}</Suspense>} /> */}


              <Route exact path="/edit_company" render={(props) => <Suspense fallback={<Spinner />}>{children(EditCompany, props)}</Suspense>} />
              <Route exact path="/edit_profile" render={(props) => <Suspense fallback={<Spinner />}>{children(UpdateProfile, props)}</Suspense>} />



              <Route exact path="/" render={(props) => <Suspense fallback={<Spinner />}>{children(TemporaryHomePage, props)}</Suspense>} />
              <Redirect to="/dashboard" />
            </Switch>
          }

          {getSessionInfo("role") === 4 ? // if the user role is admin
            <Switch>
              <Route exact path="/home" render={(props) => <Suspense fallback={<Spinner />}>{children(Home, props)}</Suspense>} />
              <Route exact path="/user_details/:userId" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminUserDetails, props)}</Suspense>} />
              <Route exact path="/industry_details/:industryid" render={(props) => <Suspense fallback={<Spinner />}>{children(IndustryDetails, props)}</Suspense>} />
              <Route exact path="/email_filter" render={(props) => <Suspense fallback={<Spinner />}>{children(EmailFilter, props)}</Suspense>} />


              <Route exact path="/timeline/:job_id" render={(props) => <Suspense fallback={<Spinner />}>{children(Timeline, props)}</Suspense>} />


              <Route exact path="/cnam_users/:status" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminUser, props)}</Suspense>} />
              <Route exact path="/cnam_users" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminUser, props)}</Suspense>} />

              <Route exact path="/industry_users/:status" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminCompanies, props)}</Suspense>} />
              <Route exact path="/industry_users" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminCompanies, props)}</Suspense>} />
              <Route exact path="/documents/:type/:company_id" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminDocuments, props)}</Suspense>} />
              <Route exact path="/company_users/:company_id" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminCompanyUsers, props)}</Suspense>} />
              <Route exact path="/discussion/:type/:company_id" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminDiscussionTable, props)}</Suspense>} />
              <Route exact path="/announcement" render={(props) => <Suspense fallback={<Spinner />}>{children(AdminNewsletter, props)}</Suspense>} />
              <Route exact path="/mail_chimp" render={(props) => <Suspense fallback={<Spinner />}>{children(MailChimpSettings, props)}</Suspense>} />
              <Route exact path="/newsletter_subscribers" render={(props) => <Suspense fallback={<Spinner />}>{children(NewsLetterSubscribers, props)}</Suspense>} />


              <Route path="/manage/news" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageNews, props)}</Suspense>} />
              <Route path="/manage/photos" render={(props) => <Suspense fallback={<Spinner />}>{children(ManagePhotos, props)}</Suspense>} />

              <Route exact path="/manage/add/photos" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditPhotos, props)}</Suspense>} />
              <Route exact path="/manage/add/videos" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditVideos, props)}</Suspense>} />
              <Route exact path="/manage/edit/photos/:mediaId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditPhotos, props)}</Suspense>} />
              <Route exact path="/manage/edit/videos/:mediaId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditVideos, props)}</Suspense>} />

              <Route exact path="/manage/add/slider" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditHomeSlider, props)}</Suspense>} />
              <Route exact path="/manage/edit/slider/:slideId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditHomeSlider, props)}</Suspense>} />
              <Route path="/manage/slider" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageHomeSlider, props)}</Suspense>} />

              <Route exact path="/manage/add/why_join_us" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditWhyJoinUs, props)}</Suspense>} />
              <Route exact path="/manage/edit/why_join_us/:iconId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditWhyJoinUs, props)}</Suspense>} />
              <Route path="/manage/why_join_us" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageWhyJoinUs, props)}</Suspense>} />

              <Route exact path="/manage/add/social_media" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditSocialMedia, props)}</Suspense>} />
              <Route exact path="/manage/edit/social_media/:socialId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditSocialMedia, props)}</Suspense>} />
              <Route path="/manage/social_media" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageSocialMedia, props)}</Suspense>} />

              <Route exact path="/manage/add/events" render={(props) => <Suspense fallback={<Spinner />}>{children(addEditEvent, props)}</Suspense>} />
              <Route exact path="/manage/edit/events/:eventId" render={(props) => <Suspense fallback={<Spinner />}>{children(addEditEvent, props)}</Suspense>} />
              <Route path="/manage/events" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageEvents, props)}</Suspense>} />


              <Route exact path="/manage/add/:mediaType" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditMedia, props)}</Suspense>} />
              <Route exact path="/manage/edit/:mediaType/:mediaId" render={(props) => <Suspense fallback={<Spinner />}>{children(AddEditMedia, props)}</Suspense>} />

              <Route path="/manage/success_stories" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageStories, props)}</Suspense>} />
              <Route path="/manage/videos" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageVideos, props)}</Suspense>} />
              <Route path="/manage/footer" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageFooter, props)}</Suspense>} />
              <Route path="/manage/testimonials" render={(props) => <Suspense fallback={<Spinner />}>{children(Testimonials, props)}</Suspense>} />
              <Route path="/manage/contact_forms/:requestId" render={(props) => <Suspense fallback={<Spinner />}>{children(ContactFormDetails, props)}</Suspense>} />
              <Route path="/manage/contact_forms" render={(props) => <Suspense fallback={<Spinner />}>{children(ContactForms, props)}</Suspense>} />
              <Route path="/manage/request_forms/:requestId" render={(props) => <Suspense fallback={<Spinner />}>{children(RequestFormDetails, props)}</Suspense>} />
              <Route path="/manage/request_forms" render={(props) => <Suspense fallback={<Spinner />}>{children(RequestForms, props)}</Suspense>} />



              <Route path="/manage/edit_page_component/:pageId/:pageName/:slug" render={(props) => <Suspense fallback={<Spinner />}>{children(ManagePageComponents, props)}</Suspense>} />
              <Route path="/manage/pages/:pageId/:pageName" render={(props) => <Suspense fallback={<Spinner />}>{children(ManagePage, props)}</Suspense>} />
              <Route path="/manage/pages" render={(props) => <Suspense fallback={<Spinner />}>{children(ManageAllPages, props)}</Suspense>} />
              <Route path="/manage/notifications" render={(props) => <Suspense fallback={<Spinner />}>{children(Notifications, props)}</Suspense>} />
              <Route path="/manage/notifications_details/:id" render={(props) => <Suspense fallback={<Spinner />}>{children(NotificationsDetails, props)}</Suspense>} />

              <Route exact path="/edit_profile" render={(props) => <Suspense fallback={<Spinner />}>{children(UpdateProfile, props)}</Suspense>} />
              <Route exact path="/" render={(props) => <Suspense fallback={<Spinner />}>{children(TemporaryHomePage, props)}</Suspense>} />
              <Redirect to="/dashboard" />
            </Switch>
            :
            <Switch>
              <Route exact path="/home" render={(props) => <Suspense fallback={<Spinner />}>{children(Home, props)}</Suspense>} />
              <Route exact path="/edit_profile" render={(props) => <Suspense fallback={<Spinner />}>{children(UpdateProfile, props)}</Suspense>} />
              <Redirect to="/dashboard" />
            </Switch>
          }
          <Redirect to="/dashboard" />
        </Switch>
      }
      <Route exact path="/" render={(props) => <Suspense fallback={<Spinner />}>{children(TemporaryHomePage, props)}</Suspense>} />
      <Redirect to="/" />
    </Switch>







  return (

    <Loader message={<span><Spinner /> </span>} show={state.spinnerShow} backgroundStyle={{ zIndex: "9999" }} >

      <Helmet>
        <title>
          {state.language === 'arabic' ?
            (state.pageTitle_ar === 'برنامج الشراكة المعرفية عن' ? state.pageTitle_ar : state.pageTitle_ar + ' | برنامج الشراكة المعرفية عن') || 'برنامج الشراكة المعرفية عن'
            :
            (state.pageTitle === 'CNAM PORTAL' ? state.pageTitle : state.pageTitle + ' | CNAM PORTAL') || 'CNAM PORTAL'
          }
        </title>
      </Helmet>

      <div className="app" ref={topRef} style={{ direction: (getSessionInfo('language') === 'arabic' && state.language === 'arabic') && 'rtl' }}>

        <div id="back-to-top-div" style={{ display: `${state.backtotop ? "block" : "none"}` }}>
          <strong>
            <i className="icon-arrow-up" style={{ position: "relative", top: "-1px", left: "4px" }} onClick={() => scrollIntoView(topRef)}></i>
          </strong>
        </div>


          {
            location.pathname === '/' ?
            <TmpHeader 
            history={props.history}
            toggleSpinner={toggleSpinner}
            changeLanguage={changeLanguage}
            />

            :
            <Header
            history={props.history}
            toggleSpinner={toggleSpinner}
            navmenus={state.navmenus}
            props={props}
            changeLanguage={changeLanguage}
            toggleAdminNav={toggleAdminNav}
            adminNavOpen={adminNavOpen}
          />
          }


        <div className="app-body">
          <main className="main" >
            {getSessionInfo('loggedIn') && getSessionInfo("role") === 4 && !(beforeLoginRoutes.includes(location.pathname.toLowerCase()) || location.pathname.toLowerCase().indexOf('/news_details') === 0) ?
              <div className="d-flex w-100">
                <AdminLeftNav navOpen={adminNavOpen} toggleAdminNav={toggleAdminNav} />
                {childComponent}
              </div>
              :
              childComponent
            }
          </main>

        </div>

      </div>

    </Loader>

  );
}