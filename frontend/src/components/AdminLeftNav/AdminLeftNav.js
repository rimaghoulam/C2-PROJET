import React from 'react';
import { NavLink } from 'react-router-dom'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import List from '@material-ui/core/List';
// import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

// import Popover from '@material-ui/core/Popover';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined';
import ImportContactsOutlinedIcon from '@material-ui/icons/ImportContactsOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import ApartmentOutlinedIcon from '@material-ui/icons/ApartmentOutlined';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';

import ArrowDownwardSharpIcon from '@material-ui/icons/ArrowDownwardSharp';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import ContactPhoneOutlinedIcon from '@material-ui/icons/ContactPhoneOutlined';
import FormatQuoteOutlinedIcon from '@material-ui/icons/FormatQuoteOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import MovieCreationOutlinedIcon from '@material-ui/icons/MovieCreationOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import AmpStoriesOutlinedIcon from '@material-ui/icons/AmpStoriesOutlined';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import LanguageIcon from '@material-ui/icons/Language';
import RecentActorsOutlinedIcon from '@material-ui/icons/RecentActorsOutlined';
import ContactMailOutlinedIcon from '@material-ui/icons/ContactMailOutlined';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';

import { checkFontFamily, translate } from '../../functions'


import './adminLeftNav.css'


const makeAccrodion = (props) => {
    return <Accordion key={props.title}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
        >
            <Typography >{props.icon}{props.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <div className="d-flex flex-column">

                {props.elements.map(item =>

                    <ListItem>
                        <NavLink exact to={item.path} className="nav-null d-flex" activeClassName={`${translate('left-nav-active', 'left-nav-active-ar')}`}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </NavLink>
                    </ListItem>)}
            </div>
        </AccordionDetails>
    </Accordion>
}



export default function AdminLeftNav(props) {
    return (
        <div className="mainContainer custom_scrollbar" style={{ width: props.navOpen ? '350px' : '120px', ...props.style }}>

            <nav className="leftNav" style={{ fontFamily: checkFontFamily(true) }}>

                {props.navOpen ?

                    <>
                        <List>

                            <ListItem>
                                <NavLink exact to="/" className="nav-null d-flex" activeClassName={`${translate('left-nav-active', 'left-nav-active-ar')}`}>
                                    <ListItemIcon> <HomeOutlinedIcon /> </ListItemIcon>
                                    <ListItemText primary={translate('Home', 'الصفحة الرئيسية')} />
                                </NavLink>
                            </ListItem>


                            <ListItem>
                                <NavLink exact to="/dashboard" className="nav-null d-flex" activeClassName={`${translate('left-nav-active', 'left-nav-active-ar')}`}>
                                    <ListItemIcon> <EqualizerOutlinedIcon /> </ListItemIcon>
                                    <ListItemText primary={translate('Dashboard', 'لوحة إدارة المنصة')} />
                                </NavLink>
                            </ListItem>



                            {makeAccrodion({
                                icon: <WorkOutlineOutlinedIcon />,
                                title: translate('Jobs', 'وظائف'),
                                elements: [
                                    { icon: <ImportContactsOutlinedIcon />, text: translate('Internships', 'التدريب الداخلي'), path: '/internships' },
                                ]
                            })}


                            {makeAccrodion({
                                icon: <PeopleAltOutlinedIcon />,
                                title: translate('Users', 'المستخدمين'),
                                elements: [
                                    { icon: <SchoolOutlinedIcon />, text: translate('Cnam Users', 'مجلد المستخدمين'), path: '/cnam_users' },
                                    { icon: <ApartmentOutlinedIcon />, text: translate('Industry Users', 'مستخدمي الصناعة'), path: '/industry_users' },
                                ]
                            })}


                            {/* <ListItem>
                                <NavLink exact to="/manage/contact_forms" className="nav-null d-flex" activeClassName={`${translate('left-nav-active', 'left-nav-active-ar')}`}>
                                    <ListItemIcon> <ContactPhoneOutlinedIcon /> </ListItemIcon>
                                    <ListItemText primary={'Contact Forms'} />
                                </NavLink>
                            </ListItem> */}

                            {makeAccrodion({
                                icon: <SettingsOutlinedIcon />,
                                title: translate('Manage Website', 'إدارة الموقع'),
                                elements: [
                                    { icon: <FindInPageOutlinedIcon />, text: translate('Pages', 'الصفحات'), path: '/manage/pages' },
                                    { icon: <SlideshowIcon />, text: translate('Slider', 'المنزلق'), path: '/manage/slider' },
                                    { icon: <ArrowDownwardSharpIcon />, text: translate('Footer', 'تذييل'), path: '/manage/footer' },
                                    { icon: <LanguageIcon />, text: translate('Social Media', 'وسائل التواصل الاجتماعي'), path: '/manage/social_media' },
                                ]
                            })}


                        </List>



                    </>

                    :
                    // ! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    <>
                        <List className="pointer" onClick={() => props.toggleAdminNav()}>


                            <ListItem className="alignCenter">
                                <Tooltip title="Home" placement="right">
                                    <HomeOutlinedIcon />
                                </Tooltip>
                            </ListItem>


                            <ListItem className="alignCenter">
                                <Tooltip title="Dashboard" placement="right">
                                    <EqualizerOutlinedIcon />
                                </Tooltip>
                            </ListItem>

                            <ListItem className="alignCenter">
                                <Tooltip title="Jobs" placement="right">
                                    <WorkOutlineOutlinedIcon />
                                </Tooltip>
                            </ListItem>

                            <ListItem className="alignCenter">
                                <Tooltip title="Users" placement="right">
                                    <PeopleAltOutlinedIcon />
                                </Tooltip>
                            </ListItem>

                            

                            <ListItem className="alignCenter">
                                <Tooltip title="Manage Website" placement="right">
                                    <SettingsOutlinedIcon />
                                </Tooltip>
                            </ListItem>

                        </List>
                    </>
                }
            </nav>

        </div>
    )
}



