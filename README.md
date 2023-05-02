# CS50's Phython Final Project: "Bookaseat"
#### Video Demo:  <URL HERE>
## Description:
     
### Overview

I've developed a responsive website built upon the data and functionality of an existing application called Skyscanner API through requests sent to the Rapid API platform (<https://rapidapi.com/hub>).
A flight search engine website is a platform that allows users to search for flight tickets to different destinations based on specific dates, prices, and airlines. This website uses a flight search engine that searches and compares the prices of various airlines, enabling users to find the most affordable deals.

#### You can browse and test it at: <URL>

### Technologies Used

This website was built using the following technologies:

* HTML
* CSS
* JavaScript
* Python
* API (application programming interface)
* JSON
* SQLite
* Flask
* Flask-mail
* BootStrap
* Jinja
* Pytest

### How to use

The website's index page displays a flight search box that allows users to enter the type of flight, departure and arrival cities, travel dates, number of passengers and cabin class choice. Once the user inputs this information and it is all validated, they can click on the "Search" button to initiate the search.

The search engine then displays a list of flights based on the search criteria. Those results include the airlines, flight duration, departure and arrival times, connections and price of the ticket. It also provides a list of agencies where the user can book their flights. When the user selects a chosen fare, they are redirected to the agency's website where they can complete the booking process based on their preferences.

### Language and Currency Configuration

The website provides a configuration menu that offers users the flexibility to customize their experience. Users have the option to select their preferred language, which enables the website to translate all of the website's content into their chosen language using the Google translate button.

Additionally, users can choose their country and currency preferences, which determines the currency used for displaying flight prices and the country-specific search results. This feature helps users plan their travel budget and find the best deals in their local currency, making the website more user-friendly for global audiences.

### Login

Users can create an account on the website to save their flight search results and access them later on a personal page. The website also includes a login functionality with a forgot password feature created via Flask-mail. If a user forgets their password, they can request a recovery link to be sent to their email. 

### Personal Page

Once logged in, the user can access a personal page where they can see their saved flight results with all the informartion provided before. From this page, they can also delete a saved result. Additionally, users can change their account settings (such as password and username) or delete their account entirely.

All the information collected by inputs on the flask forms and routes of the website are stored in a database file named bookaseat.db. This database consists of two tables:

* users (holds information from user registration: id, username, hashed password, email and, if any, token for reseting password)
* user_flights (contains information on flight results saved as favorites)

Those informations are then accessed by SQLite3 commands to, for example, start a user session based in the user_id or display in the personal page all the user's favorite flight information.

### Other information

Sensitive information as API key, passwords and SECRET_KEY are stored in local file as environment variables in a file called .env and prevented to be pushed to an open repository by .gitignore.


