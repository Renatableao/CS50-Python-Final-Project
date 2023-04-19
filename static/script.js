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

async function fetchMarketData() {
  const response = await fetch('/static/markets.json');
  const data = await response.json();
  return data;
}

(async function() {
  try {
    window.countries = await fetchMarketData();
    
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
  } else if (message == "No API Response") {
    alert("No API response");
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
