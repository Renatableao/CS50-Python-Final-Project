/* -- Display dots according to flight stops --*/
function displayStops() {
    const parents = document.querySelectorAll('.route-dot');

    parents.forEach(parent => {
        const children = parent.querySelectorAll('.point');
        
        children.forEach((child, index) => {
            const left = (100/(children.length + 1)) * (index + 1) ;
            child.style.setProperty('left', `${left}%`);
});})}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", displayStops);
  } else {
    displayStops();
  }

/*-- Show/Hide inputs from search-form -- */ 
function toggleInputs(thisObj) {
  
  const elements = document.querySelectorAll(".off")

  elements.forEach(element => {
    element.style.display = element.style.display === "none" ? "block" : "none";
  });

  thisObj.style.transform = elements[0].style.display === "none" ? "rotate(0deg)" : "rotate(45deg)";
}

function searching(thisObj) {
  
  const airportsFrom = document.querySelector("#airports-from-results").value;
  const airportsTo = document.querySelector("#airports-to-results").value;
  const departing = document.querySelector("#departing-results").value;
  const returning = document.querySelector("#returning-results").value;
  const roundtrip = document.querySelector("#roundtrip-results").checked;
  const oneWay = document.querySelector("#one-way-results").checked;

  if (airportsFrom && airportsTo && departing && (oneWay || (roundtrip && returning))) {
    thisObj.style.display = "none";
    document.querySelector("#spinner").style.display = "block"
}
}

/* -- Enable/Disable returning date according to input choice and update its value -- */
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('one-way-results').onchange = function() {
  document.getElementById('returning-results').disabled = this.checked;
};

document.getElementById('roundtrip-results').onchange = function() {
  document.getElementById('returning-results').disabled = !this.checked;
};
});

function updateDateResults(thisObj) {
  document.querySelector("#returning-results").min = thisObj.value;
}

/* -- Upload airports data -- */
// List from airports.json
async function fetchAirportsData() {
  const response = await fetch('/static/airports.json');
  const data = await response.json();
  return data;
}

(async function() {
  try {
    window.airports = await fetchAirportsData();
    //initiate the autocomplete function on the "airports" element, and pass along the array as possible autocomplete values:
    autocompleteResults(document.querySelector("#airports-from-results"), airports);
    autocompleteResults(document.querySelector("#airports-to-results"), airports);
      
  } catch (error) {
    console.error(error);
  }
})();

/* -- Autocomplete airports name -- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete -- */
function autocompleteResults(inp, arr) {
  /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  // execute a function when someone writes in the text field:
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;

    //close any already open lists of autocompleted values
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    // create a DIV element that will contain the items (values):
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");

    //append the DIV element as a child of the autocomplete container:
    this.parentNode.appendChild(a);
    //for each item in the array...
    for (i = 0; i < arr.length; i++) {
      //check if the item starts with the same letters as the text field value:
      if (arr[i].toUpperCase().includes(val.toUpperCase())) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "✈ ";
        b.innerHTML += "<strong>" + arr[i].substr(0, 5) + "<strong>";
        b.innerHTML += arr[i].substr(5);

        //insert a input field that will hold the current array item's value:
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        //execute a function when someone clicks on the item value (DIV element):
        b.addEventListener("click", function (e) {
          //insert the value for the autocomplete text field:
          str = this.getElementsByTagName("input")[0].value;
          //capture iata and city
          inp.value = str.match(/([\(\)A-Z]+).+,\s(.+)\s-/)[1];
          inp.value += " " + str.match(/([\(\)A-Z]+).+,\s(.+)\s-/)[2];

          //close the list of autocompleted values, (or any other open lists of autocompleted values:
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      // If the arrow DOWN key is pressed, increase the currentFocus variable:
      currentFocus++;
      // and and make the current item more visible:
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      //If the arrow UP key is pressed, decrease the currentFocus variable:
      currentFocus--;
      // and and make the current item more visible:
      addActive(x);
    } else if (e.keyCode == 13) {
      //If the ENTER key is pressed, prevent the form from being submitted,
      e.preventDefault();
      if (currentFocus > -1) {
        // and simulate a click on the "active" item:
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    //start by removing the "active" class on all items:
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    //add class "autocomplete-active":
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  // execute a function when someone clicks in the document:
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}


/*-- Open price List from different agents for each flight result -- */ 
async function openPriceList(thisObj) {

  const form = document.querySelector('#price-list-window');
  const formContent = document.querySelector('#price-list');
  const currency_code = thisObj.dataset.currency
  const results = JSON.parse(thisObj.dataset.results);
  const itinerary = JSON.parse(thisObj.dataset.itinerary);
  const options = itinerary['pricingOptions']

  // Load the currencies.json file
  const currencies = await fetch('./static/currencies.json')
    .then(response => response.json())
    .catch(error => console.error(error));

  for (const option of options) {
    
    const price = formatPrice(option.price.amount, currency_code, currencies)
    const agent = results.agents[option.items[0].agentId];
    var optionInfo = `
        <div></div>
        <div class="agent">
          <p>${agent.name}</p>
        </div>
        <div></div>
        <div class="agent-price">
          <span>${price}</span>
        </div>
        <div>
         <a target="_blank" href="${option.items[0].deepLink}" class="btn-select"> <img src="/static/icons8-advance-30.png"/></a>
        </div>
        <div>
        </div>
    `;
    
    const agentRow = document.createElement("DIV");
    agentRow.setAttribute("id", "agent-row");
    agentRow.innerHTML = optionInfo;
    formContent.appendChild(agentRow)
  }
    
  form.classList.remove("hidden");
  setTimeout(() => form.classList.remove("visually-hidden"), 20);
  document.querySelector("#overlay").style.display = "block";
  document.querySelector("#overlay2").style.display = "block";
  
}

/*-- Format price according to user selected currency -- */ 
function formatPrice(price, currency_code, currencies) {

    // Find the currency object that matches the code
    const currency = currencies.find(c => c.code === currency_code);
    if (!currency) {
      return price;
    }

    const decimal_places = currency.decimalDigits;
    let price_str = decimal_places > 0 ? parseFloat(price).toFixed(decimal_places) : parseInt(price);
    let symbol = currency.symbol;
    let formatted_price = currency.symbolOnLeft ? `${symbol}${price_str}` : `${price_str}${symbol}`;
    formatted_price = currency.spaceBetweenAmountAndSymbol ? formatted_price.replace(symbol, `${symbol} `) : formatted_price;
    formatted_price = formatted_price.replace('.', currency.decimalSeparator);
    if (currency.thousandsSeparator !== " ") {
      formatted_price = formatted_price.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator);
    }
      return formatted_price;
    
}

/*-- Close price List -- */ 
function closePriceList() {

    const form = document.querySelector('#price-list-window');
    const formContent = document.querySelector('#price-list');

    formContent.innerHTML = ""
    form.classList.add("visually-hidden");
    form.addEventListener("transitionend", function hideForm() {
        form.classList.add("hidden");
        form.removeEventListener("transitionend", hideForm);
    });
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#overlay2").style.display = "none";
}