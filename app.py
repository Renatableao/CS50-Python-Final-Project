import sqlite3
from ssl import VERIFY_X509_PARTIAL_CHAIN
from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
    jsonify,
)
from flask_session import Session
from flask_mail import Mail, Message
from time import time
from datetime import date, datetime
from dateutil.relativedelta import relativedelta
import jwt
import os
import json
import calendar
import re
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv, find_dotenv
from helpers import login_required, search

# Configure application
app = Flask(__name__)

# Configure Flask_mail
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 465
app.config["MAIL_USERNAME"] = os.environ.get("email_username")
app.config["MAIL_PASSWORD"] = os.environ.get("email_key")
app.config["MAIL_USE_TLS"] = False
app.config["MAIL_USE_SSL"] = True
app.config["MAIL_MAX_EMAILS"] = None
app.config["MAIL_ASCII_ATTACHMENTS"] = False
mail = Mail(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure SQLite to read database
con = sqlite3.connect("bookaseat.db", check_same_thread=False)
db = con.cursor()

@app.template_filter("date_hours")
def str_to_datetime(dict: dict) -> date:
    list = [str(value) for value in dict.values()]
    date = '/'.join(list[0:3])
    date += " " + ':'.join(list[3:])
    date_object = datetime.strptime(date, "%Y/%m/%d  %H:%M:%S")
    return date_object

@app.template_filter("date")
def str_to_datetime(dict: dict) -> date:
    list = [str(value) for value in dict.values()]
    date = '/'.join(list[0:3])
    date_object = datetime.strptime(date, "%Y/%m/%d")
    return date_object

@app.template_filter("to_hours")
def min_to_hours(min: int) -> str:
    hours = min // 60
    minutes = min % 60
    return "{:02d}h{:02d}m".format(hours, minutes)

@app.template_filter('abb_date')
def abb_date(date: list) -> date:
    abb = calendar.month_abbr[int(date[1])] + " " + date[2]
    return abb

@app.context_processor
def days_difference():
    def _days_difference(date1, date2):
        return (date2 - date1).days
    return dict(days_difference=_days_difference)

@app.context_processor
def hours_difference():
    def _hours_difference(date1, date2):
        difference = date2 - date1
        hours = (difference).seconds // 3600
        minutes = ((difference).seconds % 3600) // 60
        return "{:02d}h{:02d}m".format(hours, minutes)
    return dict(hours_difference=_hours_difference)

# Load the currencies.json file
with open('./static/currencies.json', 'r') as f:
    currencies = json.load(f)

@app.context_processor
def format_price():
    # Define a template filter to format prices using a given currency code
    def _format_price(price, currency_code):
        # Find the currency object that matches the code
        currency = next((c for c in currencies if c['code'] == currency_code), None)
        if currency:
            decimal_places = currency['decimalDigits']
            price_str = f"{float(price):.{decimal_places}f}" if decimal_places > 0 else f"{int(price)}"
            symbol = currency['symbol']
            formatted_price = f"{symbol}{price_str}" if currency['symbolOnLeft'] else f"{price_str}{symbol}"
            formatted_price = formatted_price.replace(symbol, f"{symbol} ") if currency['spaceBetweenAmountAndSymbol'] else formatted_price
            formatted_price = formatted_price.replace('.', currency['decimalSeparator'])
            if currency['thousandsSeparator'] != " ":
                formatted_price = re.sub(r'(\d)(?=(\d{3})+(?!\d))', f"\\1{currency['thousandsSeparator']}", formatted_price)
            return formatted_price
        else:
            return price

    return dict(format_price=_format_price, currencies=currencies)

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/", methods=["GET", "POST"])
def index():
    # User reached route via POST
    if request.method == "POST":
        
        # get user inputs and save as session variables
        session['flight_type'] = request.form.get("flight-type")
        session['origin'] = request.form.get("airports-from")
        session['destination'] = request.form.get("airports-to")
        session['departing_date'] = request.form.get("departing")
        session['adults'] = int(request.form.get("adults"))
        session['toddler'] = int(request.form.get("toddler"))
        session['child'] = int(request.form.get("child"))
        session['cabin_class'] = request.form.get("cabin-class")

        # get returning date only if is roundtrip
        if session['flight_type'] == "roundtrip":
            session['returning_date'] = request.form.get("returning")
        else: 
            session['returning_date'] = None

        # add ages to children's list
        children = []
        for _ in range(session['toddler']):
            children.append(1)
        for _ in range(session['child']):
            children.append(5)
        
        session['children'] = children
        session['passengers'] = session['adults'] + len(children)
        session['page'] = '/results'
        
        return redirect('/results') 
        
    # User reached route via GET
    else:

        today = date.today()
        session["today"] = today
        session["oneyearlater"] = today + relativedelta(years=1)
        session['page'] = '/'
        message=request.args.get('message')
        return render_template("index.html", message=message)


@app.route("/results", methods=["GET", "POST"])
def results():

    # User reached route via POST
    if request.method == "POST":

        # get user inputs and save as session variables
        session['flight_type'] = request.form.get("flight-type-results")
        session['origin'] = request.form.get("airports-from-results")
        session['destination'] = request.form.get("airports-to-results")
        session['departing_date'] = request.form.get("departing-results")
        session['adults'] = int(request.form.get("adults-results"))
        session['toddler'] = int(request.form.get("toddler-results"))
        session['child'] = int(request.form.get("child-results"))
        session['cabin_class'] = request.form.get("cabin-class-results")

        # get returning date only if is roundtrip
        if session['flight_type'] == "roundtrip":
            session['returning_date'] = request.form.get("returning-results")
        else: 
            session['returning_date'] = None

        # add ages to children's list
        children = []
        for _ in range(session['toddler']):
            children.append(1)
        for _ in range(session['child']):
            children.append(5)
        
        session['children'] = children
        session['passengers'] = session['adults'] + len(children)
        
        return redirect('/results')

    else:    

        flight_type = session.get('flight_type')
        origin = session.get('origin')
        destination = session.get('destination')
        departing_date = session.get('departing_date').split("-")
        adults = session.get('adults')
        children = session.get('children')
        cabin_class = session.get('cabin_class')
        locale = session.get("locale", "en-US")
        market = session.get("market", "US")
        currency = session.get("currency", "USD")

        # define oneway or roundtrip legs
        query_legs = []
        first_leg = {
            "originPlaceId": {"iata": origin[1:4]},
            "destinationPlaceId": {"iata": destination[1:4]},
            "date": {
                "year": int(departing_date[0]),
                "month": int(departing_date[1]),
                "day": int(departing_date[2]),
            },
        }
        query_legs.append(first_leg)
        if flight_type == "roundtrip":
            returning_date = session.get('returning_date').split("-")
            second_leg = {
                "originPlaceId": {"iata": destination[1:4]},
                "destinationPlaceId": {"iata": origin[1:4]},
                "date": {
                    "year": int(returning_date[0]),
                    "month": int(returning_date[1]),
                    "day": int(returning_date[2]),
                },
            }
            query_legs.append(second_leg)

        # get cabine class especification
        classes = {
            "Economy class": "CABIN_CLASS_ECONOMY",
            "First class": "CABIN_CLASS_FIRST",
            "Business class": "CABIN_CLASS_BUSINESS",
        }
        cabin_class = classes[cabin_class]

        search_flights = search(market, locale, currency, query_legs, adults, children, cabin_class)
        
        if search_flights: 
            sorted_search = search_flights["sortingOptions"]["cheapest"]
            search_results = search_flights["results"]

            itineraryIds = {}
            for itinerary in sorted_search:
                if len(itineraryIds) >= 60:
                    break
                itineraryIds[itinerary["itineraryId"]] = itinerary["score"]

            message=request.args.get('message')
            session['page'] = '/results'
            
            return render_template("searchResults.html", search_results=search_results, itineraryIds=itineraryIds, message=message)
    
        else:
            message="No API Response"
            session['page'] = '/'
            return render_template("index.html", message=message)


@app.route("/config", methods=["GET", "POST"])
def config():
    # User reached route via POST
    if request.method == "POST":
        saved_language = request.form.get("input_language")

        if saved_language == "undefined":
            saved_language = "en"
        else:
            saved_language = saved_language[-2:].lower()

        languages_codes = {
            "en": "en-US",
            "es": "es-ES",
            "fr": "fr-FR",
            "de": "de-DE",
            "pt": "pt-BR",
            "cn": "zh-CN",
            "it": "it-IT",
        }

        market = request.form.get("country-select")
        currency = request.form.get("currency-select")
        session["locale"] = languages_codes[saved_language]
        session["market"] = market[-3:-1]
        session["currency"] = currency

        return '', 204

    # User reached route via GET
    else:
        return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        email = request.form.get("reg-email").lower()
        username = request.form.get("reg-username").title()

        # Query database for username
        user = db.execute("SELECT * FROM users WHERE email = ?", [email]).fetchone()

        # Ensure username is not already used
        if user is not None:
            flash("User already exists! Please register another one.", "register")
            message = "Registration Error"
            return render_template("index.html", message=message)

        hash = generate_password_hash(request.form.get("reg-password"))

        db.execute(
            "INSERT INTO users(username, email, hash) VALUES (?, ?, ?)",
            [username, email, hash],
        )
        con.commit()

        # Remember which user has logged in
        user = db.execute("SELECT * FROM users WHERE email = ?", [email]).fetchone()
        session["user_id"] = user[0]
        session["user_username"] = user[1]

        html = session.get('page')

        return redirect(html)

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return redirect('/')


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.pop('user_id', None)
    session.pop('user_username', None)


    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Query database for user
        user = db.execute(
            "SELECT * FROM users WHERE email = ?",
            [request.form.get("log-email").lower()],
        ).fetchone()

        # Ensure email exists and password is correct
        if user is None:
            flash("Email not registered!", "login")
            message = "Log in Error"
            return render_template("index.html", message=message)

        elif not check_password_hash(user[2], request.form.get("log-password")):
            flash("Invalid password!", "login")
            message = "Log in Error"
            return render_template("index.html", message=message)

        else:
            # Remember which user has logged in
            session["user_id"] = user[0]
            session["user_username"] = user[1]

            html = session.get('page')

            return redirect(html)

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return redirect('/')


@app.route("/passwordLink", methods=["GET", "POST"])
def passwordLink():
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Query database for user
        user = db.execute(
            "SELECT * FROM users WHERE email = ?",
            [request.form.get("forgot-email").lower()],
        ).fetchone()

        # Ensure email is already registered
        if user is None:
            flash("Not a registered email!", "forgot-password")
            message = "Forgot password Error"

            html = session.get('page')
            return redirect('{}?message={}'.format(html, message))

        # Generate reset token
        load_dotenv(find_dotenv())
        key = os.environ.get("SECRET_KEY")
        token = jwt.encode(
            {"reset": user[3], "exp": time() + 120}, key, algorithm="HS256"
        )

        # Save token in database
        db.execute("UPDATE users SET token = ? WHERE id = ?", [token, user[0]])
        con.commit()

        # Send email with reset link
        msg = Message(
            "Password reset request",
            sender=os.environ.get("email_username"),
            recipients=[user[3]],
        )
        msg.body = f"To reset your password, please follow this link:  {url_for('resetPassword', token=token, user=user, _external=True)}"
        mail.send(msg)
        message = "Link sent"
        html = session.get('page')

        return redirect('{}?message={}'.format(html, message))

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return redirect('/')


@app.route("/resetPassword", methods=["GET", "POST"])
def resetPassword():
    # Store user info in variables
    user = request.args.get("user")
    token = request.args.get("token")

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Hash new password and replace it in database. Also delete used token
        hash = generate_password_hash(request.form.get("reset-password"))
        db.execute(
            "UPDATE users SET hash = ?, token = ? WHERE id = ?",
            [hash, "", request.form.get("user")],
        )
        con.commit()
        message = "Valid password reset"
        html = session.get('page')
    
        return redirect('{}?message={}'.format(html, message))

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        load_dotenv(find_dotenv())
        key = os.environ.get("SECRET_KEY")
        session['page'] = '/'

        try:
            # Check if token has expired
            jwt.decode(token, key, algorithms="HS256")
            user_token = db.execute(
                "SELECT token FROM users where id= ?", [user]
            ).fetchone()[0]

            # Check if token is valid and associated to user
            if token == user_token:
                message = "Valid token"
                return render_template("index.html", user=user, message=message)
            else:
                message = "Token Error"
                flash("Invalid link! Please request a new one.", "forgot-password")
                return render_template("index.html", message=message)

        # If token is expired
        except jwt.ExpiredSignatureError:
            message = "Token Error"
            flash("Token has expired! Please request a new one.", "forgot-password")
            return render_template("index.html", message=message)


@app.route("/changePassword", methods=["GET", "POST"])
def changePassword():
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        new_username = request.form.get("change-username")
        new_password = request.form.get("change-password")

        if new_username != "":
            db.execute(
                "UPDATE users SET username = ? WHERE id = ?",
                [new_username.title(), session["user_id"]],
            )
            con.commit()
            session["user_username"] = new_username.title()

        if new_password != "":
            # Hash new password and replace it in database. Also delete used token
            hash = generate_password_hash(request.form.get("change-password"))
            db.execute(
                "UPDATE users SET hash = ? WHERE id = ?", [hash, session["user_id"]]
            )
            con.commit()

        message = "Changes ok"
        html = session.get('page')
        
        return redirect('{}?message={}'.format(html, message))

    # User reached route via GET
    else:
        return redirect('/')


@app.route("/deleteAccount", methods=["GET", "POST"])
def deleteAccount():
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # DELETE USER FROM DATABASE
        db.execute("DELETE FROM users WHERE id = ?", [session["user_id"]])
        con.commit()

        session.clear()

        message = "Delete account"
        html = session.get('page')
        
        return redirect('{}?message={}'.format(html, message))

    # User reached route via GET
    else:
        return redirect("/")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.pop('user_id', None)
    session.pop('user_username', None)

    html = session.get('page')

    # Redirect user to login form
    return redirect(html)
