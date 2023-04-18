/* -- Open configuration form -- */

function openForm(form) {
  /* display configuration form by clicking the planet icon */
  popup = document.getElementById(form);
  popup.classList.remove("hidden");
  setTimeout(function () {
    popup.classList.remove("visuallyhidden");
  }, 20);
  document.querySelector("#overlay").style.display = "block";
  document.querySelector("#overlay2").style.display = "block";
}
function closeForm(form) {
  /* Close configuration form*/
  popup = document.getElementById(form);
  popup.classList.add("visuallyhidden");
  popup.addEventListener(
    "transitionend",
    function (e) {
      popup.classList.add("hidden");
    },
    {
      capture: false,
      once: true,
      passive: false,
    }
  );
  document.querySelector("#overlay").style.display = "none";
  document.querySelector("#overlay2").style.display = "none";
}

/* -- Google Translate API -- */

function googleTranslateElementInit() {
  /* set API properties and languages*/
  new google.translate.TranslateElement(
    {
      autoDisplay: "true",
      pageLanguage: "en",
      includedLanguages: "de,en,zh-CN,es,fr,pt,it",
      layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
    },
    "google_translate_element"
  );
}

//Get chosen languaged
function readCookie(name) {
  var c = document.cookie.split("; "),
    cookies = {}, i, C;

  for (i = c.length - 1; i >= 0; i--) {
    C = c[i].split("=");
    cookies[C[0]] = C[1];
  }

  return cookies[name];
}

// Save chosen language as input
function select_language() {
  var clicked_name = readCookie("googtrans");
  document.querySelector("#input_language").value = clicked_name;
}

/* -- Upload countries and currency data -- */
// List from  market.json
const countries = [
  {
    code: "AD",
    name: "Andorra",
    currency: "EUR",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    currency: "AED",
  },
  {
    code: "AF",
    name: "Afghanistan",
    currency: "AFN",
  },
  {
    code: "AG",
    name: "Antigua and Barbuda",
    currency: "XCD",
  },
  {
    code: "AI",
    name: "Anguilla",
    currency: "XCD",
  },
  {
    code: "AL",
    name: "Albania",
    currency: "ALL",
  },
  {
    code: "AM",
    name: "Armenia",
    currency: "AMD",
  },
  {
    code: "AO",
    name: "Angola",
    currency: "AOA",
  },
  {
    code: "AQ",
    name: "Antarctica",
    currency: "USD",
  },
  {
    code: "AR",
    name: "Argentina",
    currency: "ARS",
  },
  {
    code: "AS",
    name: "American Samoa",
    currency: "USD",
  },
  {
    code: "AT",
    name: "Austria",
    currency: "EUR",
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
  },
  {
    code: "AW",
    name: "Aruba",
    currency: "AWG",
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    currency: "AZN",
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    currency: "BAM",
  },
  {
    code: "BB",
    name: "Barbados",
    currency: "BBD",
  },
  {
    code: "BD",
    name: "Bangladesh",
    currency: "BDT",
  },
  {
    code: "BE",
    name: "Belgium",
    currency: "EUR",
  },
  {
    code: "BF",
    name: "Burkina Faso",
    currency: "XOF",
  },
  {
    code: "BG",
    name: "Bulgaria",
    currency: "BGN",
  },
  {
    code: "BH",
    name: "Bahrain",
    currency: "BHD",
  },
  {
    code: "BI",
    name: "Burundi",
    currency: "BIF",
  },
  {
    code: "BJ",
    name: "Benin",
    currency: "XOF",
  },
  {
    code: "BL",
    name: "Saint Barthelemy",
    currency: "EUR",
  },
  {
    code: "BM",
    name: "Bermuda",
    currency: "BMD",
  },
  {
    code: "BN",
    name: "Brunei",
    currency: "BND",
  },
  {
    code: "BO",
    name: "Bolivia",
    currency: "BOB",
  },
  {
    code: "BQ",
    name: "Caribbean Netherlands",
    currency: "USD",
  },
  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
  },
  {
    code: "BS",
    name: "Bahamas",
    currency: "BSD",
  },
  {
    code: "BT",
    name: "Bhutan",
    currency: "BTN",
  },
  {
    code: "BW",
    name: "Botswana",
    currency: "BWP",
  },
  {
    code: "BY",
    name: "Belarus",
    currency: "BYN",
  },
  {
    code: "BZ",
    name: "Belize",
    currency: "BZD",
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
  },
  {
    code: "CC",
    name: "Cocos (Keeling) Islands",
    currency: "AUD",
  },
  {
    code: "CD",
    name: "DR Congo",
    currency: "CDF",
  },
  {
    code: "CF",
    name: "Central African Republic",
    currency: "XAF",
  },
  {
    code: "CG",
    name: "Congo",
    currency: "XAF",
  },
  {
    code: "CH",
    name: "Switzerland",
    currency: "CHF",
  },
  {
    code: "CI",
    name: "Ivory Coast",
    currency: "XOF",
  },
  {
    code: "CK",
    name: "Cook Islands",
    currency: "NZD",
  },
  {
    code: "CL",
    name: "Chile",
    currency: "CLP",
  },
  {
    code: "CM",
    name: "Cameroon",
    currency: "XAF",
  },
  {
    code: "CN",
    name: "China",
    currency: "CNY",
  },
  {
    code: "CO",
    name: "Colombia",
    currency: "COP",
  },
  {
    code: "CR",
    name: "Costa Rica",
    currency: "CRC",
  },
  {
    code: "CU",
    name: "Cuba",
    currency: "CUP",
  },
  {
    code: "CV",
    name: "Cape Verde",
    currency: "CVE",
  },
  {
    code: "CW",
    name: "Curacao",
    currency: "ANG",
  },
  {
    code: "CX",
    name: "Christmas Island",
    currency: "AUD",
  },
  {
    code: "CY",
    name: "Cyprus",
    currency: "EUR",
  },
  {
    code: "CZ",
    name: "Czech Republic",
    currency: "CZK",
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
  },
  {
    code: "DJ",
    name: "Djibouti",
    currency: "DJF",
  },
  {
    code: "DK",
    name: "Denmark",
    currency: "DKK",
  },
  {
    code: "DM",
    name: "Dominica",
    currency: "XCD",
  },
  {
    code: "DO",
    name: "Dominican Republic",
    currency: "DOP",
  },
  {
    code: "DZ",
    name: "Algeria",
    currency: "DZD",
  },
  {
    code: "EC",
    name: "Ecuador",
    currency: "USD",
  },
  {
    code: "EE",
    name: "Estonia",
    currency: "EUR",
  },
  {
    code: "EG",
    name: "Egypt",
    currency: "EGP",
  },
  {
    code: "ER",
    name: "Eritrea",
    currency: "ERN",
  },
  {
    code: "ES",
    name: "Spain",
    currency: "EUR",
  },
  {
    code: "ET",
    name: "Ethiopia",
    currency: "ETB",
  },
  {
    code: "FI",
    name: "Finland",
    currency: "EUR",
  },
  {
    code: "FJ",
    name: "Fiji",
    currency: "FJD",
  },
  {
    code: "FK",
    name: "Falkland Islands",
    currency: "GBP",
  },
  {
    code: "FM",
    name: "Micronesia",
    currency: "USD",
  },
  {
    code: "FO",
    name: "Faroe Islands",
    currency: "DKK",
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
  },
  {
    code: "GA",
    name: "Gabon",
    currency: "XAF",
  },
  {
    code: "GD",
    name: "Grenada",
    currency: "XCD",
  },
  {
    code: "GE",
    name: "Georgia",
    currency: "GEL",
  },
  {
    code: "GF",
    name: "French Guiana",
    currency: "EUR",
  },
  {
    code: "GG",
    name: "Guernsey",
    currency: "GBP",
  },
  {
    code: "GH",
    name: "Ghana",
    currency: "GHS",
  },
  {
    code: "GI",
    name: "Gibraltar",
    currency: "GIP",
  },
  {
    code: "GL",
    name: "Greenland",
    currency: "DKK",
  },
  {
    code: "GM",
    name: "Gambia",
    currency: "GMD",
  },
  {
    code: "GN",
    name: "Guinea",
    currency: "GNF",
  },
  {
    code: "GP",
    name: "Guadeloupe",
    currency: "EUR",
  },
  {
    code: "GQ",
    name: "Equatorial Guinea",
    currency: "XAF",
  },
  {
    code: "GR",
    name: "Greece",
    currency: "EUR",
  },
  {
    code: "GS",
    name: "South Georgia & South Sandwich Islands",
    currency: "GBP",
  },
  {
    code: "GT",
    name: "Guatemala",
    currency: "GTQ",
  },
  {
    code: "GU",
    name: "Guam",
    currency: "USD",
  },
  {
    code: "GW",
    name: "Guinea-Bissau",
    currency: "GNF",
  },
  {
    code: "GY",
    name: "Guyana",
    currency: "GYD",
  },
  {
    code: "HK",
    name: "Hong Kong",
    currency: "HKD",
  },
  {
    code: "HN",
    name: "Honduras",
    currency: "HNL",
  },
  {
    code: "HR",
    name: "Croatia",
    currency: "EUR",
  },
  {
    code: "HT",
    name: "Haiti",
    currency: "HTG",
  },
  {
    code: "HU",
    name: "Hungary",
    currency: "HUF",
  },
  {
    code: "ID",
    name: "Indonesia",
    currency: "IDR",
  },
  {
    code: "IE",
    name: "Ireland",
    currency: "EUR",
  },
  {
    code: "IL",
    name: "Israel",
    currency: "USD",
  },
  {
    code: "IN",
    name: "India",
    currency: "INR",
  },
  {
    code: "IQ",
    name: "Iraq",
    currency: "IQD",
  },
  {
    code: "IR",
    name: "Iran",
    currency: "IRR",
  },
  {
    code: "IS",
    name: "Iceland",
    currency: "ISK",
  },
  {
    code: "IT",
    name: "Italy",
    currency: "EUR",
  },
  {
    code: "JM",
    name: "Jamaica",
    currency: "JMD",
  },
  {
    code: "JO",
    name: "Jordan",
    currency: "JOD",
  },
  {
    code: "JP",
    name: "Japan",
    currency: "JPY",
  },
  {
    code: "KE",
    name: "Kenya",
    currency: "KES",
  },
  {
    code: "KG",
    name: "Kyrgyzstan",
    currency: "KGS",
  },
  {
    code: "KH",
    name: "Cambodia",
    currency: "KHR",
  },
  {
    code: "KI",
    name: "Kiribati",
    currency: "AUD",
  },
  {
    code: "KM",
    name: "Comoros",
    currency: "KMF",
  },
  {
    code: "KN",
    name: "Saint Kitts and Nevis",
    currency: "XCD",
  },
  {
    code: "KP",
    name: "North Korea",
    currency: "KPW",
  },
  {
    code: "KR",
    name: "South Korea",
    currency: "KRW",
  },
  {
    code: "KW",
    name: "Kuwait",
    currency: "KWD",
  },
  {
    code: "KY",
    name: "Cayman Islands",
    currency: "KYD",
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    currency: "KZT",
  },
  {
    code: "LA",
    name: "Laos",
    currency: "LAK",
  },
  {
    code: "LB",
    name: "Lebanon",
    currency: "LBP",
  },
  {
    code: "LC",
    name: "Saint Lucia",
    currency: "XCD",
  },
  {
    code: "LI",
    name: "Liechtenstein",
    currency: "CHF",
  },
  {
    code: "LK",
    name: "Sri Lanka",
    currency: "LKR",
  },
  {
    code: "LR",
    name: "Liberia",
    currency: "LRD",
  },
  {
    code: "LS",
    name: "Lesotho",
    currency: "LSL",
  },
  {
    code: "LT",
    name: "Lithuania",
    currency: "EUR",
  },
  {
    code: "LU",
    name: "Luxembourg",
    currency: "EUR",
  },
  {
    code: "LV",
    name: "Latvia",
    currency: "EUR",
  },
  {
    code: "LY",
    name: "Libya",
    currency: "LYD",
  },
  {
    code: "MA",
    name: "Morocco",
    currency: "EUR",
  },
  {
    code: "MC",
    name: "Monaco",
    currency: "EUR",
  },
  {
    code: "MD",
    name: "Moldova",
    currency: "MDL",
  },
  {
    code: "ME",
    name: "Montenegro",
    currency: "EUR",
  },
  {
    code: "MG",
    name: "Madagascar",
    currency: "MGA",
  },
  {
    code: "MH",
    name: "Marshall Islands",
    currency: "USD",
  },
  {
    code: "MK",
    name: "North Macedonia",
    currency: "MKD",
  },
  {
    code: "ML",
    name: "Mali",
    currency: "XOF",
  },
  {
    code: "MM",
    name: "Myanmar",
    currency: "MMK",
  },
  {
    code: "MN",
    name: "Mongolia",
    currency: "MNT",
  },
  {
    code: "MO",
    name: "Macau",
    currency: "MOP",
  },
  {
    code: "MP",
    name: "Northern Mariana Islands",
    currency: "USD",
  },
  {
    code: "MQ",
    name: "Martinique",
    currency: "EUR",
  },
  {
    code: "MR",
    name: "Mauritania",
    currency: "MRO",
  },
  {
    code: "MS",
    name: "Montserrat",
    currency: "XCD",
  },
  {
    code: "MT",
    name: "Malta",
    currency: "EUR",
  },
  {
    code: "MU",
    name: "Mauritius",
    currency: "MUR",
  },
  {
    code: "MV",
    name: "Maldives",
    currency: "MVR",
  },
  {
    code: "MW",
    name: "Malawi",
    currency: "MWK",
  },
  {
    code: "MX",
    name: "Mexico",
    currency: "MXN",
  },
  {
    code: "MY",
    name: "Malaysia",
    currency: "MYR",
  },
  {
    code: "MZ",
    name: "Mozambique",
    currency: "MZN",
  },
  {
    code: "NA",
    name: "Namibia",
    currency: "NAD",
  },
  {
    code: "NC",
    name: "New Caledonia",
    currency: "XPF",
  },
  {
    code: "NE",
    name: "Niger",
    currency: "XOF",
  },
  {
    code: "NG",
    name: "Nigeria",
    currency: "NGN",
  },
  {
    code: "NI",
    name: "Nicaragua",
    currency: "NIO",
  },
  {
    code: "NL",
    name: "Netherlands",
    currency: "EUR",
  },
  {
    code: "NO",
    name: "Norway",
    currency: "NOK",
  },
  {
    code: "NP",
    name: "Nepal",
    currency: "NPR",
  },
  {
    code: "NR",
    name: "Nauru",
    currency: "AUD",
  },
  {
    code: "NU",
    name: "Niue",
    currency: "NZD",
  },
  {
    code: "NZ",
    name: "New Zealand",
    currency: "NZD",
  },
  {
    code: "OM",
    name: "Oman",
    currency: "OMR",
  },
  {
    code: "PA",
    name: "Panama",
    currency: "PAB",
  },
  {
    code: "PE",
    name: "Peru",
    currency: "PEN",
  },
  {
    code: "PF",
    name: "French Polynesia",
    currency: "XPF",
  },
  {
    code: "PG",
    name: "Papua New Guinea",
    currency: "PGK",
  },
  {
    code: "PH",
    name: "Philippines",
    currency: "PHP",
  },
  {
    code: "PK",
    name: "Pakistan",
    currency: "PKR",
  },
  {
    code: "PL",
    name: "Poland",
    currency: "PLN",
  },
  {
    code: "PM",
    name: "St. Pierre and Miquelon",
    currency: "EUR",
  },
  {
    code: "PR",
    name: "Puerto Rico",
    currency: "USD",
  },
  {
    code: "PS",
    name: "Palestinian Territories",
    currency: "USD",
  },
  {
    code: "PT",
    name: "Portugal",
    currency: "EUR",
  },
  {
    code: "PW",
    name: "Palau",
    currency: "USD",
  },
  {
    code: "PY",
    name: "Paraguay",
    currency: "PYG",
  },
  {
    code: "QA",
    name: "Qatar",
    currency: "QAR",
  },
  {
    code: "RE",
    name: "Reunion",
    currency: "EUR",
  },
  {
    code: "RO",
    name: "Romania",
    currency: "RON",
  },
  {
    code: "RS",
    name: "Serbia",
    currency: "RSD",
  },
  {
    code: "RU",
    name: "Russia",
    currency: "RUB",
  },
  {
    code: "RW",
    name: "Rwanda",
    currency: "RWF",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    currency: "SAR",
  },
  {
    code: "SB",
    name: "Solomon Islands",
    currency: "SBD",
  },
  {
    code: "SC",
    name: "Seychelles",
    currency: "SCR",
  },
  {
    code: "SD",
    name: "Sudan",
    currency: "SDG",
  },
  {
    code: "SE",
    name: "Sweden",
    currency: "SEK",
  },
  {
    code: "SG",
    name: "Singapore",
    currency: "SGD",
  },
  {
    code: "SH",
    name: "St. Helena",
    currency: "SHP",
  },
  {
    code: "SI",
    name: "Slovenia",
    currency: "EUR",
  },
  {
    code: "SK",
    name: "Slovakia",
    currency: "EUR",
  },
  {
    code: "SL",
    name: "Sierra Leone",
    currency: "SLL",
  },
  {
    code: "SN",
    name: "Senegal",
    currency: "XOF",
  },
  {
    code: "SO",
    name: "Somalia",
    currency: "SOS",
  },
  {
    code: "SR",
    name: "Suriname",
    currency: "SRD",
  },
  {
    code: "SS",
    name: "South Sudan",
    currency: "SDG",
  },
  {
    code: "ST",
    name: "Sao Tome and Principe",
    currency: "STD",
  },
  {
    code: "SV",
    name: "El Salvador",
    currency: "USD",
  },
  {
    code: "SX",
    name: "St Maarten",
    currency: "ANG",
  },
  {
    code: "SY",
    name: "Syria",
    currency: "SYP",
  },
  {
    code: "SZ",
    name: "Eswatini",
    currency: "SZL",
  },
  {
    code: "TC",
    name: "Turks and Caicos Islands",
    currency: "USD",
  },
  {
    code: "TD",
    name: "Chad",
    currency: "XAF",
  },
  {
    code: "TG",
    name: "Togo",
    currency: "XOF",
  },
  {
    code: "TH",
    name: "Thailand",
    currency: "THB",
  },
  {
    code: "TJ",
    name: "Tajikistan",
    currency: "TJS",
  },
  {
    code: "TL",
    name: "East Timor",
    currency: "USD",
  },
  {
    code: "TM",
    name: "Turkmenistan",
    currency: "TMT",
  },
  {
    code: "TN",
    name: "Tunisia",
    currency: "EUR",
  },
  {
    code: "TO",
    name: "Tonga",
    currency: "TOP",
  },
  {
    code: "TR",
    name: "Turkey",
    currency: "TRY",
  },
  {
    code: "TT",
    name: "Trinidad and Tobago",
    currency: "TTD",
  },
  {
    code: "TV",
    name: "Tuvalu",
    currency: "AUD",
  },
  {
    code: "TW",
    name: "Taiwan",
    currency: "TWD",
  },
  {
    code: "TZ",
    name: "Tanzania",
    currency: "TZS",
  },
  {
    code: "UA",
    name: "Ukraine",
    currency: "UAH",
  },
  {
    code: "UG",
    name: "Uganda",
    currency: "UGX",
  },
  {
    code: "UK",
    name: "United Kingdom",
    currency: "GBP",
  },
  {
    code: "US",
    name: "United States",
    currency: "USD",
  },
  {
    code: "UY",
    name: "Uruguay",
    currency: "USD",
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    currency: "UZS",
  },
  {
    code: "VA",
    name: "Vatican City",
    currency: "EUR",
  },
  {
    code: "VC",
    name: "Saint Vincent and the Grenadines",
    currency: "XCD",
  },
  {
    code: "VE",
    name: "Venezuela",
    currency: "USD",
  },
  {
    code: "VG",
    name: "British Virgin Islands",
    currency: "USD",
  },
  {
    code: "VI",
    name: "US Virgin Islands",
    currency: "USD",
  },
  {
    code: "VN",
    name: "Vietnam",
    currency: "VND",
  },
  {
    code: "VU",
    name: "Vanuatu",
    currency: "VUV",
  },
  {
    code: "WF",
    name: "Wallis and Futuna Islands",
    currency: "XPF",
  },
  {
    code: "WS",
    name: "Samoa",
    currency: "WST",
  },
  {
    code: "XK",
    name: "Kosovo",
    currency: "EUR",
  },
  {
    code: "YE",
    name: "Yemen",
    currency: "YER",
  },
  {
    code: "YT",
    name: "Mayotte",
    currency: "EUR",
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
  },
  {
    code: "ZM",
    name: "Zambia",
    currency: "ZMW",
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    currency: "USD",
  },
];

window.onload = function () {
  /* display list of countries and currencies in configuration form when page loads */
  
  const countryInput = document.querySelector("#country-select");
  const currencyInput = document.querySelector("#currency-select");

  countries.forEach(function (country) {
    var a = document.createElement("option");

    //append countries
    countryInput.appendChild(a);
    a.innerHTML = country["name"];
    a.innerHTML += " (" + country["code"] + ")";

    var b = document.createElement("option");

    //append currencies
    currencyInput.appendChild(b);
    b.innerHTML = country["currency"];
  });
};

function getCurrencies() {
  /* Auto select currency in configuration form according to user's selected country */

  // Get user's selected country
  var country = document.querySelector("#country-select").value;
  country = country.slice(-3, -1);

  // Find country's default currency
  var find_country = countries.find(c => c.code === country);
  const currency = find_country.currency;
  
  // Select currency
  const options = document.querySelector("#currency-select").options;
  for (var i = 0; i < options.length; i++) {
    if (options[i].text == currency) {
      options[i].selected = true;
      break;
    }
  }
}

/* -- Check valid inputs on User Registration -- */

function checkEmail(thisObj) {
  if (!thisObj.checkValidity()) {
    thisObj.value = "";
    thisObj.placeholder = "Invalid e-mail";
    thisObj.style.border = "2px solid red";
    thisObj.style.setProperty("--c", "red");
    thisObj.classList.add("error");
  } else {
    thisObj.style.border = "1px solid var(--fifth_color)";
  }
}

function checkPassword(thisObj, submit = None) {
  document.getElementById(submit).disabled = true;

  if (!thisObj.checkValidity()) {
    thisObj.value = "";
    thisObj.placeholder = "Invalid password";
    thisObj.style.border = "2px solid red";
    thisObj.style.setProperty("--c", "red");
    thisObj.classList.add("error");
  } else {
    thisObj.style.border = "1px solid var(--fifth_color)";
  }
}

function checkPasswordConf(thisObj, input, submit = None) {
  var password = document.getElementById(input);
  if (thisObj.value != password.value) {
    thisObj.value = "";
    thisObj.placeholder = "Passwords do not match";
    thisObj.style.border = "2px solid red";
    thisObj.style.setProperty("--c", "red");
    thisObj.classList.add("error");
  } else {
    thisObj.style.border = "1px solid var(--fifth_color)";
    document.getElementById(submit).disabled = false;
  }
}

function passwordVisible(thisObj, input) {
  const inputPassword = document.getElementById(input);

  if (thisObj.classList.contains("bi-eye")) {
    inputPassword.type = "text";
    thisObj.classList.replace("bi-eye", "bi-eye-slash");
  } else {
    inputPassword.type = "password";
    thisObj.classList.replace("bi-eye-slash", "bi-eye");
  }
}

/* -- Check INVALID inputs on User Registration -- */

function checkMessage() {
  var regLink = document.querySelector("#register");
  var logLink = document.querySelector("#login");

  // Check if the message variable has the value 'Error'
  if (message == "Registration Error") {
    // Follow the link: open registration form
    regLink.click();
  } else if (message == "Log in Error") {
    // Follow the link: open log in form
    logLink.click();
  } else if (message == "Forgot password Error") {
    // Open forgot password form
    openForm("forgotForm");
  } else if (message == "Valid token") {
    // Open reset form
    openForm("resetForm");
  } else if (message == "Token Error") {
    // Open forgot password form
    openForm("forgotForm");
  } else if (message == "Valid password reset") {
    alert("Password reset successfully!");
  } else if (message == "Password changed") {
    alert("Password changed successfully!");
  } else if (message == "Link sent") {
    alert("Verification link sent. Please check your email.");
  } else if (message == "Delete account") {
    alert("Account deleted successfully!");
  } else if (message == "Changes ok") {
    alert("Changes saved successfully!");
  } else if (message == "No API Result") {
    alert("No API response for specified search parameters");
  }}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkMessage);
} else {
  checkMessage();
}

/* -- Redirect user to another form -- */
function redirectForm(form) {
  closeForm("loginForm");
  setTimeout(openForm, 400, form);
}

/* -- Set loading spinner while sending reset password link -- */
function loading(thisObj) {
  if (document.querySelector("#forgot-email").value) {
    thisObj.style.display = "none";
    document.querySelector("#forgot-spinner").style.display = "inline-block";
  }
}

/* -- Open/Close confirmation form to delete account -- */
function openDelete(thisObj) {
  thisObj.style.display = "None";
  document.querySelector("#security-submit").style.display = "None";
  document.querySelector("#security-close").style.display = "None";
  document.querySelector("#deleteForm").style.display = "block";
}

function cancelDelete() {
  document.querySelector("#security-submit").style.display = "inline-block";
  document.querySelector("#security-close").style.display = "inline-block";
  document.querySelector("#deleteForm").style.display = "None";
  document.querySelector("#deleteAccount").style.display = "block";
}
