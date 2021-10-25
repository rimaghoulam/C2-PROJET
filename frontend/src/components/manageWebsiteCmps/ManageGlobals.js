import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import { translate } from '../../functions';

export const ManageWebsiteColumns = ([
    { title: "Title English", field: "title_en" },
    { title: "Title Arabic", field: "title_ar" },
    { title: 'Image', field: 'image', sorting: false, render: rowData => <img src={rowData.image.substring(0, 5) === 'data:' ? rowData.image : "data:image/*;base64," + rowData.image} alt="img" style={{ maxHeight: '100px' }} /> },
    { title: "Date", field: "date", defaultSort: 'desc' },
    {
        title: "", field: "lastIcons", sorting: false, render: rowData =>
            <>
                <div className="d-flex" style={{ color: '#959595' }}>

                    <EditIcon
                        className={`pointer ${translate('ml-1 ml-md-auto', 'mr-1 mr-md-auto')}`}
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.edit}
                    />
                    <DeleteOutlineIcon
                        className="pointer mt-1 mt-md-0 ml-1 mr-1"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.delete}
                    />

                </div>
            </>
    },
]
)



export const photosColumns = [
    { title: "Title English", field: "title_en" },
    { title: "Title Arabic", field: "title_ar" },
    { title: 'Image', field: 'image', sorting: false, render: rowData => <img src={rowData.image.substring(0, 5) === 'data:' ? rowData.image : "data:image/*;base64," + rowData.image} alt="img" style={{ maxHeight: '100px' }} /> },
    {
        title: "", field: "lastIcons", sorting: false, render: rowData =>
            <>
                <div className="d-flex" style={{ color: '#959595' }}>

                    <EditIcon
                        className="pointer ml-1 ml-md-auto"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.edit}
                    />
                    <DeleteOutlineIcon
                        className="pointer mt-1 mt-md-0 ml-1 mr-1"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.delete}
                    />

                </div>
            </>
    },
]

export const videosColumns = [
    { title: "Title English", field: "title_en" },
    { title: "Title Arabic", field: "title_ar" },
    { title: 'Video url', field: 'video' },
    {
        title: "", field: "lastIcons", sorting: false, render: rowData =>
            <>
                <div className="d-flex" style={{ color: '#959595' }}>

                    <EditIcon
                        className="pointer ml-1 ml-md-auto"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.edit}
                    />
                    <DeleteOutlineIcon
                        className="pointer mt-1 mt-md-0 ml-1 mr-1"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.delete}
                    />

                </div>
            </>
    },
]


export const whyJoinUsColumns = [
    { title: "Text English", field: "text_e" },
    { title: "Text Arabic", field: "text_a" },
    { title: 'Image', field: 'image', sorting: false, render: rowData => <img src={rowData.image} alt="img" style={{ maxHeight: '100px' }} /> },
    {
        title: "", field: "lastIcons", sorting: false, render: rowData =>
            <>
                <div className="d-flex" style={{ color: '#959595' }}>

                    <EditIcon
                        className="pointer ml-1 ml-md-auto"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.edit}
                    />
                    <DeleteOutlineIcon
                        className="pointer mt-1 mt-md-0 ml-1 mr-1"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.delete}
                    />

                </div>
            </>
    },
]

export const socialMediaColumns = [
    { title: "Link", field: "link" },
    { title: 'Icon', field: 'icon', sorting: false, render: rowData => <img src={rowData.icon} alt="img" style={{ maxHeight: '100px' }} /> },
    {
        title: "", field: "lastIcons", sorting: false, render: rowData =>
            <>
                <div className="d-flex" style={{ color: '#959595' }}>

                    <EditIcon
                        className="pointer ml-1 ml-md-auto"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.edit}
                    />
                    <DeleteOutlineIcon
                        className="pointer mt-1 mt-md-0 ml-1 mr-1"
                        style={{ fontSize: "25px", color: 'rgb(198 2 36)', width: '2em' }}
                        onClick={rowData.lastIcons.delete}
                    />

                </div>
            </>
    },
]