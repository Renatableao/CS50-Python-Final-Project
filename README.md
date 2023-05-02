# CS50's Phython Final Project: "Bookaseat"
#### Video Demo:  <URL HERE>
#### Description:
     
You can browse and test it at: 

I've developed a responsive website built upon the data and functionality of an existing application called Skyscanner API through the Rapid API platform (https://rapidapi.com/hub).

Listed below are the web technologies I used in this project:

HTML
CSS
JavaScript
Python
API (application programming interface)
JSON
SQLite
Flask
Flask-mail
BootStrap
Jinja



In addition to session features, users are allowed to change password if logged in or reset password if forgotten. This is accomplished by Flask-mail, which sends an email to the user with a reset link attached to a 8 minute expiration token that redirects to a reset_password html page.

All the information collected by inputs on the flask forms and routes of the website are stored in a database file named bookaseat.db. This database consists of two tables:

users (holds information from user registration: id, username, hashed password, email and, if any, token for reseting password)
user_flights (contains information on flight results saved as favorites)
Those informations are then accessed by SQLite3 commands to, for example, start a user session based in the user_id or display in the personal page all the user's favorite flight infos.

Sensitive information as API key, passwords and SECRET_KEY are stored in local file as environment variables in a file called .env and prevented to be pushed to an open repository by .gitignore.