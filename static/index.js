/* -- Enable/Disable returning date according to input choice and update its value -- */
document.getElementById('one-way').onchange = function() {
  document.getElementById('returning').disabled = this.checked;
};

document.getElementById('roundtrip').onchange = function() {
  document.getElementById('returning').disabled = !this.checked;
};

function updateDate(thisObj) {
  document.querySelector("#returning").min = thisObj.value;
}

/* -- Autocomplete airports name -- https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_autocomplete -- */
function autocomplete(inp, arr) {
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

// An array containing airports names and codes:
const airports = [
  "(PEK) Beijing Capital International Airport, Beijing - China",
  "(DXB) Dubai International Airport, Dubai - United Arab Emirates",
  "(LAX) Los Angeles International Airport, Los Angeles - United States",
  "(ORD) O'Hare International Airport, Chicago - United States",
  "(LHR) Heathrow Airport, London - United Kingdom",
  "(HND) Haneda Airport, Tokyo - Japan",
  "(HKG) Hong Kong International Airport, Hong Kong - Hong Kong",
  "(PVG) Shanghai Pudong International Airport, Shanghai - China",
  "(CDG) Charles de Gaulle International Airport, Paris - France",
  "(AMS) Amsterdam Airport Schiphol, Amsterdam - Netherlands",
  "(DFW) Dallas-Fort Worth International Airport, Dallas - United States",
  "(CAN) Guangzhou Baiyun International Airport, Guangzhou - China",
  "(FRA) Frankfurt am Main International Airport, Frankfurt - Germany",
  "(IST) Istanbul Atatürk Airport, Istanbul - Turkey",
  "(DEL) Indira Gandhi International Airport, Delhi - India",
  "(CGK) Soekarno-Hatta International Airport, Jakarta - Indonesia",
  "(SIN) Singapore Changi Airport, Singapore - Singapore",
  "(ICN) Incheon International Airport, Seoul - South Korea",
  "(DEN) Denver International Airport, Denver - United States",
  "(BKK) Suvarnabhumi Airport, Bangkok - Thailand",
  "(JFK) John F. Kennedy International Airport, New York - United States",
  "(KUL) Kuala Lumpur International Airport, Kuala Lumpur - Malaysia",
  "(SFO) San Francisco International Airport, San Francisco - United States",
  "(MAD) Adolfo Suárez Madrid–Barajas Airport, Madrid - Spain",
  "(CTU) Chengdu Shuangliu International Airport, Chengdu - China",
  "(LAS) McCarran International Airport, Las Vegas - United States",
  "(BCN) Barcelona–El Prat Airport, Barcelona - Spain",
  "(BOM) Chhatrapati Shivaji International Airport, Mumbai - India",
  "(YYZ) Toronto Pearson International Airport, Toronto - Canada",
  "(SEA) Seattle–Tacoma International Airport, Seattle - United States",
  "(CLT) Charlotte Douglas International Airport, Charlotte - United States",
  "(LGW) Gatwick Airport, London - United Kingdom",
  "(SZX) Shenzhen Bao'an International Airport, Shenzhen - China",
  "(TPE) Taiwan Taoyuan International Airport, Taipei - Taiwan",
  "(MEX) Mexico City International Airport, Mexico City - Mexico",
  "(KMG) Kunming Changshui International Airport, Kunming - China",
  "(MUC) Munich Airport, Munich - Germany",
  "(MCO) Orlando International Airport, Orlando - United States",
  "(MIA) Miami International Airport, Miami - United States",
  "(PHX) Phoenix Sky Harbor International Airport, Phoenix - United States",
  "(SYD) Sydney Airport, Sydney - Australia",
  "(EWR) Newark Liberty International Airport, Newark - United States",
  "(MNL) Ninoy Aquino International Airport, Manila - Philippines",
  "(SHA) Shanghai Hongqiao International Airport, Shanghai - China",
  "(XIY) Xi'an Xianyang International Airport, Xi'an - China",
  "(FCO) Leonardo da Vinci-Fiumicino Airport, Rome - Italy",
  "(IAH) George Bush Intercontinental Houston Airport, Houston - United States",
  "(NRT) Narita International Airport, Tokyo - Japan",
  "(SVO) Sheremetyevo International Airport, Moscow - Russia",
  "(CKG) Chongqing Jiangbei International Airport, Chongqing - China",
  "(DMK) Don Mueang International Airport, Bangkok - Thailand",
  "(MSP) St Paul International Airport, Minneapolis - United States",
  "(GRU) São Paulo-Guarulhos International Airport, Sao Paulo - Brazil",
  "(BOS) Logan International Airport, Boston - United States",
  "(SGN) Tan Son Nhat International Airport, Ho Chi Minh City - Vietnam",
  "(DOH) Hamad International Airport, Doha - Qatar",
  "(HGH) Hangzhou Xiaoshan International Airport, Hangzhou - China",
  "(DTW) Detroit Metropolitan Wayne County Airport, Detroit - United States",
  "(JED) King Abdulaziz International Airport, Jeddah - Saudi Arabia",
  "(MEL) Melbourne Airport, Melbourne - Australia",
  "(FLL) Fort Lauderdale Hollywood International Airport, Fort Lauderdale - United States",
  "(ORL) Orlando Executive Airport, Orlando - United States",
  "(SAW) Sabiha Gökçen International Airport, Istanbul - Turkey",
  "(BOG) El Dorado International Airport, Bogota - Colombia",
  "(DME) Moscow Domodedovo Airport, Moscow - Russia",
  "(CJU) Jeju International Airport, Cheju - South Korea",
  "(LGA) LaGuardia Airport, New York - United States",
  "(PHL) Philadelphia International Airport, Philadelphia - United States",
  "(DUB) Dublin Airport, Dublin - Ireland",
  "(ZRH) Zürich Airport, Zurich - Switzerland",
  "(CPH) Copenhagen Airport, Copenhagen - Denmark",
  "(KIX) Kansai International Airport, Osaka - Japan",
  "(PMI) Palma De Mallorca Airport, Palma de Mallorca - Spain",
  "(MAN) Manchester Airport, Manchester - United Kingdom",
  "(OSL) Oslo Airport, Gardermoen, Oslo - Norway",
  "(LIS) Lisbon Portela Airport, Lisbon - Portugal",
  "(ARN) Stockholm Arlanda Airport, Stockholm - Sweden",
  "(BWI) Washington International Thurgood Marshall Airport, Baltimore - United States",
  "(AYT) Antalya Airport, Antalya - Turkey",
  "(STN) London Stansted Airport, London - United Kingdom",
  "(NKG) Nanjing Lukou International Airport, Nanjing - China",
  "(GMP) Gimpo International Airport, Seoul - South Korea",
  "(BLR) Kempegowda International Airport, Bangalore - India",
  "(RUH) King Khaled International Airport, Riyadh - Saudi Arabia",
  "(BRU) Brussels Airport, Brussels - Belgium",
  "(DUS) Düsseldorf International Airport, Duesseldorf - Germany",
  "(XMN) Xiamen Gaoqi International Airport, Xiamen - China",
  "(VIE) Vienna International Airport, Vienna - Austria",
  "(CGO) Zhengzhou Xinzheng International Airport, Zhengzhou - China",
  "(SLC) Salt Lake City International Airport, Salt Lake City - United States",
  "(YVR) Vancouver International Airport, Vancouver - Canada",
  "(DCA) Ronald Reagan Washington National Airport, Washington - United States",
  "(CSX) Changsha Huanghua International Airport, Changcha - China",
  "(AUH) Abu Dhabi International Airport, Abu Dhabi - United Arab Emirates",
  "(CUN) Cancún International Airport, Cancun - Mexico",
  "(FUK) Fukuoka Airport, Fukuoka - Japan",
  "(TAO) Liuting Airport, Qingdao - China",
  "(BNE) Brisbane International Airport, Brisbane - Australia",
  "(WUH) Wuhan Tianhe International Airport, Wuhan - China",
  "(HAN) Noi Bai International Airport, Hanoi - Vietnam",
  "(CTS) New Chitose Airport, Sapporo - Japan",
  "(IAD) Washington Dulles International Airport, Washington - United States",
  "(DPS) Ngurah Rai International Airport, Denpasar - Indonesia",
  "(HAK) Haikou Meilan International Airport, Haikou - China",
  "(MDW) Midway International Airport, Chicago - United States",
  "(SCL) Comodoro Arturo Merino Benítez International Airport, Santiago - Chile",
  "(SAN) San Diego International Airport, San Diego - United States",
  "(MXP) Milan-Malpensa Airport, Milano - Italy",
  "(LIM) Jorge Chávez International Airport, Lima - Peru",
  "(SUB) Juanda International Airport, Surabaya - Indonesia",
  "(CGH) São Paulo-Congonhas Airport, Sao Paulo - Brazil",
  "(ATH) Athens International Airport, Athens - Greece",
  "(URC) Ürümqi Diwopu International Airport, Urumqi - China",
  "(JNB) O. R. Tambo International Airport, Johannesburg - South Africa",
  "(SYX) Sanya Phoenix International Airport, Sanya - China",
  "(TLV) Ben Gurion International Airport, Tel-aviv - Israel",
  "(TSN) Tianjin Binhai International Airport, Tianjin - China",
  "(OKA) Naha Airport, Okinawa - Japan",
  "(TXL) Berlin-Tegel International Airport, Berlin - Germany",
  "(CCU) Netaji Subhash Chandra Bose International Airport, Kolkata - India",
  "(HNL) Daniel K. Inouye International Airport, Honolulu - United States",
  "(TPA) Tampa International Airport, Tampa - United States",
  "(MAA) Chennai International Airport, Madras - India",
  "(PDX) Portland International Airport, Portland - United States",
  "(AKL) Auckland International Airport, Auckland - New Zealand",
  "(HEL) Helsinki Airport, Helsinki - Finland",
  "(HRB) Taiping Airport, Harbin - China",
  "(AGP) Málaga Airport, Malaga - Spain",
  "(YUL) Montréal-Pierre Elliott Trudeau International Airport, Montreal - Canada",
  "(VKO) Vnukovo International Airport, Moscow - Russia",
  "(KWE) Longdongbao Airport, Guiyang - China",
  "(HAM) Hamburg Airport, Hamburg - Germany",
  "(DLC) Zhoushuizi Airport, Dalian - China",
  "(THR) Mehrabad International Airport, Teheran - Iran",
  "(GVA) Geneva Airport, Geneva - Switzerland",
  "(SHE) Taoxian Airport, Shenyang - China",
  "(HYD) Rajiv Gandhi International Airport, Hyderabad - India",
  "(BSB) Presidente Juscelino Kubistschek International Airport, Brasilia - Brazil",
  "(HKT) Phuket International Airport, Phuket - Thailand",
  "(PUS) Gimhae International Airport, Busan - South Korea",
  "(YYC) Calgary International Airport, Calgary - Canada",
  "(GIG) Rio de Janeiro-Galeão International Airport, Rio De Janeiro - Brazil",
  "(LED) Pulkovo Airport, St. Petersburg - Russia",
  "(ESB) Esenboğa International Airport, Ankara - Turkey",
  "(LTN) Luton Airport, London - United Kingdom",
  "(WAW) Warsaw Chopin Airport, Warsaw - Poland",
  "(PTY) Tocumen International Airport, Panama City - Panama",
  "(DAL) Dallas Love Field, Dallas - United States",
  "(PRG) Vaclav Havel Airport Prague, Prague - Czech Republic",
  "(STL) Lambert St Louis International Airport, St. Louis - United States",
  "(ITM) Osaka International Airport, Osaka - Japan",
  "(TNA) Yaoqiang Airport, Jinan - China",
  "(BNA) Nashville International Airport, Nashville - United States",
  "(NNG) Nanning Wuxu Airport, Nanning - China",
  "(AUS) Austin Bergstrom International Airport, Austin - United States",
  "(AEP) Aeroparque Jorge Newbery, Buenos Aires - Argentina",
  "(PER) Perth International Airport, Perth - Australia",
  "(ALC) Alicante International Airport, Alicante - Spain",
  "(HOU) William P Hobby Airport, Houston - United States",
  "(EDI) Edinburgh Airport, Edinburgh - United Kingdom",
  "(NCE) Nice-Côte d'Azur Airport, Nice - France",
  "(BUD) Budapest Ferenc Liszt International Airport, Budapest - Hungary",
  "(LPA) Gran Canaria Airport, Gran Canaria - Spain",
  "(OAK) Metropolitan Oakland International Airport, Oakland - United States",
  "(BHX) Birmingham Airport, Birmingham - United Kingdom",
  "(TYN) Taiyuan Wusu Airport, Taiyuan - China",
  "(SXF) Berlin-Schönefeld International Airport, Berlin - Germany",
  "(ADB) Adnan Menderes International Airport, Izmir - Turkey",
  "(LHW) Lanzhou Zhongchuan Airport, Lanzhou - China",
  "(GDL) Guadalajara International Airport, Guadalajara - Mexico",
  "(OTP) Henri Coandă International Airport, Bucharest - Romania",
  "(SJC) Norman Y. Mineta San Jose International Airport, San Jose - United States",
  "(FOC) Fuzhou Changle International Airport, Fuzhou - China",
  "(CGN) Cologne Bonn Airport, Cologne - Germany",
  "(BGY) Orio al Serio International Airport, Bergamo - Italy",
  "(KNO) Kualanamu International Airport, Medan - Indonesia",
  "(MSY) Louis Armstrong New Orleans International Airport, New Orleans - United States",
  "(CGQ) Longjia Airport, Changchun - China",
  "(UPG) Hasanuddin International Airport, Ujung Pandang - Indonesia",
  "(RDU) Raleigh-Durham International Airport, Raleigh - United States",
  "(MCI) Kansas City International Airport, Kansas City - United States",
  "(SHJ) Sharjah International Airport, Sharjah - United Arab Emirates",
  "(TFS) Tenerife South Airport, Tenerife - Spain",
  "(KHN) Nanchang Changbei International Airport, Nanchang - China",
  "(CAI) Cairo International Airport, Cairo - Egypt",
  "(HET) Baita International Airport, Hohhot - China",
  "(STR) Stuttgart Airport, Stuttgart - Germany",
  "(SMF) Sacramento International Airport, Sacramento - United States",
  "(DAD) Da Nang International Airport, Danang - Vietnam",
  "(OPO) Francisco de Sá Carneiro Airport, Porto - Portugal",
  "(CPT) Cape Town International Airport, Cape Town - South Africa",
  "(KBP) Boryspil International Airport, Kiev - Ukraine",
  "(SJW) Shijiazhuang Daguocun International Airport, Shijiazhuang - China",
  "(MHD) Mashhad International Airport, Mashhad - Iran",
  "(SNA) John Wayne Airport-Orange County Airport, Santa Ana - United States",
  "(VCE) Venice Marco Polo Airport, Venice - Italy",
  "(EZE) Ministro Pistarini International Airport, Buenos Aires - Argentina",
  "(LYS) Lyon Saint-Exupéry Airport, Lyon - France",
  "(COK) Cochin International Airport, Kochi - India",
  "(CNX) Chiang Mai International Airport, Chiang Mai - Thailand",
  "(NGO) Chubu Centrair International Airport, Nagoya - Japan",
  "(CNF) Tancredo Neves International Airport, Belo Horizonte - Brazil",
  "(CEB) Mactan Cebu International Airport, Cebu - Philippines",
  "(GLA) Glasgow Airport, Glasgow - United Kingdom",
  "(MTY) Monterrey International Airport, Monterrey - Mexico",
  "(HFE) Hefei Luogang International Airport, Hefei - China",
  "(LIN) Milano Linate Airport, Milano - Italy",
  "(ZUH) Zhuhai Jinwan Airport, Zhuhai - China",
  "(NGB) Ningbo Lishe International Airport, Ninbo - China",
  "(CMN) Mohammed V International Airport, Casablanca - Morocco",
  "(VCP) Viracopos International Airport, Campinas - Brazil",
  "(WNZ) Wenzhou Yongqiang Airport, Wenzhou - China",
  "(TLS) Toulouse-Blagnac Airport, Toulouse - France",
  "(SDU) Santos Dumont Airport, Rio De Janeiro - Brazil",
  "(CLE) Cleveland Hopkins International Airport, Cleveland - United States",
  "(CTA) Catania-Fontanarossa Airport, Catania - Italy",
  "(SAT) San Antonio International Airport, San Antonio - United States",
  "(MRS) Marseille Provence Airport, Marseille - France",
  "(PIT) Pittsburgh International Airport, Pittsburgh - United States",
  "(ADD) Addis Ababa Bole International Airport, Addis Ababa - Ethiopia",
  "(IKA) Imam Khomeini International Airport, Tehran - Iran",
  "(RSW) Southwest Florida International Airport, Fort Myers - United States",
  "(IND) Indianapolis International Airport, Indianapolis - United States",
  "(FAO) Faro Airport, Faro - Portugal",
  "(JOG) Adi Sutjipto International Airport, Yogyakarta - Indonesia",
  "(INC) Yinchuan Airport, Yinchuan - China",
  "(KEF) Keflavík International Airport, Keflavik - Iceland",
  "(BLQ) Bologna Guglielmo Marconi Airport, Bologna - Italy",
  "(NAP) Naples International Airport, Naples - Italy",
  "(BRS) Bristol Airport, Bristol - United Kingdom",
  "(ADL) Adelaide International Airport, Adelaide - Australia",
  "(POA) Salgado Filho Airport, Porto Alegre - Brazil",
  "(BKI) Kota Kinabalu International Airport, Kota Kinabalu - Malaysia",
  "(HLP) Halim Perdanakusuma International Airport, Jakarta - Indonesia",
  "(IBZ) Ibiza Airport, Ibiza - Spain",
  "(BSL) EuroAirport Basel-Mulhouse-Freiburg Airport, Mulhouse - France",
  "(KWL) Guilin Liangjiang International Airport, Guilin - China",
  "(CVG) Cincinnati Northern Kentucky International Airport, Cincinnati - United States",
  "(PNQ) Pune Airport, Pune - India",
  "(REC) Guararapes - Gilberto Freyre International Airport, Recife - Brazil",
  "(SSA) Deputado Luís Eduardo Magalhães International Airport, Salvador - Brazil",
  "(CRL) Brussels South Charleroi Airport, Charleroi - Belgium",
  "(BPN) Sultan Aji Muhamad Sulaiman Airport, Balikpapan - Indonesia",
  "(ALG) Houari Boumediene Airport, Algier - Algeria",
  "(CMH) Port Columbus International Airport, Columbus - United States",
  "(HER) Heraklion International Airport, Heraklion - Greece",
  "(AMD) Sardar Vallabhbhai Patel International Airport, Ahmedabad - India",
  "(ACE) Lanzarote Airport, Arrecife - Spain",
  "(PEN) Penang International Airport, Penang - Malaysia",
  "(LJG) Lijiang Airport, Lijiang - China",
  "(TIJ) General Abelardo L. Rodríguez International Airport, Tijuana - Mexico",
  "(NBO) Jomo Kenyatta International Airport, Nairobi - Kenya",
  "(GOI) Goa International Airport, Goa - India",
  "(GOT) Göteborg Landvetter Airport, Gothenborg - Sweden",
  "(VLC) Valencia Airport, Valencia - Spain",
  "(CWB) Afonso Pena Airport, Curitiba - Brazil",
  "(WUX) Sunan Shuofang International Airport, Wuxi - China",
  "(CHC) Christchurch International Airport, Christchurch - New Zealand",
  "(YNT) Yantai Laishan Airport, Yantai - China",
  "(SOF) Sofia Airport, Sofia - Bulgaria",
  "(KHH) Kaohsiung International Airport, Kaohsiung - Taiwan",
  "(OOL) Gold Coast Airport, Coolangatta - Australia",
  "(BDL) Bradley International Airport, Windsor Locks - United States",
  "(SKG) Thessaloniki Airport 'Makedonia', Thessaloniki - Greece",
  "(LOS) Murtala Muhammed International Airport, Lagos - Nigeria",
  "(BTH) Hang Nadim International Airport, Batam - Indonesia",
  "(PBI) Palm Beach International Airport, West Palm Beach - United States",
  "(MED) Prince Mohammad Bin Abdulaziz Airport, Madinah - Saudi Arabia",
  "(BOD) Bordeaux-Mérignac Airport, Bordeaux - France",
  "(TSA) Taipei Songshan Airport, Taipei - Taiwan",
  "(JJN) Quanzhou Jinjiang International Airport, Quanzhou - China",
  "(BGO) Bergen Airport, Flesland, Bergen - Norway",
  "(RIX) Riga International Airport, Riga - Latvia",
  "(FUE) Fuerteventura Airport, Fuerteventura - Spain",
  "(WLG) Wellington International Airport, Wellington - New Zealand",
  "(MLA) Malta International Airport, Malta - Malta",
  "(NAY) Beijing Nanyuan Airport, Beijing - China",
  "(FOR) Pinto Martins International Airport, Fortaleza - Brazil",
  "(RGN) Yangon International Airport, Yangon - Burma",
  "(CIA) Ciampino-G. B. Pastine International Airport, Rome - Italy",
  "(HAJ) Hannover Airport, Hannover - Germany",
  "(BFS) Belfast International Airport, Belfast - United Kingdom",
  "(KRK) John Paul II International Airport Kraków-Balice, Krakow - Poland",
  "(PMO) Falcone-Borsellino Airport, Palermo - Italy",
  "(HAV) José Martí International Airport, Havana - Cuba",
  "(AER) Sochi International Airport, Sochi - Russia",
  "(TUN) Tunis Carthage International Airport, Tunis - Tunisia",
  "(PLM) Sultan Mahmud Badaruddin II Airport, Palembang - Indonesia",
  "(EIN) Eindhoven Airport, Eindhoven - Netherlands",
  "(XNN) Xining Caojiabu Airport, Xining - China",
  "(ADA) Adana Airport, Adana - Turkey",
  "(JAX) Jacksonville International Airport, Jacksonville - United States",
  "(DUR) King Shaka International Airport, Durban - South Africa",
  "(NTE) Nantes Atlantique Airport, Nantes - France",
  "(SVX) Koltsovo Airport, Yekaterinburg - Russia",
  "(NCL) Newcastle Airport, Newcastle - United Kingdom",
  "(BEG) Belgrade Nikola Tesla Airport, Belgrade - Serbia",
  "(RHO) Rhodes International Airport, Rhodos - Greece",
  "(PSA) Pisa International Airport, Pisa - Italy",
  "(KOJ) Kagoshima Airport, Kagoshima - Japan",
  "(SIP) Simferopol International Airport, Simferopol - Ukraine",
  "(SVQ) Sevilla Airport, Sevilla - Spain",
  "(KCH) Kuching International Airport, Kuching - Malaysia",
  "(OVB) Tolmachevo Airport, Novosibirsk - Russia",
  "(BIO) Bilbao Airport, Bilbao - Spain",
  "(ANC) Ted Stevens Anchorage International Airport, Anchorage - United States",
  "(ABQ) Albuquerque International Sunport Airport, Albuquerque - United States",
  "(LPL) Liverpool John Lennon Airport, Liverpool - United Kingdom",
  "(CNS) Cairns International Airport, Cairns - Australia",
  "(EMA) East Midlands Airport, East Midlands - United Kingdom",
  "(CXR) Cam Ranh Airport, Nha Trang - Vietnam",
  "(SWA) Jieyang Chaoshan International Airport, Shantou - China",
  "(YOW) Ottawa Macdonald-Cartier International Airport, Ottawa - Canada",
  "(BUF) Buffalo Niagara International Airport, Buffalo - United States",
  "(TFN) Tenerife Norte Airport, Santa Cruz de Tenerife - Spain",
  "(BRI) Bari Karol Wojtyła Airport, Bari - Italy",
  "(OMA) Eppley Airfield, Omaha - United States",
  "(GDN) Gdańsk Lech Wałęsa Airport, Gdansk - Poland",
  "(LCY) London City Airport, London - United Kingdom",
  "(PKU) Sultan Syarif Kasim Ii (Simpang Tiga) Airport, Pekanbaru - Indonesia",
  "(TRD) Trondheim Airport Værnes, Trondheim - Norway",
  "(DLM) Dalaman International Airport, Dalaman - Turkey",
  "(SJO) Juan Santamaria International Airport, San Jose - Costa Rica",
  "(HDY) Hat Yai International Airport, Hat Yai - Thailand",
  "(RAK) Menara Airport, Marrakech - Morocco",
  "(JAI) Jaipur International Airport, Jaipur - India",
  "(YWG) Winnipeg James Armstrong Richardson International Airport, Winnipeg - Canada",
  "(LKO) Chaudhary Charan Singh International Airport, Lucknow - India",
  "(GAU) Lokpriya Gopinath Bordoloi International Airport, Guwahati - India",
  "(SRG) Achmad Yani Airport, Semarang - Indonesia",
  "(ONT) Ontario International Airport, Ontario - United States",
  "(NUE) Nuremberg Airport, Nuernberg - Germany",
  "(SVG) Stavanger Airport Sola, Stavanger - Norway",
  "(MUN) Maturín Airport, Maturin - Venezuela",
  "(CAG) Cagliari Elmas Airport, Cagliari - Italy",
  "(MSQ) Minsk National Airport, Minsk - Belarus",
  "(YHZ) Halifax Stanfield International Airport, Halifax - Canada",
  "(KBV) Krabi Airport, Krabi - Thailand",
  "(LBA) Leeds Bradford Airport, Leeds - United Kingdom",
  "(HRG) Hurghada International Airport, Hurghada - Egypt",
  "(TRV) Trivandrum International Airport, Trivandrum - India",
  "(JHG) Xishuangbanna Gasa Airport, Jinghonggasa - China",
  "(PVD) T. F. Green Airport, Providence - United States",
  "(PDG) Tabing Airport, Padang - Indonesia",
  "(KTW) Katowice International Airport, Katowice - Poland",
  "(BJV) Milas Bodrum International Airport, Bodrum - Turkey",
  "(FLN) Hercílio Luz International Airport, Florianopolis - Brazil",
  "(MIR) Monastir Habib Bourguiba International Airport, Monastir - Tunisia",
  "(LXA) Lhasa Gonggar Airport, Lhasa - China",
  "(BDO) Husein Sastranegara International Airport, Bandung - Indonesia",
  "(LOP) Lombok International Airport, Praya - Indonesia",
  "(MDC) Sam Ratulangi Airport, Manado - Indonesia",
  "(BDJ) Syamsudin Noor Airport, Banjarmasin - Indonesia",
  "(MRU) Sir Seewoosagur Ramgoolam International Airport, Plaisance - Mauritius",
  "(TAE) Daegu Airport, Taegu - South Korea",
  "(DVO) Francisco Bangoy International Airport, Davao - Philippines",
  "(MIG) Mianyang Airport, Mianyang - China",
  "(SYZ) Shiraz Shahid Dastghaib International Airport, Shiraz - Iran",
  "(ABV) Nnamdi Azikiwe International Airport, Abuja - Nigeria",
  "(PNK) Supadio Airport, Pontianak - Indonesia",
  "(MAH) Menorca Airport, Menorca - Spain",
  "(TZX) Trabzon International Airport, Trabzon - Turkey",
  "(MKE) General Mitchell International Airport, Milwaukee - United States",
  "(BEL) Val de Cans International Airport, Belem - Brazil",
  "(KMJ) Kumamoto Airport, Kumamoto - Japan",
  "(CUZ) Alejandro Velasco Astete International Airport, Cuzco - Peru",
  "(FNC) Cristiano Ronaldo International Airport, Funchal - Portugal",
  "(TBS) Tbilisi International Airport, Tbilisi - Georgia",
  "(SDJ) Sendai Airport, Sendai - Japan",
  "(JHB) Senai International Airport, Johor Bahru - Malaysia",
  "(NGS) Nagasaki Airport, Nagasaki - Japan",
  "(ZAG) Zagreb Airport, Zagreb - Croatia",
  "(KOA) Kona International At Keahole Airport, Kona - United States",
  "(GYN) Santa Genoveva Airport, Goiania - Brazil",
  "(VIX) Eurico de Aguiar Salles Airport, Vitoria - Brazil",
  "(LUX) Luxembourg Airport, Luxemburg - Luxembourg",
  "(PQC) Phu Quoc International Airport, Phuquoc - Vietnam",
  "(CBR) Canberra International Airport, Canberra - Australia",
  "(SAL) El Salvador International Airport, San Salvador - El Salvador",
  "(KMI) Miyazaki Airport, Miyazaki - Japan",
  "(AWZ) Ahwaz International Airport, Ahwaz - Iran",
  "(KIH) Kish International Airport, Kish Island - Iran",
  "(BBI) Biju Patnaik Airport, Bhubaneswar - India",
  "(CCJ) Calicut International Airport, Calicut - India",
  "(CGB) Marechal Rondon Airport, Cuiaba - Brazil",
  "(SZB) Sultan Abdul Aziz Shah International Airport, Kuala Lumpur - Malaysia",
  "(MYJ) Matsuyama Airport, Matsuyama - Japan",
  "(LGB) Long Beach Airport, Long Beach - United States",
  "(LIH) Lihue Airport, Lihue - United States",
  "(SPU) Split Airport, Split - Croatia",
  "(UFA) Ufa International Airport, Ufa - Russia",
  "(ELP) El Paso International Airport, El Paso - United States",
  "(YTZ) Billy Bishop Toronto City Centre Airport, Toronto - Canada",
  "(IFN) Isfahan International Airport, Esfahan - Iran",
  "(PAT) Lok Nayak Jayaprakash Airport, Patina - India",
  "(LGK) Langkawi International Airport, Langkawi - Malaysia",
  "(ROV) Rostov-on-Don Airport, Rostov - Russia",
  "(COR) Ingeniero Ambrosio Taravella Airport, Cordoba - Argentina",
  "(SFB) Orlando Sanford International Airport, Sanford - United States",
  "(CJJ) Cheongju International Airport, Chongju - South Korea",
  "(KLO) Kalibo International Airport, Kalibo - Philippines",
  "(HIJ) Hiroshima Airport, Hiroshima - Japan",
  "(KUF) Kurumoch International Airport, Samara - Russia",
  "(MAO) Eduardo Gomes International Airport, Manaus - Brazil",
  "(SCQ) Santiago de Compostela Airport, Santiago - Spain",
  "(KZN) Kazan International Airport, Kazan - Russia",
  "(GUA) La Aurora International Airport, Guatemala City - Guatemala",
  "(ACC) Kotoka International Airport, Accra - Ghana",
  "(BRE) Bremen Airport, Bremen - Germany",
  "(DJJ) Sentani International Airport, Jayapura - Indonesia",
  "(CZX) Changzhou Benniu Airport, Changzhou - China",
  "(SSH) Sharm El Sheikh International Airport, Sharm El Sheikh - Egypt",
  "(CEI) Chiang Rai International Airport, Chiang Rai - Thailand",
  "(USM) Samui Airport, Ko Samui - Thailand",
  "(DAR) Julius Nyerere International Airport, Dar Es Salaam - Tanzania",
  "(GZT) Gaziantep International Airport, Gaziantep - Turkey",
  "(HHN) Frankfurt-Hahn Airport, Hahn - Germany",
  "(HBA) Hobart International Airport, Hobart - Australia",
  "(UKB) Kobe Airport, Kobe - Japan",
  "(LAD) Quatro de Fevereiro Airport, Luanda - Angola",
  "(NAT) Governador Aluízio Alves International Airport, Natal - Brazil",
  "(ECN) Ercan International Airport, Nicosia - Cyprus",
  "(ALB) Albany International Airport, Albany - United States",
  "(LEJ) Leipzig Halle Airport, Leipzig - Germany",
  "(UTH) Udon Thani Airport, Udon Thani - Thailand",
  "(MRQ) Marinduque Airport, Gasan - Philippines",
  "(DBV) Dubrovnik Airport, Dubrovnik - Croatia",
  "(MZG) Makung Airport, Makung - Taiwan",
  "(ISG) Ishigaki Airport, Ishigaki - Japan",
  "(KJA) Yemelyanovo Airport, Krasnoyarsk - Russia",
  "(RUN) Roland Garros Airport, St.-denis - Reunion",
  "(BUR) Bob Hope Airport, Burbank - United States",
  "(IDR) Devi Ahilyabai Holkar Airport, Indore - India",
  "(VTZ) Visakhapatnam Airport, Vishakhapatnam - India",
  "(SXR) Sheikh ul Alam Airport, Srinagar - India",
  "(MYY) Miri Airport, Miri - Malaysia",
  "(MRV) Mineralnyye Vody Airport, Mineralnye Vody - Russia",
  "(VVO) Vladivostok International Airport, Vladivostok - Russia",
  "(KRT) Khartoum International Airport, Khartoum - Sudan",
  "(IGU) Foz do Iguaçu International Airport, Foz Do Iguacu - Brazil",
  "(CJB) Coimbatore International Airport, Coimbatore - India",
  "(DKR) Léopold Sédar Senghor International Airport, Dakar - Senegal",
  "(ATQ) Sri Guru Ram Dass Jee International Airport, Amritsar - India",
  "(DIY) Diyarbakir Airport, Diyabakir - Turkey",
  "(ABJ) Félix-Houphouët-Boigny International Airport, Abidjan - Cote d'Ivoire",
  "(MCZ) Zumbi dos Palmares Airport, Maceio - Brazil",
  "(DRW) Darwin International Airport, Darwin - Australia",
  "(IXE) Mangalore International Airport, Mangalore - India",
  "(KHV) Khabarovsk-Novy Airport, Khabarovsk - Russia",
  "(IXB) Bagdogra Airport, Baghdogra - India",
  "(URT) Surat Thani Airport, Surat Thani - Thailand",
  "(IKT) Irkutsk Airport, Irkutsk - Russia",
  "(DTM) Dortmund Airport, Dortmund - Germany",
  "(PSP) Palm Springs International Airport, Palm Springs - United States",
  "(KBR) Sultan Ismail Petra Airport, Kota Bahru - Malaysia",
  "(NAN) Nadi International Airport, Nandi - Fiji",
  "(ASR) Kayseri Erkilet Airport, Kayseri - Turkey",
  "(NAG) Dr. Babasaheb Ambedkar International Airport, Nagpur - India",
  "(SYR) Syracuse Hancock International Airport, Syracuse - United States",
  "(GRO) Girona Airport, Gerona - Spain",
  "(ILO) Iloilo International Airport, Iloilo - Philippines",
  "(TBZ) Tabriz International Airport, Tabriz - Iran",
  "(YYJ) Victoria International Airport, Victoria - Canada",
  "(VNS) Lal Bahadur Shastri Airport, Varanasi - India",
  "(PGK) Pangkal Pinang (Depati Amir) Airport, Pangkal Pinang - Indonesia",
  "(YLW) Kelowna International Airport, Kelowna - Canada",
  "(ZQN) Queenstown International Airport, Queenstown International - New Zealand",
  "(NRN) Weeze Airport, Weeze - Germany",
  "(ORN) Es Senia Airport, Oran - Algeria",
  "(OIT) Oita Airport, Oita - Japan",
  "(PDL) João Paulo II Airport, Ponta Delgada - Portugal",
  "(KMQ) Komatsu Airport, Kanazawa - Japan",
  "(YTY) Yangzhou Taizhou Airport, Yangzhou - China",
  "(TJM) Roshchino International Airport, Tyumen - Russia",
  "(SXM) Princess Juliana International Airport, Philipsburg - Netherlands Antilles",
  "(TAK) Takamatsu Airport, Takamatsu - Japan",
  "(VII) Vinh Airport, Vinh - Vietnam",
  "(UBP) Ubon Ratchathani Airport, Ubon Ratchathani - Thailand",
  "(HPH) Cat Bi International Airport, Haiphong - Vietnam",
  "(PWM) Portland International Jetport Airport, Portland - United States",
  "(KGD) Khrabrovo Airport, Kaliningrad - Russia",
  "(CGY) Cagayan De Oro Airport, Ladag - Philippines",
  "(HBE) Borg El Arab Airport, Alexandria - Egypt",
  "(HKD) Hakodate Airport, Hakodate - Japan",
  "(HUI) Phu Bai Airport, Hue - Vietnam",
  "(SGC) Surgut Airport, Surgut - Russia",
  "(MDZ) El Plumerillo Airport, Mendoza - Argentina",
  "(SZF) Samsun Çarşamba Airport, Samsun - Turkey",
  "(BPS) Porto Seguro Airport, Porto Seguro - Brazil",
  "(DRS) Dresden Airport, Dresden - Germany",
  "(KKC) Khon Kaen Airport, Khon Kaen - Thailand",
  "(LJU) Ljubljana Jože Pučnik Airport, Ljubljana - Slovenia",
  "(YQB) Québec City Jean Lesage International Airport, Quebec - Canada",
  "(ZTH) Zakynthos International Airport, Zakynthos - Greece",
  "(PNS) Pensacola Regional Airport, Pensacola - United States",
  "(PPS) Puerto Princesa Airport, Puerto Princesa - Philippines",
  "(DJB) Sultan Thaha Airport, Jambi - Indonesia",
];

//initiate the autocomplete function on the "airports" element, and pass along the array as possible autocomplete values:
document.addEventListener('DOMContentLoaded', function() {
  autocomplete(document.querySelector("#airports_from"), airports);
  autocomplete(document.querySelector("#airports_to"), airports);
});

/* -- Set searching spinner while getting API request -- */
function searching() {
  const airportsFrom = document.querySelector("#airports_from").value;
  const airportsTo = document.querySelector("#airports_to").value;
  const departing = document.querySelector("#departing").value;
  const returning = document.querySelector("#returning").value;
  const roundtrip = document.querySelector("#roundtrip").checked;
  const oneWay = document.querySelector("#one-way").checked;
  const background = document.querySelector("#booking");

  if (airportsFrom && airportsTo && departing && (oneWay || (roundtrip && returning))) {
    document.querySelector(".booking-form").style.display = "none";
    // by: https://codepen.io/nietoperq/pen/LYBgdwr
    const loadText = document.querySelector(".loading-text");
    const bg = document.querySelector(".bg");

    let load = 0;

    let interval = setInterval(blurring, 250);

    function blurring() {
      loadText.style.display = "block";
      load++;
      if (load > 99) {
        clearInterval(interval);
      }
      loadText.innerText = `${load}%`;
      loadText.style.opacity = 1 - load / 100;
      background.style.opacity = 1 - load / 100;
      bg.style.filter = `blur(${30 - (load * 30) / 100}px)`;
    }
  }
}

