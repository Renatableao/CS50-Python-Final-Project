import sqlite3
from ssl import VERIFY_X509_PARTIAL_CHAIN
from flask import Flask, flash, redirect, render_template, request, session, url_for, jsonify
from flask_session import Session
from flask_mail import Mail, Message
from time import time
from datetime import date
from dateutil.relativedelta import relativedelta
import jwt
import os
from werkzeug.security import check_password_hash, generate_password_hash
from dotenv import load_dotenv, find_dotenv
from helpers import login_required, search
# Configure application
app = Flask(__name__)

# Configure Flask_mail
app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ.get('email_username')
app.config['MAIL_PASSWORD'] = os.environ.get('email_key')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_MAX_EMAILS'] = None
app.config['MAIL_ASCII_ATTACHMENTS'] = False
mail= Mail(app)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure SQLite to read database
con = sqlite3.connect("bookaseat.db", check_same_thread=False)
db = con.cursor()

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


		# get user inputs
		flight_type =  request.form.get("flight-type")
		origin = request.form.get("airports_from")
		destination = request.form.get("airports_to")
		departing = request.form.get("departing").split("-")
		adults = request.form.get("adults")
		toddler = request.form.get("toddler")
		child = request.form.get("child")
		cabin = request.form.get("cabin_class")

		# get returning date only if is roundtrip
		if flight_type == "roundtrip":
			returning = request.form.get("returning").split("-")

		# define oneway or roundtrip legs
		queryLegs = []
		firstleg = {
				"originPlaceId": {"iata": origin},
				"destinationPlaceId": {"iata": destination},
				"date": {
					"year": departing[0],
					"month": departing[1],
					"day": departing[2]
				}
			}
		queryLegs.append(firstleg)
		if flight_type == "roundtrip":
			secondleg = {
				"originPlaceId": {"iata": destination},
				"destinationPlaceId": {"iata": origin},
				"date": {
					"year": returning[0],
					"month": returning[1],
					"day": returning[2]
				}
			}
			queryLegs.append(secondleg)

		# add ages to children's list
		children = []
		for _ in range(int(toddler)):
			children.append(1)
		for _ in range(int(child)):
			children.append(5)

		# get cabine class especification
		classes = { "Economy class": "CABIN_CLASS_ECONOMY", "First class": "CABIN_CLASS_FIRST", "Business class": "CABIN_CLASS_BUSINESS"}
		cabin_class = classes[cabin]
		
		language = session.get('language', 'en-US')
		country = session.get('country', 'US')
		currency = session.get('currency', 'USD')
		
		#search(market, locale, currency, queryLegs, adults, children, cabin_class)
		return render_template("test.html", locale=language, market=country, currency=currency, queryLegs=queryLegs, adults=adults, children=children, cabin_class=cabin_class)

	
	# User reached route via GET
	else:
		today = date.today()
		
		session["today"] = today
		session["oneyearlater"] = today + relativedelta(years=1)
		return render_template("index.html")


@app.route("/config", methods=["GET", "POST"])
def config():

	# User reached route via POST
	if request.method == "POST":

		saved_language = request.form.get("input_language")

		if saved_language == "undefined":
			saved_language = "en"
		else:
			saved_language = saved_language[-2:].lower()
		
		
		languages_codes = {"en": "en-US", "es": "es-ES", "fr": "fr-FR", "de": "de-DE", "pt": "pt-BR", "cn": "zh-CN", "it": "it-IT"}


		country = request.form.get("country-select")
		currency = request.form.get("currency-select")
		session["language"] = languages_codes[saved_language]
		session["country"] = country
		session["currency"] = currency

		return render_template("index.html")
	
	# User reached route via GET
	else:

		return render_template("index.html")
    
@app.route("/register", methods=["GET", "POST"])
def register():
	"""Register user"""
	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":
			
			email = request.form.get('reg-email').lower()
			username = request.form.get("reg-username").title()

			# Query database for username
			user = db.execute('SELECT * FROM users WHERE email = ?', [email]).fetchone()

			# Ensure username is not already used
			if user is not None:
				flash('User already exists! Please register another one.', 'register')
				message = "Registration Error"
				return render_template("index.html", message=message)
			
			hash = generate_password_hash(request.form.get("reg-password"))

			db.execute("INSERT INTO users(username, email, hash) VALUES (?, ?, ?)", [username , email, hash])
			con.commit()

			# Remember which user has logged in
			user = db.execute("SELECT * FROM users WHERE email = ?", [email]).fetchone()
			session["user_id"] = user[0]
			session["user_username"] = user[1]

			# Redirect user to favorites
			return render_template("index.html")

	# User reached route via GET (as by clicking a link or via redirect)
	else:
		return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
	"""Log user in"""

	# Forget any user_id
	session.clear()

	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":
			
		# Query database for user
		user = db.execute("SELECT * FROM users WHERE email = ?", [request.form.get("log-email").lower()]).fetchone()

		# Ensure email exists and password is correct
		if user is None:
			flash("Email not registered!", 'login')
			message = "Log in Error"
			return render_template("index.html", message=message)
			
		elif not check_password_hash(user[2], request.form.get("log-password")):
				flash("Invalid password!", 'login')
				message = "Log in Error"
				return render_template("index.html", message=message)

		else: 
			# Remember which user has logged in
			session["user_id"] = user[0]
			session["user_username"] = user[1]
			return redirect("/")

	# User reached route via GET (as by clicking a link or via redirect)
	else:
		return render_template("index.html")


@app.route("/passwordLink", methods=["GET", "POST"])
def passwordLink():
	
	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":

		# Query database for user
		user = db.execute("SELECT * FROM users WHERE email = ?", [request.form.get("forgot-email").lower()]).fetchone()

		# Ensure email is already registered
		if user is None:
			flash("Not a registered email!", 'forgot-password')
			message = "Forgot password Error"
			return render_template("index.html", message=message)
		
		# Generate reset token
		load_dotenv(find_dotenv())
		key = os.environ.get('SECRET_KEY')
		token = jwt.encode({"reset": user[3], 'exp': time() + 120}, key, algorithm="HS256")
		
		#Save token in database
		db.execute("UPDATE users SET token = ? WHERE id = ?", [token, user[0]])
		con.commit()

		#Send email with reset link
		msg = Message('Password reset request', sender=os.environ.get('email_username'), recipients = [user[3]])
		msg.body = f"To reset your password, please follow this link:  {url_for('resetPassword', token=token, user=user, _external=True)}"
		mail.send(msg)
		message = "Link sent"
		return render_template("index.html", message=message)

	# User reached route via GET (as by clicking a link or via redirect)	
	else:
		return render_template("index.html")
	
@app.route("/resetPassword", methods=["GET", "POST"])
def resetPassword():

	# Store user info in variables
	user = request.args.get('user')
	token = request.args.get('token')

	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":

		# Hash new password and replace it in database. Also delete used token
		hash = generate_password_hash(request.form.get("reset-password"))
		db.execute("UPDATE users SET hash = ?, token = ? WHERE id = ?", [hash, "",  request.form.get("user")] )
		con.commit()
		message = 'Valid password reset'
		return render_template("index.html", message=message)
		
	# User reached route via GET (as by clicking a link or via redirect)	
	else: 
		load_dotenv(find_dotenv())
		key = os.environ.get('SECRET_KEY')
		try:
			# Check if token has expired
			jwt.decode(token, key, algorithms="HS256")
			user_token = db.execute("SELECT token FROM users where id= ?", [user]).fetchone()[0]
			
			# Check if token is valid and associated to user
			if token == user_token:
				message="Valid token"
				return render_template("index.html", user=user, message=message)
			else:
				message="Token Error"
				flash("Invalid link! Please request a new one.", 'forgot-password')
				return render_template("index.html", message=message)
		
		# If token is expired
		except jwt.ExpiredSignatureError:
			message="Token Error"
			flash("Token has expired! Please request a new one.", 'forgot-password')
			return render_template("index.html", message=message)

@app.route("/changePassword", methods=["GET", "POST"])
def changePassword():

	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":

		new_username = request.form.get("change-username")
		new_password = request.form.get("change-password")

		if new_username != "":
			db.execute("UPDATE users SET username = ? WHERE id = ?", [new_username.title(), session["user_id"]])
			con.commit()
			session["user_username"] = new_username.title()
		
		if new_password != "":
			# Hash new password and replace it in database. Also delete used token
			hash = generate_password_hash(request.form.get("change-password"))
			db.execute("UPDATE users SET hash = ? WHERE id = ?", [hash, session["user_id"]])
			con.commit()
		
		message = 'Changes ok'
		return render_template("index.html", message=message)
		
	# User reached route via GET
	else: 
		return render_template("index.html")
	
@app.route("/deleteAccount", methods=["GET", "POST"])
def deleteAccount():

	# User reached route via POST (as by submitting a form via POST)
	if request.method == "POST":

		# DELETE USER FROM DATABASE
		db.execute("DELETE FROM users WHERE id = ?", [session["user_id"]])
		con.commit()

		session.clear()

		message = 'Delete account'
		return render_template("index.html", message=message)
		
	# User reached route via GET
	else: 
		return render_template("index.html")


@app.route("/logout")
def logout():
	"""Log user out"""

	# Forget any user_id
	session.clear()

	# Redirect user to login form
	return redirect("/")
