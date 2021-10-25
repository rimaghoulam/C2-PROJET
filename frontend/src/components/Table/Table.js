import React from 'react';
import { forwardRef } from 'react';
import MaterialTable from 'material-table'
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import { makeStyles } from "@material-ui/core";
import '../../App.css'




const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: 'transparent',
    },

    "& .MuiPaper-elevation2": {
      boxShadow: 'none',
    },

    "& .MuiPaper-rounded": {
      borderRadius: '4px',
    },

    "& .MuiTable-root": {
      backgroundColor: 'white',
    },

    "& .MuiInputBase-root": {

      fontFamily: 'sans-serif',
    },
    // "& .MuiIconButton-root.Mui-disabled ": {
    //   display:'none',
    // },

    "& .MuiSvgIcon-fontSizeSmall": {
      color: 'darkgray',
      fontSize: '1.4rem'
    },

    "& .makeStyles-root-15 .MuiIconButton-root.Mui-disabled": {
      display: 'flex'
    },
    // "& [type=button]:not(:disabled), [type=reset]:not(:disabled), [type=submit]:not(:disabled)": {
    // display:'none'
    // },

  }
}));

export default function Table({ name, className, components, title, columns, data, rowClick, options, actions, onSelection }) {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MaterialTable
        icons={tableIcons}
        name={name && name}
        columns={columns && columns}
        data={data && data}
        onRowClick={rowClick && rowClick}
        title={title && title}
        className={className && className}
        options={options && options}
        style={{ fontSize: '14px', color: 'black', margin: '25px', fontWeight: '500' }}
        actions={actions && actions}
        onSelectionChange={onSelection}
        components={components}
      />

    </div>
  )
}

