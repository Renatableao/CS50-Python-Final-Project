/* -- Open configuration form -- */
function openForm(form) {
  /* display configuration form by clicking the planet icon */
  popup = document.getElementById(form);
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.remove("visually-hidden"), 20);
  document.querySelector("#overlay").style.display = "block";
  document.querySelector("#overlay2").style.display = "block";
}

/* Close configuration form*/
function closeForm(form) {
  const popup = document.getElementById(form);
  popup.classList.add("visually-hidden");
  popup.addEventListener("transitionend", function hideForm() {
    popup.classList.add("hidden");
    popup.removeEventListener("transitionend", hideForm);
  });
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
    cookies = {},
    i,
    C;

  for (i = c.length - 1; i >= 0; i--) {
    C = c[i].split("=");
    cookies[C[0]] = C[1];
  }

  return cookies[name];
}

// Save chosen language as input
function selectLanguage() {
  var clicked_name = readCookie("googtrans");
  document.querySelector("#input_language").value = clicked_name;
}

/* -- Upload countries and currency data -- */
// List from  market.json
async function fetchMarketData() {
  const response = await fetch("/static/markets.json");
  const data = await response.json();
  return data;
}

(async function () {
  try {
    window.countries = await fetchMarketData();

    /* display list of countries and currencies in configuration form when page loads */

    const countryInput = document.querySelector("#country-select");
    const currencyInput = document.querySelector("#currency-select");

    countries.forEach(function (country) {
      var a = document.createElement("option");

      // Add conditional logic for selected option
      if (market == country["code"]) {
        a.setAttribute("selected", true);
      }

      // Append countries
      a.innerHTML = country["name"] + " (" + country["code"] + ")";
      countryInput.appendChild(a);

      var b = document.createElement("option");

      //append currencies
      b.innerHTML = country["currency"];
      if (currency == country["currency"]) {
        b.setAttribute("selected", true);
      }
      currencyInput.appendChild(b);
    });
  } catch (error) {
    console.error(error);
  }
})();

function getCurrencies() {
  /* Auto select currency in configuration form according to user's selected country */

  // Get user's selected country
  var country = document.querySelector("#country-select").value;
  country = country.slice(-3, -1);

  // Find country's default currency
  var find_country = countries.find((c) => c.code === country);
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
    thisObj.style.border = "1px solid var(--transp_grey)";
  }
}

function checkPassword(thisObj) {
  if (!thisObj.checkValidity()) {
    thisObj.value = "";
    thisObj.placeholder = "Invalid password";
    thisObj.style.border = "2px solid red";
    thisObj.style.setProperty("--c", "red");
    thisObj.classList.add("error");
  } else {
    thisObj.style.border = "1px solid var(--transp_grey)";
  }
}

function checkPasswordConf(thisObj, input, submit) {
  var password = document.getElementById(input);
  if (thisObj.value != password.value) {
    thisObj.value = "";
    thisObj.placeholder = "Passwords do not match";
    thisObj.style.border = "2px solid red";
    thisObj.style.setProperty("--c", "red");
    thisObj.classList.add("error");
  } else {
    thisObj.style.border = "1px solid var(--transp_grey)";
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
    openForm("forgot-form");
  } else if (message == "Valid token") {
    // Open reset form
    openForm("reset-form");
  } else if (message == "Token Error") {
    // Open forgot password form
    openForm("forgot-form");
  } else if (message == "Valid password reset") {
    alert("Password reset successfully!");
  } else if (message == "Password changed") {
    alert("Password changed successfully!");
  } else if (message == "Link sent") {
    alert("Please check your phone. This might take a few minutes. If you do not receive a link, please try again later.");
  } else if (message == "Delete account") {
    alert("Account deleted successfully!");
  } else if (message == "Changes ok") {
    alert("Changes saved successfully!");
  } else if (message == "No API Response") {
    alert("Sorry, we found no results on these parameters.");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkMessage);
} else {
  checkMessage();
}

/* -- Redirect user to another form -- */
function redirectForm(form) {
  closeForm("login-form");
  setTimeout(openForm, 400, form);
}

/* -- Set loading spinner -- */
function loading(form, thisObj, spinner) {
  console.log("YESSSSSSS")
  var requiredFields = document.querySelectorAll(form + ' input[required]');

  for (var i = 0; i < requiredFields.length; i++) {
    if (!requiredFields[i].value) {
      return false
    }
  }
  thisObj.style.display = "none";
  document.getElementById(spinner).style.display = "inline-block";
}

/* -- Set loading spinner on log out -- */
function loggingOut(thisObj) {
  thisObj.style.display = "none";
  document.querySelector("#logout-spinner").style.display = "flex";
}

/* -- Open/Close confirmation form to delete account -- */
function openDelete(thisObj) {
  thisObj.style.display = "None";
  document.querySelector("#security-submit").style.display = "None";
  document.querySelector("#security-close").style.display = "None";
  document.querySelector("#delete-form").style.display = "block";
}

function cancelDelete() {
  document.querySelector("#security-submit").style.display = "inline-block";
  document.querySelector("#security-close").style.display = "inline-block";
  document.querySelector("#delete-form").style.display = "None";
  document.querySelector("#delete-account").style.display = "block";
}

/* -- Set up and validate phone input -- */
function getIp(callback) {
  fetch('https://ipinfo.io/json?token=672212dc6d0aaf', { headers: { 'Accept': 'application/json' }})
  .then((resp) => resp.json())
  .catch(() => {
      return {
      country: 'us',
  };
  })
  .then((resp) => callback(resp.country));
}
const phoneInputField = document.querySelector("#user-phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  initialCountry: "auto",
  geoIpLookup: getIp,
  preferredCountries: ["us", "br"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function process(event) {
    event.preventDefault();

    const userInput = document.querySelector('#user-phone')
    const phoneNumber = phoneInput.getNumber();

    if (!phoneInput.isValidNumber()) {
      userInput.classList.add("error")
      userInput.value = "";
      userInput.placeholder = "Invalid number";
      userInput.style.border = "2px solid red";
      userInput.style.setProperty("--c", "red");
      userInput.classList.add("error");
    } else {
      userInput.style.border = "1px solid var(--transp_grey)";
      userInput.value = phoneNumber;
}
}
