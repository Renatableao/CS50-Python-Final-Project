/*-- Show/Hide inputs from search-form -- */
function toggleInputs(thisObj) {
  const elements = document.querySelectorAll(".off");

  elements.forEach((element) => {
    element.style.display = element.style.display === "none" ? "block" : "none";
  });

  thisObj.style.transform =
    elements[0].style.display === "none" ? "rotate(0deg)" : "rotate(45deg)";
}

function searching(thisObj) {
  const airportsFrom = document.querySelector("#airports-from-results").value;
  const airportsTo = document.querySelector("#airports-to-results").value;
  const departing = document.querySelector("#departing-results").value;
  const returning = document.querySelector("#returning-results").value;
  const roundtrip = document.querySelector("#roundtrip-results").checked;
  const oneWay = document.querySelector("#one-way-results").checked;

  if (
    airportsFrom &&
    airportsTo &&
    departing &&
    (oneWay || (roundtrip && returning))
  ) {
    thisObj.style.display = "none";
    document.querySelector("#spinner").style.display = "block";
  }
}

/* -- Enable/Disable returning date according to input choice and update its value -- */
document.addEventListener("DOMContentLoaded", function () {
  // Disable "returning-results" if "one-way-results" is checked when the page loads
  if (document.getElementById("one-way-results").checked) {
    document.getElementById("returning-results").disabled = true;
  }

  // Add onchange event listeners to the checkboxes
  document.getElementById("one-way-results").onchange = function () {
    document.getElementById("returning-results").disabled = this.checked;
  };

  document.getElementById("roundtrip-results").onchange = function () {
    document.getElementById("returning-results").disabled = !this.checked;
  };
});

function updateDateResults(thisObj) {
  document.querySelector("#returning-results").min = thisObj.value;
}

/* -- Upload airports data -- */
// List from airports.json
async function fetchAirportsData() {
  const response = await fetch("/static/airports.json");
  const data = await response.json();
  return data;
}

(async function () {
  try {
    window.airports = await fetchAirportsData();
    //initiate the autocomplete function on the "airports" element, and pass along the array as possible autocomplete values:
    autocompleteResults(
      document.querySelector("#airports-from-results"),
      airports
    );
    autocompleteResults(
      document.querySelector("#airports-to-results"),
      airports
    );
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

/*-- Display heart icon when user saves flight result -- */
function saveAsFavorite(thisObj) {
  thisObj.classList.add("visually-hidden");
  thisObj.addEventListener("transitionend", function hideForm() {
    thisObj.classList.add("hidden");
    thisObj.removeEventListener("transitionend", hideForm);
  });

  thisObj.nextElementSibling.classList.remove("hidden");
  setTimeout(
    () => thisObj.nextElementSibling.classList.remove("visually-hidden"),
    20
  );
}

/* -- Set searching spinner while getting API request -- */
document.addEventListener("DOMContentLoaded", function () {
  
    // by: https://codepen.io/nietoperq/pen/LYBgdwr
    const loadText = document.querySelector(".loading-text");

    let load = 0;

    let interval = setInterval(blurring, 250);

    function blurring() {
      load++;
      if (load > 99) {
        clearInterval(interval);
      }
      loadText.innerText = `${load}%`;
      loadText.style.opacity = 1 - load / 100;
      loadText.style.filter = `blur(${30 - (load * 30) / 100}px)`;
    }
})

/*-- Create img elements -- */
function loadImages() {

  try {
    fetch('./static/pictures.json')
      .then(response => response.json())
      .then(data => {
        
        const imgDiv = document.getElementById('move');

        // Iterate over each key-value pair in the JSON data
        for (const [key, value] of Object.entries(data)) {
        // Create a figure element
        const figure = document.createElement('figure');
      
        // Create an image element
        const img = document.createElement('img');
        img.src = key;
        img.alt = value;

        // Append the image to the figure element
        figure.appendChild(img);

        // Append the figure to the slider container
        imgDiv.appendChild(figure);
        }
      })
  }
  catch (error) {
    console.error(error);
}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadImages);
} else {
  loadImages();
}