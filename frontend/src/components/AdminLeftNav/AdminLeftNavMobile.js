import React from 'react';
import { NavLink } from 'react-router-dom'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import Popover from '@material-ui/core/Popover';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import EqualizerOutlinedIcon from '@material-ui/icons/EqualizerOutlined';
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined';
import ImportContactsOutlinedIcon from '@material-ui/icons/ImportContactsOutlined';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import ApartmentOutlinedIcon from '@material-ui/icons/ApartmentOutlined';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';

import ArrowDownwardSharpIcon from '@material-ui/icons/ArrowDownwardSharp';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import FormatQuoteOutlinedIcon from '@material-ui/icons/FormatQuoteOutlined';
import PhotoSizeSelectActualOutlinedIcon from '@material-ui/icons/PhotoSizeSelectActualOutlined';
import MovieCreationOutlinedIcon from '@material-ui/icons/MovieCreationOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import NewReleasesOutlinedIcon from '@material-ui/icons/NewReleasesOutlined';
import AmpStoriesOutlinedIcon from '@material-ui/icons/AmpStoriesOutlined';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import RecentActorsOutlinedIcon from '@material-ui/icons/RecentActorsOutlined';
import ContactMailOutlinedIcon from '@material-ui/icons/ContactMailOutlined';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';

import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined';


import './adminLeftNav.css'



export default function AdminLeftNav() {
    return (
        <div className="smallMainContainer w-100">

            <nav>
                <>
                    <List>

                        <ListItem>
                            <NavLink exact to="/" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <HomeOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'Home'} />
                            </NavLink>
                        </ListItem>

                        <ListItem>
                            <NavLink exact to="/dashboard" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <EqualizerOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'Dashboard'} />
                            </NavLink>
                        </ListItem>


                        <ListItem>
                            <NavLink exact to="/internships" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <ImportContactsOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'Internships'} />
                            </NavLink>
                        </ListItem>

                        <ListItem>
                            <NavLink exact to="/cnam_users" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <SchoolOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'CNAM Users'} />
                            </NavLink>
                        </ListItem>

                        <ListItem>
                            <NavLink exact to="/industry_users" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <ApartmentOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'Industry Users'} />
                            </NavLink>
                        </ListItem>

                        


                        <ListItem>
                            <NavLink exact to="/manage/pages" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <FindInPageOutlinedIcon /> </ListItemIcon>
                                <ListItemText primary={'Pages'} />
                            </NavLink>
                        </ListItem>

                        <ListItem>
                            <NavLink exact to="/manage/slider" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <SlideshowIcon /> </ListItemIcon>
                                <ListItemText primary={'Slider'} />
                            </NavLink>
                        </ListItem>
                        

                        <ListItem>
                            <NavLink exact to="/manage/footer" className="nav-null d-flex" activeClassName="left-nav-active">
                                <ListItemIcon> <ArrowDownwardSharpIcon /> </ListItemIcon>
                                <ListItemText primary={'Footer'} />
                            </NavLink>
                        </ListItem>






                    </List>

                </>
            </nav>

        </div>
    )
}