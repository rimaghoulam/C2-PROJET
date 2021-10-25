export const WS_LINK =
  window.location.protocol + "//localhost:8000/api/";

export const Website_Name = "CNAM Portal";



export const beforeLoginRoutes = [
  "/","/home", "/industry_kpp", "/news", "/guidelines", "/eligibility", "/news_details", "/contact_us", "/events", "/success_stories", "/photos", "/terms_of_service", "/privacy_policy"
]

///////// Industry Register headquarters data + edit company


export const company_address = [
  { value: "Saudi Arabia", label: "Saudi Arabia" },
];

export const company_type = [
  {
    value: "Private Limited Company (Ltd.)",
    label: "Private Limited Company (Ltd.)",
  },
  {
    value: "Joint-Stock Corporation (JRC)",
    label: "Joint-Stock Corporation (JRC)",
  },
  {
    value: "Private Limited Liability Company",
    label: "Private Limited Liability Company",
  },
  { value: "General Partnership", label: "General Partnership" },
  { value: "One Owner/Person Company", label: "One Owner/Person Company" },
  {
    value: "Establishment (Sole Proprietorship)",
    label: "Establishment (Sole Proprietorship)",
  },
  { value: "Other Type", label: "Other Type" },
];

export const number_of_employees = [
  { value: "1 to 5", label: "1 to 5" },
  { value: "6 to 50", label: "6 to 50" },
  { value: "51 to 250", label: "51 to 250" },
  { value: "More than 250", label: "More than 250" },
];

export const socialMediaOptions = [
  { value: "Twitter", label: "Twitter" },
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "LinkedIn", label: "LinkedIn" },
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
