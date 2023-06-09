# CS50's Phython Final Project: "Bookaseat"

## Description:
     
### Overview

I've developed a responsive website built upon the data and functionality of an existing application called Skyscanner API.
A flight search engine website is a platform that allows users to search for flight tickets to different destinations based on specific dates, prices, and airlines. This website uses a flight search engine that searches and compares the prices of various airlines, enabling users to find the most affordable deals.

#### This project is deployed on Heroku at the following URL: <https://cs50-bookaseat.herokuapp.com/>

### Technologies Used

This website was built using the following technologies:

* HTML
* CSS
* JavaScript
* Python
* API (application programming interface)
     * Skyscanner API
     * Vonage
     * Unsplash
* JSON
* SQLite
* Flask
* BootStrap
* Jinja
* Pytest
* intl-tel-input: JavaScript plugin for entering and validating international telephone numbers

### How to use

The website's index page displays a flight search box that allows users to enter the type of flight, departure and arrival cities, travel dates, number of passengers and cabin class choice. Once the user inputs this information and it is all validated, they can click on the "Search" button to initiate the search.

The search engine then displays a list of flights based on the search criteria. Those results include the airlines, flight duration, departure and arrival times, connections and price of the ticket. It also provides a list of agencies where the user can book their flights. When the user selects a chosen fare, they are redirected to the agency's website where they can complete the booking process based on their preferences.

### Currency Configuration

The website provides a configuration menu that offers users the flexibility to customize their experience. Users can choose their country and currency preferences, which determines the currency used for displaying flight prices and the country-specific search results. This feature helps users plan their travel budget and find the best deals in their local currency, making the website more user-friendly for global audiences.

### Login

Users can create an account on the website to save their flight search results and access them later on a personal page. The website also includes a login functionality with a forgot password feature created via Flask-mail. If a user forgets their password, they can request a recovery link to be sent via SMS through Vonage API. 

### Personal Page

Once logged in, the user can access a personal page where they can see their saved flight results with all the informartion provided before. From this page, they can also delete a saved result. Additionally, users can change their account settings (such as password and username) or delete their account entirely.

All the information collected by inputs on the flask forms and routes of the website are stored in a database file named bookaseat.db. This database consists of two tables:

* users (holds information from user registration: id, username, hashed password, email and, if any, token for reseting password)
* user_flights (contains information on flight results saved as favorites)

Those informations are then accessed by SQLite3 commands to, for example, start a user session based in the user_id or display in the personal page all the user's favorite flight information.

### Other information

Sensitive information as API key, passwords and SECRET_KEY are stored in local file as environment variables in a file called .env and prevented to be pushed to an open repository by .gitignore. 

### Challenges
     
Building the website was very exciting but challenging. Throughout the development I encountered several obstacles such as:
* Ensuring that the website looks and functions optimally across different devices and screen sizes.
* After deploying the website I discovered performance issues caused by slow queries and requests, which resulted in resource runout and errors. 
* Initially relying on Flask-Mail, I encountered issues with email delivery being blocked by the hosting platform, Heroku. To overcome this, I integrated Vonage SMS services, enabling reliable delivery of account recovery links to users.
* The page's functionality is adversely affected by the delay in loading caused by the overwhelming number of results from the API request. I attempted to address this issue but found that the only solution I could achieve was to limit the results, although it is probably not the optimal approach.
* At first, the project relied on an API from Rapid API, which provided a single endpoint that allowed both the creation of a search request and polling for the results in one call. This approach provided the complete set of results, simplifying the integration process. Unfortunately, the Rapid API was blocked and could no longer be used, necessitating a switch to the official Skyscanner API. The official API followed a different structure, requiring two separate endpoints for creating the search request and polling for the results.
     * The /create endpoint in the official Skyscanner API is used to initiate the search request and returns an incomplete cached subset of results.
     * To retrieve the complete list of results, the /poll endpoint is used in the official Skyscanner API. This endpoint is invoked with a sessionToken, which is obtained from the result of the /create call. 
     
The migration from the Rapid API to the official Skyscanner API required significant changes in the implementation. The code needed to be modified to separate the create and poll requests and handle the asynchronous nature of fetching the complete results. 

## Conclusion

The website now offers a user-friendly flight search experience, with features such as currency configuration, user login and personal pages, and data storage in a secure database.

I am proud of the progress made in developing this project where I could learn new skills and knowledge in web development. It was fun!  
     
