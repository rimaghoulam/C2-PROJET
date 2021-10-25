/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import Loader from "react-loader-advanced";

import { getSessionInfo, removeSessionInfo, setSessionInfo } from "../../../../variable";
import { WS_LINK } from "../../../../globals";
import { downloadFile, checkFontFamily } from '../../../../functions'

import IndustryModal from "../../../../components/PageModals/IndustryModal";
import Simple from "../../../../containers/Simple";
import InputText from "../../../../components/InputText/InputText";
import Selector from "../../../../components/Selector/Selector";
import Spinner from "../../../../components/spinner/Spinner";
import InputNumeric from '../../../../components/InputNumeric/InputNumeric'

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import Clear from '@material-ui/icons/Clear';

import "../../../../App.css";
import "./IndustryRegister.css";
import "../../../../components/Modal/Modal.css";

import Upload from "../../../../assets/images_svg/upload_icons.svg";

export default function IndustryRegister(props) {


  useEffect(() => {
    // if (!getSessionInfo("id") && !getSessionInfo('tempLoggedIn')) {
    //   props.history.replace('/')
    // }

    const postedData = {
      userid: getSessionInfo("id"),
      token: getSessionInfo("token"),
    };
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    setLoaderState(true);
    axios({
      method: "post",
      url: `${WS_LINK}check_company_status`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        // if(res.data === 'token error') props.history.replace('/')
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
        // if (res.data === 'proceed') props.history.replace('/dashboard')
      })
      .catch((err) => {
        console.log(err)
      });
    setLoaderState(true);
  }, [])

  // useForm from react-hook-form
  const {
    register,
    getValues,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();




  //* //////////////////////// STATES
  const [neededData,] = useState({
    userID: getSessionInfo("id"),
    userName: getSessionInfo("name"),
  });

  // states needed when getting at page first render
  const [retrievedData, setRetrievedData] = useState({
    headquarter: [],
    industryType: [],
    companyType: [],
    numberEmployees: [],
    mainCustomers: []
  })

  const [mailModal, setMailModal] = useState(false);

  const [loaderState, setLoaderState] = useState(false);

  const [miniSpinner, setMiniSpinner] = useState(false);

  const [IndustryObj, setIndustryObj] = useState({
    accountNumbers: 1,
    social: [""],
    link: [""],
    files: [],
  });

  // state to manage errors
  // first value for the last selector
  // 2nd array is for the input texts
  const [socialsErrors, setSocialsErrors] = useState([false, [false]])

  const [otherInputOpen, setOtherInputOpen] = useState({
    companyType: false,
    industryType: false,
    headquarter: false,
  })



  // * ////////////////////// SET STATE

  const closeModal = () => {
    setMailModal(!mailModal);
  };


  // const handleChange = (name, value) => {
  //   setIndustryObj({ ...IndustryObj, [name]: value });
  // };


  const forcePageRender = () => {
    setIndustryObj(IndustryObj => {
      return ({ ...IndustryObj })
    })
  }



  const handleAddAccount = () => {

    let bool = true
    let tmparray = socialsErrors

    if (IndustryObj.social[IndustryObj.social.length - 1].length === 0) {
      bool = false
      tmparray[0] = true
    }


    for (let i = 0; i < IndustryObj.link.length; i++) {
      if (IndustryObj.link[i].length === 0) {
        bool = false
        tmparray[1][i] = true
      }
    }

    if (bool) {
      setIndustryObj({
        ...IndustryObj,
        "accountNumbers": IndustryObj.accountNumbers + 1,
        "social": [...IndustryObj.social, ""],
        "link": [...IndustryObj.link, ""]
      });
      tmparray[1].push(false)
    }
    setSocialsErrors(tmparray)

    forcePageRender()
  };



  const handleDeleteAccount = (index) => {

    if (IndustryObj.accountNumbers > 1) {


      let socials = [];
      let links = [];

      for (let i = 0; i < IndustryObj.social.length; i++) {
        if (i !== index) {
          socials.push(IndustryObj.social[i]);
          links.push(IndustryObj.link[i]);
        }
      }

      setIndustryObj({
        ...IndustryObj,
        social: socials,
        link: links,
        "accountNumbers": IndustryObj.accountNumbers - 1,
      });


      //  * * ************
      if (index === (IndustryObj.social.length - 1)) {
        let tmparray = socialsErrors[1]
        tmparray.pop()
        setSocialsErrors(([false, tmparray]))
      }
      else {
        let tmparray = [socialsErrors[0], []]
        for (let i = 0; i < socialsErrors[1].length; i++) {
          if (i !== index) {
            tmparray[1].push(socialsErrors[1][i])
          }
        }
        setSocialsErrors(tmparray)
      }

    }
  };



  const handleSocialsChange = (val, index) => {
    let values = [...IndustryObj.link];
    values[index] = val.target.value;

    if (val.target.value.length > 0) {
      let tmparr = socialsErrors
      tmparr[1][index] = false
      setSocialsErrors(tmparr)
    }
    else {
      let tmparr = socialsErrors
      tmparr[1][index] = true
      setSocialsErrors(tmparr)
    }

    setIndustryObj({ ...IndustryObj, link: values });
  };



  const handleSelectorSocialsChange = (val, index) => {
    let values = [...IndustryObj.social];
    values[index] = val.value;
    if (index === (IndustryObj.social.length - 1)) {
      let tmparr = socialsErrors
      tmparr[0] = false
      setSocialsErrors(tmparr)
    }
    setIndustryObj({ ...IndustryObj, social: values });
  };

  // const emptyFile = () => {
  //   setIndustryObj({
  //     ...IndustryObj,
  //     "files": {
  //       ...IndustryObj.files,
  //       fileSend: [],
  //       fileName: [],
  //     },
  //   });
  // }

  const handleOnFileChange = (e, name = "files") => {
    if (e.target.files.length > 0) {
      let Uploadedfile = e.target.files[0];

      let fd = new FormData();
      fd.append("file", Uploadedfile);

      setMiniSpinner(true);
      axios({
        method: "post",
        url: `${WS_LINK}upload_image`,
        data: fd,
      })
        .then((res) => {
          if (res.data !== "error") {

            let tmpFiles = IndustryObj.files
            tmpFiles.push({
              fileName: e.target.files[0].name,
              fileSend: res.data,
            })

            setIndustryObj({
              ...IndustryObj,
              [name]: tmpFiles,
            })

            // setIndustryObj({
            //   ...IndustryObj,
            //   [name]: {
            //     ...IndustryObj.files,
            //     fileSend: res.data,
            //     fileName: e.target.files[0].name,
            //   },
            // });
          }
          setMiniSpinner(false);
        })
        .catch((err) => {
          setMiniSpinner(false);
        });
    }
  };


  const removeFile2 = (file) => {

    setIndustryObj({
      ...IndustryObj,
      "files": IndustryObj.files.filter(item => item !== file)
    })

  }

  const handleOtherOpen = (isOther, name) => {
    if (isOther && !otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: true })
    else if (!isOther && otherInputOpen[name]) setOtherInputOpen({ ...otherInputOpen, [name]: false })
  }


  // to fill the data needed to registered fill_data

  useEffect(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    setLoaderState(true);
    axios({
      method: "get",
      url: `${WS_LINK}fill_data`,
      cancelToken: source.token,
    })
      .then((res) => {
        setLoaderState(false);
        setRetrievedData({
          headquarter: res.data[4],
          industryType: res.data[1],
          companyType: res.data[3],
          numberEmployees: res.data[2],
          mainCustomers: res.data[0]
        })
      })
      .catch((err) => {
        setLoaderState(false);
        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  }, []);



  const scroll = () => {
    document.getElementById("top").scrollIntoView({ behavior: "smooth" });
  };



  const onSubmit = (data) => {
    const itypes = data.industry.map((item) => item.id);

    ///////// social and link
    let temp_link = [];
    let temp_social = [];
    for (let i = 0; i < IndustryObj.link.length; i++) {
      if (IndustryObj.link[i].length !== 0) {
        temp_link[i] = IndustryObj.link[i];
        temp_social[i] = IndustryObj.social[i];
      }
    }
    temp_link = temp_link.filter(function (el) {
      return el != null;
    });
    temp_social = temp_social.filter(function (el) {
      return el != null;
    });

    let company_files = [];
    for (var i = 0; i < IndustryObj.files.length; i++) {
      company_files.push({ fileName: IndustryObj.files[i].fileName, file: IndustryObj.files[i].fileSend })
    }


    const postedData = {
      userid: neededData.userID,
      cName: data.name,
      cEmail: data.email,
      company_phone: data.phoneCode.value + "-" + data.phoneNumber,
      cAddress: data.country.value,
      address1: data.address1,
      address2: data.address2,
      iType: itypes,
      iType_spec: otherInputOpen.industryType ? data.otherIndustryType : '',
      cType: data.type.value,
      cType_spec: otherInputOpen.companyType ? data.otherCompanyType : '',
      employees: data.numberEmployees.value,
      product: data.productService,
      customer: data.customers,
      website: data.website,
      file: company_files,
      fileName: IndustryObj.files.fileName === '' ? [] : IndustryObj.files.fileName,
      social: temp_social,
      link: temp_link,
      headquarter: data.headquarters.value,
      headquarter_spec: otherInputOpen.headquarter ? data.otherHeadquarter : '',
      age: data.age,
    };

    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    setLoaderState(true);
    axios({
      method: "post",
      url: `${WS_LINK}register_company`,
      data: postedData,
      cancelToken: source.token,
    })
      .then((res) => {
        setLoaderState(false);
        if (res.data === "submited") {
          setMailModal(true);
          removeSessionInfo('tempLoggedIn')
          setSessionInfo({ name: "loggedIn", val: true })
          setSessionInfo({ name: "role", val: 3 })
        } else if (res.data === "user industry already exist") {
          props.history.replace("/");
          toast.error(getSessionInfo('language') === 'english' ? "user industry already exists" : "المستخدم Industry موجود بالفعل", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
          });
        } else {
          if (res.data === "error") {
            toast.error(getSessionInfo('language') === 'english' ? "something went wrong..." : "حصل خطأ ما...", {
              position: "top-right",
              autoClose: 2500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
          }
        }
      })
      .catch((err) => {
        setLoaderState(false);
        if (axios.isCancel(err)) {
          console.log("request canceled");
        } else {
          console.log("request failed");
        }
      });
  };



  // CONSTANTS

  const socialMediaOptions = [
    { value: "Twitter", label: <span style={{ fontFamily: 'cnam' }}>Twitter</span> },
    { value: "Facebook", label: <span style={{ fontFamily: 'cnam' }}>Facebook</span> },
    { value: "Instagram", label: <span style={{ fontFamily: 'cnam' }}>Instagram</span> },
    { value: "LinkedIn", label: <span style={{ fontFamily: 'cnam' }}>LinkedIn</span> },
  ];

  // industry type selector with multi selection
  const industry_options = retrievedData.industryType.map((elem) => ({
    value: elem.name_industry_type,
    label: elem.name_industry_type,
    id: elem.id_industry_type,
  }));


  const industry_options_ar = retrievedData.industryType.map((elem) => ({
    value: elem.name_industry_type_arabic,
    label: <span style={{ fontFamily: 'cnam-ar' }}>{elem.name_industry_type_arabic}</span>,
    id: elem.id_industry_type,
  }));

  const company_head = retrievedData.headquarter.map(item => ({
    value: item.option_id,
    label: <span style={{ fontFamily: checkFontFamily() }}>{getSessionInfo('language') === 'arabic' ? item.option_value_a : item.option_value_e}</span>
  }))




  const company_type = retrievedData.companyType.map(item => ({
    value: item.option_id,
    label: <span style={{ fontFamily: 'cnam' }}>{item.option_value_e}</span>,
  }))


  const company_type_ar = retrievedData.companyType.map(item => ({
    value: item.option_id,
    label: <span style={{ fontFamily: 'cnam-ar' }}>{item.option_value_a}</span>,
  }))

  const number_of_empployees = retrievedData.numberEmployees.map(item => ({
    value: item.option_id,
    label: getSessionInfo('language') === 'arabic' ? item.option_value_a : item.option_value_e,
  }))

  const company_address = [{ value: "Lebanon", label: <span style={{ fontFamily: 'cnam' }}>Lebanon</span> }];
  const company_address_ar = [{ value: "Lebanon", label: <span style={{ fontFamily: 'cnam-ar' }}>لبنان</span> }];




  ///// customers radio buttons
  const atLeastOne = () => (getValues("customers").length ? true : false);

  const customers = retrievedData.mainCustomers.map((item) => (
    <>
      <FormControlLabel
        key={item.id_main_customer}
        className={getSessionInfo('language') === 'english' ? "col-12 col-sm-6 mx-0 p-0" : "col-12 col-sm-6 mx-0 p-0 text-right"}
        control={
          <input
            className={errors.customers && "error_check"}
            key={item.id_main_customer}
            value={item.id_main_customer}
            type="checkbox"
            style={{ zoom: 1.2, paddingRight: '10px' }}
            color="default"
            {...register("customers", {
              validate: atLeastOne,
            })}
          />
        }
        label={<span
          className={getSessionInfo('language') === 'english' ? "checkbox" : "pr-1"}
          style={{ fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }}>
          {getSessionInfo('language') === 'english' ? item.name_customer : item.name_customer_arabic}
        </span>}
      />
    </>
  ));




  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            defaultChecked={props.isSelected}
            style={{ verticalAlign: "middle" }}
            className="mr-1"
          />{" "}
          <label
            className="d-inline-block"
            style={{ width: "80%", verticalAlign: "text-top", fontFamily: getSessionInfo('language') === 'english' ? 'cnam' : 'cnam-ar' }}
          >
            {props.value}{" "}
          </label>
        </components.Option>
      </div>
    );
  };




  const MultiValue = (props) => {
    return (
      <components.MultiValue {...props}>
        <span style={{ fontFamily: 'cnam' }}>{props.data.label}</span>
      </components.MultiValue>
    );
  };




  // to create all the accounts of the social medias
  let socialdivs = [];
  for (let i = 0; i < IndustryObj.accountNumbers; i++) {
    socialdivs[i] = (
      <React.Fragment key={i} >
        <Selector
          value={
            IndustryObj.social[i].length > 0
              ? { value: IndustryObj.social[i], label: IndustryObj.social[i] }
              : " "
          }
          options={socialMediaOptions}
          onChange={(val) => handleSelectorSocialsChange(val, i)}
          placeholder={getSessionInfo('language') === 'english' ? "Select social" : "حدد الاجتماعية"}
          className={`col-12 col-sm-12 col-md-4 col-lg-3 mb-2 pl-0 w_shadow social_selector ${i === (IndustryObj.accountNumbers - 1) && socialsErrors[0] && 'selector-error-border'}`}
          style={{ boxShadow: "0px 1px 3px -2px #888888" }}
        />

        <div className="col-10 col-sm-10 col-md-7 col-lg-8   ml-sm-0 ml-md-1 ml-xl-2   px-0   mb-1 mb-sm-3 mb-md-2 ">
          <InputText
            type="text"
            value={IndustryObj.link[i]}
            onChange={(val) => handleSocialsChange(val, i)}
            placeholder={getSessionInfo('language') === 'english' ? "@company Name" : "@اسم المنشأة"}
            className={`${socialsErrors[1][i] && 'social-error-border'}`}
          />
        </div>
        {IndustryObj.accountNumbers > 1 && (
          <>
            <DeleteIcon
              className="col-1 pointer mt-3 px-0 mx-0 "
              onClick={() => handleDeleteAccount(i)}
            />
          </>
        )}
      </React.Fragment>
    );
  }

















  return (
    <Loader
      message={
        <span>
          <Spinner />{" "}
        </span>
      }
      show={loaderState}
      backgroundStyle={{ zIndex: "9999" }}
    >
      <Helmet>
        <title>{getSessionInfo('language') === 'arabic' ?
          'سجل الصناعة (2) | عن برنامج الشراكة المعرفية'
          :
          'Industry Register (2) | CNAM PORTAL'
        }</title>
      </Helmet>
      <div>
        <Simple
          noBack={true}
          props={props}
          logo={true}
          left={
            <>
              <IndustryModal
                props={props}
                state={mailModal}
                toggleState={closeModal}
                path={`/dashboard`}
                removeSession={true}
              />

              {getSessionInfo("language") === "english" ? (
                <>
                  <div className="col-lg-12 mx-auto" id="top">
                    <form
                      encType="multipart/form-data"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="row mb-3">
                        <div
                          className="col-12  mb-2 p-0"
                          style={{
                            fontFamily: "cnam-bold",
                            fontSize: "1.8rem",
                          }}
                        >
                          Welcome {neededData.userName},
                        </div>
                        <div className="col-12 mb-3 p-0 h5">
                          Please add the company information
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Name *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="Company Name"
                              className="col-12"
                              onChange={onChange}
                              style={{
                                border: errors.name ? "1px solid red" : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="name"
                          control={control}
                        />
                        {errors.name && errors.name.type === "required" && (
                          <span className="errors">
                            Company Name is required.
                          </span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Email *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              onChange={onChange}
                              style={{
                                border: errors.email ? "1px solid red" : "",
                              }}
                              placeholder="name@email.com"
                              className="col-12 "
                            />
                          )}
                          //className="form-control"
                          rules={{
                            required: true,
                            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                          }}
                          name="email"
                          control={control}
                        />
                        {errors.email && errors.email.type === "required" && (
                          <span className="errors">Email is required.</span>
                        )}
                        {errors.email && errors.email.type === "pattern" && (
                          <span className="errors">Email is not valid.</span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Phone Number *
                        </div>
                        <div className="d-md-flex px-0">
                          <div className="col-lg-3 col-sm-3 mt-1 pl-0 pr-1">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <Selector
                                  value={value}
                                  className={errors.phoneCode && "border_form_selector"}
                                  onChange={onChange}
                                  options={[{ value: "+961", label: "+961" }]}
                                  placeholder="+961"
                                />
                              )}
                              // <Selector
                              rules={{ required: true }}
                              name="phoneCode"
                              control={control}
                            />
                            {errors.phoneCode && <span className="errors text-right">Mobile code is required.</span>}
                          </div>
                          <div className="col-lg-9 col-sm-9 mt-1 pr-0 mr-0">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputNumeric
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  placeholder="76 666 6666"
                                  format="## ### ####"
                                  style={{
                                    border: errors.phoneNumber ? "1px solid red" : "",
                                  }}
                                />
                              )}
                              rules={{
                                required: true,
                                // eslint-disable-next-line no-useless-escape
                                pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                              }}
                              name="phoneNumber"
                              control={control}
                            />
                            {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                              <span className="errors">Mobile number is required.</span>
                            )}
                            {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                              <span className="errors">Mobile number is invalid.</span>
                            )}
                          </div>
                        </div>
                      </div>


                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Address *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={onChange}
                              options={company_address}
                              placeholder="Country"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.country && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="country"
                          control={control}
                        />
                        {errors.country && (
                          <span className="errors_c">Country is required.</span>
                        )}

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              // eslint-disable-next-line eqeqeq
                              onChange={e => { onChange(e); handleOtherOpen(e.value == 30, 'headquarter') }}
                              options={company_head}
                              placeholder="Company Headquarters"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.headquarters && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="headquarters"
                          control={control}
                        />
                        {errors.headquarters && (
                          <span className="errors_c">
                            Headquarters is required.
                          </span>
                        )}

                        {
                          otherInputOpen.headquarter &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="please specify"
                                  className="col-12 mb-2"
                                  style={{ border: errors.otherHeadquarter ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherHeadquarter"
                              control={control}
                            />
                            {
                              errors.otherHeadquarter && (
                                <span className="errors_c">Specification is required.</span>
                              )
                            }
                          </>
                        }

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="Address Line 1"
                              className="col-12 mb-2 "
                              onChange={onChange}
                              style={{
                                border: errors.address1 ? "1px solid red" : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="address1"
                          control={control}
                        />
                        {errors.address1 &&
                          errors.address1.type === "required" && (
                            <span className="errors_c">
                              Company Address is required.
                            </span>
                          )}


                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              type="text"
                              name="address2"
                              value={value}
                              onChange={onChange}
                              placeholder="Address Line 2"
                              className="col-12 mb-2"
                            />
                          )}
                          rules={{ required: false }}
                          name="address2"
                          control={control}
                        />
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Industry Type *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Select
                              id="industry"
                              isMulti
                              hideSelectedOptions={false}
                              backspaceRemovesValue={false}
                              components={{ Option, MultiValue }}
                              value={value}
                              onChange={e => { onChange(e); handleOtherOpen(e.filter(item => item.value === 'Other Industry' && true).length > 0, 'industryType') }}
                              options={industry_options}
                              placeholder="Select the industry type"
                              className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${errors.industry && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="industry"
                          control={control}
                        />
                        {errors.industry && (
                          <span className="errors_c">
                            Industry is required.
                          </span>
                        )}
                        {
                          otherInputOpen.industryType &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="please specify"
                                  className="col-12"
                                  style={{ border: errors.otherIndustryType ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherIndustryType"
                              control={control}
                            />
                            {
                              errors.otherIndustryType && (
                                <span className="errors_c">Specification is required.</span>
                              )
                            }
                          </>
                        }
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Type *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={e => { onChange(e); handleOtherOpen(e.value === 37, 'companyType') }}
                              options={company_type}
                              placeholder="Select the company type"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.type && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="type"
                          control={control}
                        />
                        {errors.type && (
                          <span className="errors_c">
                            Company type is required.
                          </span>
                        )}
                        {
                          otherInputOpen.companyType &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="please specify"
                                  className="col-12"
                                  style={{ border: errors.otherCompanyType ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherCompanyType"
                              control={control}
                            />
                            {
                              errors.otherCompanyType && (
                                <span className="errors_c">Specification is required.</span>
                              )
                            }
                          </>
                        }
                      </div>


                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Number of Employees *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={onChange}
                              options={number_of_empployees}
                              placeholder="Select the number of employees"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.numberEmployees && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="numberEmployees"
                          control={control}
                        />
                        {errors.numberEmployees && (
                          <span className="errors_c">Field is required.</span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          What is the age of the company? *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              onChange={onChange}
                              style={{
                                border: errors.age ? "1px solid red" : "",
                              }}
                              placeholder="What is the age of the company?"
                              className="col-12 "
                            />
                          )}
                          //className="form-control"
                          rules={{
                            required: true,
                          }}
                          name="age"
                          control={control}
                        />
                        {errors.age && errors.age.type === "required" && (
                          <span className="errors">
                            Please specify your company age.
                          </span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Primary Product or Service *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="e.g: Artificial Intelligence"
                              className="col-12 mb-2"
                              onChange={onChange}
                              style={{
                                border: errors.productService
                                  ? "1px solid red"
                                  : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="productService"
                          control={control}
                        />
                        {errors.productService &&
                          errors.productService.type === "required" && (
                            <span className="errors_c">Field is required.</span>
                          )}
                      </div>
                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Main Customers *
                        </div>

                        <FormGroup row>{customers}</FormGroup>
                        {errors.customers && (
                          <div className="errors">At-least one is required</div>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Website
                        </div>

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              name="website"
                              placeholder="http://companyName.com"
                              className="col-12 mb-2"
                              value={value || ''}
                              onChange={onChange}
                            />

                          )}
                          rules={{ required: false }}
                          name="website"
                          control={control}
                        />

                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-2 file-input">
                          Company Profile
                        </div>

                        <label
                          style={{ textDecoration: "none" }}
                          htmlFor="exampleCustomFileBrowser"
                          className="pointer pl-0"
                        >
                          <img src={Upload} width={13} alt="up-ic" />{" "}
                          <span style={{ color: "#6C6C6C" }}>
                            Upload PDF document
                          </span>
                        </label>

                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="exampleCustomFileBrowser"
                          name="files"
                          onChange={handleOnFileChange}
                          className="col-6 p-0"
                          accept="application/pdf"
                          disabled={miniSpinner}
                        />
                        {IndustryObj.files.fileName !== "" && (
                          IndustryObj.files.map((file) => {
                            return <div className="d-flex ml-4">
                              <Clear className="mr-0 pointer" onClick={() => removeFile2(file)} />
                              <span className="pointer" onClick={() => downloadFile(file.fileSend, file.fileName)}>{" "}{file.fileName}{" "}</span>
                            </div>
                          })
                        )}
                        {miniSpinner && (
                          <div className="spinner-border spinner-border-sm" style={{ width: '1.3rem', height: '1.3rem', paddingRight: '0', paddingLeft: '0' }} role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>

                      <div className="row mb-3">
                        <div className="col-12 p-0 bold_700  mb-1">
                          Company Social Media Accounts
                        </div>

                        {socialdivs}

                        <Button
                          name="accountNumbers"
                          value={IndustryObj.accountNumbers}
                          className="addSocialButton p-0 mt-2 col-8 col-md-6 col-lg-4 col-xl-3 text-left"
                          color="link"
                          onClick={handleAddAccount}
                          style={{ fontSize: "14px" }}
                        >
                          + Add Another Account
                        </Button>
                      </div>
                      <hr className=" mx-auto"></hr>

                      <div className="d-sm-flex col-lg-12 p-0">
                        <div
                          className=" mt-4"
                          style={{ color: "#848484", fontSize: "13px" }}
                        >
                          {" "}
                          By submitting you information, you agree to CNAM Privacy Policy{" "}
                         
                        
                        </div>

                        <div className="mt-4 col-lg-5">
                          <Button
                            disabled={miniSpinner}
                            style={{
                              backgroundColor: "#6C6C6C",
                              padding: "0.7rem 2rem",
                              border: "none",
                              fontWeight: "600",
                              background: "rgb(198 2 36)",
                            }}
                            className="ml-sm-auto d-flex "
                            type="submit"
                            onClick={scroll}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (


                // *  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ARABIC!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                <>
                  <div className="col-lg-12 mx-auto" id="top" style={{ fontFamily: 'cnam-ar' }}>
                    <form
                      encType="multipart/form-data"
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <div className="row mb-3">
                        <div
                          className="col-12  mb-2 p-0 text-right"
                          style={{
                            fontFamily: "cnam-bold-ar",
                            fontSize: "1.8rem",
                          }}
                        >
                          مرحبا  <span style={{ fontFamily: 'cnam' }}>{neededData.userName}</span>,
                        </div>
                        <div className="col-12 mb-3 p-0 h5 text-right">
                          الرجاء إضافة معلومات المنشأة
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          اسم المنشأة *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="اسم المنشأة"
                              className="col-12"
                              onChange={onChange}
                              style={{
                                border: errors.name ? "1px solid red" : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="name"
                          control={control}
                        />
                        {errors.name && errors.name.type === "required" && (
                          <span className="errors">
                            اسم المنشأة مطلوب.
                          </span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          البريد الإلكتروني للشركة *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              onChange={onChange}
                              style={{
                                border: errors.email ? "1px solid red" : "",
                                fontFamily: 'cnam'
                              }}
                              placeholder="البريد الإلكتروني"
                              className="col-12 "
                            />
                          )}
                          //className="form-control"
                          rules={{
                            required: true,
                            pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                          }}
                          name="email"
                          control={control}
                        />
                        {errors.email && errors.email.type === "required" && (
                          <span className="errors">البريد الالكتروني مطلوب.</span>
                        )}
                        {errors.email && errors.email.type === "pattern" && (
                          <span className="errors">البريد الإلكتروني غير صالح.</span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          رقم هاتف المنشأة
                        </div>
                        <div className="d-md-flex px-0">
                          <div className="col-lg-3 col-sm-3 mt-1 pl-1 pr-0">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <Selector
                                  value={value}
                                  className={errors.phoneCode && "border_form_selector"}
                                  onChange={onChange}
                                  options={[{ value: "+961", label: "+961" }]}
                                  placeholder="961"
                                />
                              )}
                              // <Selector
                              rules={{ required: true }}
                              name="phoneCode"
                              control={control}
                            />
                            {errors.phoneCode && <span className="errors text-right">كود الهاتف المحمول مطلوب.</span>}
                          </div>
                          <div className="col-lg-9 col-sm-9 mt-1 pl-0">
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputNumeric
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e);
                                  }}
                                  placeholder="۰۰ ۰۰۰ ۰۰۰"
                                  format="## ### ###"
                                  style={{
                                    border: errors.phoneNumber ? "1px solid red" : "",
                                    textAlign: 'right',
                                    direction: 'ltr'
                                  }}
                                />
                              )}
                              rules={{
                                required: true,
                                // eslint-disable-next-line no-useless-escape
                                pattern: /^\d{2}[\ ]\d{3}[\ ]\d{4}$/,
                              }}
                              name="phoneNumber"
                              control={control}
                            />
                            {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                              <span className="errors">رقم الهاتف المحمول مطلوب.</span>
                            )}
                            {errors.phoneNumber && errors.phoneNumber.type === "pattern" && (
                              <span className="errors">رقم الجوال غير صحيح.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          عنوان المنشأة *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={onChange}
                              options={company_address_ar}
                              placeholder="دولة"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.country && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="country"
                          control={control}
                        />
                        {errors.country && (
                          <span className="errors_c">الدولة مطلوبة.</span>
                        )}

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              // eslint-disable-next-line eqeqeq
                              onChange={e => { onChange(e); handleOtherOpen(e.value == 30, 'headquarter'); }}
                              options={company_head}
                              placeholder="المقر الرئيسي للشركة"
                              className={`col-12 mb-2 p-0  w_shadow ${errors.headquarters && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="headquarters"
                          control={control}
                        />
                        {errors.headquarters && (
                          <span className="errors_c">
                            المقر مطلوب.
                          </span>
                        )}
                        {
                          otherInputOpen.headquarter &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="يرجى تحديد"
                                  className="col-12 mb-2"
                                  style={{ border: errors.otherHeadquarter ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherHeadquarter"
                              control={control}
                            />
                            {
                              errors.otherHeadquarter && (
                                <span className="errors_c">المواصفات مطلوبة.</span>
                              )
                            }
                          </>
                        }

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="خط عنوان 1"
                              className="col-12 mb-2 "
                              onChange={onChange}
                              style={{
                                border: errors.address1 ? "1px solid red" : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="address1"
                          control={control}
                        />
                        {errors.address1 &&
                          errors.address1.type === "required" && (
                            <span className="errors_c">
                              عنوان المنشأة مطلوب.
                            </span>
                          )}

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              type="text"
                              name="address2"
                              value={value}
                              onChange={onChange}
                              placeholder="خط عنوان 2"
                              className="col-12 mb-2"
                            />
                          )}
                          rules={{ required: false }}
                          name="address2"
                          control={control}
                        />

                      </div>

                      <div className="row mb-4 text-right">
                        <div className="col-12 p-0 bold_700  mb-1">
                          مجال عمل المنشأة *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Select
                              id="Industry"
                              isMulti
                              hideSelectedOptions={false}
                              backspaceRemovesValue={false}
                              components={{ Option, MultiValue }}
                              value={value}
                              onChange={e => { onChange(e); handleOtherOpen(e.filter(item => item.value === 'صناعة أخرى').length > 0, 'industryType') }}
                              options={industry_options_ar}
                              placeholder="حدد مجال عمل المنشأة"
                              className={`col-12 mb-2 p-0 w_shadow basic-multi-select ${errors.industry && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888", fontFamily: 'cnam-ar' }}
                            />
                          )}
                          rules={{ required: true }}
                          name="industry"
                          control={control}
                        />
                        {errors.industry && (
                          <span className="errors_c">
                            الصناعة مطلوبة.
                          </span>
                        )}

                        {
                          otherInputOpen.industryType &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="يرجى تحديد"
                                  className="col-12"
                                  style={{ border: errors.otherIndustryType ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherIndustryType"
                              control={control}
                            />
                            {
                              errors.otherIndustryType && (
                                <span className="errors_c">المواصفات مطلوبة.</span>
                              )
                            }
                          </>
                        }
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          نوع المنشأة*
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={e => { onChange(e); handleOtherOpen(e.value === 37, 'companyType') }}
                              options={company_type_ar}
                              placeholder="حدد نوع المنشأة"
                              className={`text-right col-12 mb-2 p-0  w_shadow ${errors.type && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888", fontFamily: 'cnam-bold-ar' }}
                            />
                          )}
                          rules={{ required: true }}
                          name="type"
                          control={control}
                        />
                        {errors.type && (
                          <span className="errors_c">
                            نوع المنشأة مطلوب.
                          </span>
                        )}
                        {
                          otherInputOpen.companyType &&
                          <>
                            <Controller
                              render={({ field: { onChange, value } }) => (
                                <InputText
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="يرجى تحديد"
                                  className="col-12"
                                  style={{ border: errors.otherCompanyType ? '1px solid red' : '' }}
                                />
                              )}
                              rules={{ required: true }}
                              name="otherCompanyType"
                              control={control}
                            />
                            {
                              errors.otherCompanyType && (
                                <span className="errors_c">المواصفات مطلوبة.</span>
                              )
                            }
                          </>
                        }
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          عدد الموظفين *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <Selector
                              value={value}
                              onChange={onChange}
                              options={number_of_empployees}
                              placeholder="حدد عدد الموظفين"
                              className={`text-right col-12 mb-2 p-0  w_shadow ${errors.numberEmployees && "border_form_selector"
                                }`}
                              style={{ boxShadow: "0px 1px 3px -2px #888888" }}
                            />
                          )}
                          rules={{ required: true }}
                          name="numberEmployees"
                          control={control}
                        />
                        {errors.numberEmployees && (
                          <span className="errors_c">الحقل مطلوب.</span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          ما هو عمر المنشأة؟ *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              onChange={onChange}
                              style={{
                                border: errors.age ? "1px solid red" : "",
                              }}
                              placeholder="ما هو عمر المنشأة؟"
                              className="col-12 "
                            />
                          )}
                          //className="form-control"
                          rules={{
                            required: true,
                          }}
                          name="age"
                          control={control}
                        />
                        {errors.age && errors.age.type === "required" && (
                          <span className="errors">
                            الرجاء تحديد عمر شركتك.
                          </span>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                        المنتج الأساسي أو الخدمة التي تقدمها المنشآة​ *
                        </div>
                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              value={value || ""}
                              placeholder="على سبيل المثال: الذكاء الاصطناعي"
                              className="col-12 mb-2"
                              onChange={onChange}
                              style={{
                                border: errors.productService
                                  ? "1px solid red"
                                  : "",
                              }}
                            />
                          )}
                          rules={{ required: true }}
                          name="productService"
                          control={control}
                        />
                        {errors.productService &&
                          errors.productService.type === "required" && (
                            <span className="errors_c">الحقل مطلوب.</span>
                          )}
                      </div>
                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                         عملاء المنشأة أو المستفيد الأساسي من الخدمات التي تقدمها المنشأة*
                        </div>

                        <div style={{ fontFamily: 'cnam' }}>
                          <FormGroup row>{customers}</FormGroup>
                        </div>
                        {errors.customers && (
                          <div className="errors">مطلوب واحد على الأقل</div>
                        )}
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          موقع المنشأة
                        </div>

                        <Controller
                          render={({ field: { onChange, value } }) => (
                            <InputText
                              name="website"
                              placeholder="الموقع الالكتروني "
                              style={{ fontFamily: 'cnam' }}
                              className="col-12 mb-2"
                              value={value}
                              onChange={onChange}
                            // style={{ border: errors.website ? "1px solid red" : "" }}
                            />
                          )}
                          rules={{ required: false }}
                          name="website"
                          control={control}
                        />
                      </div>

                      <div className="row mb-4">
                        <div className="col-12 p-0 bold_700  mb-2 file-input text-right">
                          ملف المنشأة
                        </div>

                        <label
                          style={{ textDecoration: "none" }}
                          htmlFor="exampleCustomFileBrowser"
                          className="pointer pr-0"
                        >
                          <img src={Upload} width={13} alt="up-ic" />{" "}
                          <span style={{ color: "#6C6C6C" }}>
                            تحميل وثيقة PDF
                          </span>
                        </label>

                        <input
                          type="file"
                          style={{ display: "none" }}
                          id="exampleCustomFileBrowser"
                          name="files"
                          onChange={handleOnFileChange}
                          className="col-6 p-0"
                          accept="application/pdf"
                          disabled={miniSpinner}
                        />
                        {IndustryObj.files.fileName !== "" && (
                          IndustryObj.files.map((file) => {
                            return <div className="d-flex ml-4">
                              <Clear className="ml-0 pointer" onClick={() => removeFile2(file)} />
                              <span className="pointer" onClick={() => downloadFile(file.fileSend, file.fileName)}>{" "}{file.fileName}{" "}</span>
                            </div>
                          })
                        )}
                        {miniSpinner && (
                          <div className="spinner-border spinner-border-sm" style={{ width: '1.3rem', height: '1.3rem', paddingRight: '0', paddingLeft: '0' }} role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </div>

                      <div className="row mb-3 justify-content-between">
                        <div className="col-12 p-0 bold_700  mb-1 text-right">
                          حسابات وسائل التواصل الاجتماعي الخاصة بالمنشأة
                        </div>

                        {socialdivs}

                        <Button
                          name="accountNumbers"
                          value={IndustryObj.accountNumbers}
                          className="addSocialButton p-0 mt-2 col-8 col-md-6 col-lg-4 col-xl-3 text-right"
                          color="link"
                          onClick={handleAddAccount}
                          style={{ fontSize: "14px" }}
                        >
                          + إضافة حساب آخر
                        </Button>
                      </div>
                      <hr className=" mx-auto"></hr>

                      <div className="d-sm-flex col-lg-12 p-0 justify-content-between get-started-ar" style={{ textAlign: 'right', paddingLeft: '15px' }}>
                        <div
                          className=" mt-4"
                          style={{ color: "#848484", fontSize: "13px", fontFamily: 'cnam-light-ar' }}
                        >
                         
                        </div>

                        <div className="mt-4 ">
                          <Button
                            disabled={miniSpinner}
                            style={{
                              backgroundColor: "#6C6C6C",
                              padding: "0.7rem 2rem",
                              border: "none",
                              fontWeight: "600",
                              background: "rgb(198 2 36)",
                            }}
                            className="ml-sm-auto d-flex "
                            type="submit"
                            onClick={scroll}
                          >
                            يكمل
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </>
          }
          right={
            <>
              <div className="row">
                <div
                  className="col-12 mb-2"
                  style={{ fontFamily: getSessionInfo("language") === "english" ? "cnam-bold" : "cnam-bold-ar", fontSize: "18px" }}
                >
                  {
                    getSessionInfo("language") === "english" ? 'Welcome to CNAM Portal' : 'مرحبًا بكم في برنامج الشراكة المعرفية'
                  }

                </div>
            
              </div>
            </>
          }
        />
      </div>
    </Loader>
  );
}


