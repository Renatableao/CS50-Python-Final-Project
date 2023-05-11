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

  /*-- Open price List from different agents for each flight result -- */ 
async function openPriceList(thisObj) {

    const form = document.querySelector('#price-list-window');
    const formContent = document.querySelector('#price-list');
    const currency_code = thisObj.dataset.currency
    const agents = JSON.parse(thisObj.dataset.agents);
    const agentsInfo = JSON.parse(thisObj.dataset.agentsinfo);
      
    // Load the currencies.json file
    const currencies = await fetch('./static/currencies.json')
      .then(response => response.json())
      .catch(error => console.error(error));
  
    for (let i = 0; i < 10 && i < agentsInfo.length; i++) {
        
        const option = agentsInfo[i];
        const price = formatPrice(option[0], currency_code, currencies)
        const agent = agents[option[1]];
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
            <a target="_blank" href="${option[2]}" class="btn-select"> <img src="/static/icons8-advance-30.png"/></a>
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

    price = parseInt(price) / 1000;
    // Find the currency object that matches the code
    const currency = currencies.find(c => c.code === currency_code);
    if (!currency) {
      return price;
    }

    const decimal_places = currency.decimalDigits;
    let price_str = decimal_places > 0 ? parseFloat(price).toFixed(decimal_places) : parseInt(price);
    let symbol = currency.symbol;
    let formatted_price;
    if (currency.symbolOnLeft) {
      formatted_price = `${symbol}${price_str}`
      if (currency.spaceBetweenAmountAndSymbol) {
        formatted_price = `${symbol} ${price_str}`
      }
    }
    else {
      formatted_price = `${price_str}${symbol}`;
      if (currency.spaceBetweenAmountAndSymbol) {
        formatted_price = `${price_str} ${symbol}`;
      }
    }
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
