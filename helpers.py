import os
import requests
from dotenv import load_dotenv, find_dotenv
from flask import redirect, session
from functools import wraps
import json
import re


def main():
    querylegs = [
        {
            "originPlaceId": {"iata": "CNF"},
            "destinationPlaceId": {"iata": "NAT"},
            "date": {"year": 2023, "month": 6, "day": 23},
        },
        {
            "originPlaceId": {"iata": "NAT"},
            "destinationPlaceId": {"iata": "CNF"},
            "date": {"year": 2023, "month": 7, "day": 10},
        },
    ]

    # print(get_session_token("BR", "pt-BR", "BRL", querylegs, 2, [], "CABIN_CLASS_ECONOMY"))
    # print(token)

    # call api to update market.json list
    # get_market()

    # call api to update currency.json list
    # get_currency()

    # call api to update locations.json list
    # get_locations()

    # call api to update airports.json list
    update_airports()

    # call unsplash api to update pictures.json list
    # get_pictures()


def get_market():
    load_dotenv(find_dotenv())
    try:
        url = "https://skyscanner-api.p.rapidapi.com/v3/culture/markets/en-US"

        headers = {
            "X-RapidAPI-Key": os.environ.get("API_key"),
            "X-RapidAPI-Host": "skyscanner-api.p.rapidapi.com",
        }

        response = requests.request("GET", url, headers=headers)

    except requests.RequestException:
        return None

    # Parse response
    try:
        result = response.json()
        with open("static/json/markets.json", "w") as f:
            json.dump(result["markets"], f, indent=4)
        return result

    except (KeyError, TypeError, ValueError):
        return None


def get_currency():
    load_dotenv(find_dotenv())
    try:
        url = "https://skyscanner-api.p.rapidapi.com/v3/culture/currencies"

        headers = {
            "X-RapidAPI-Key": os.environ.get("API_key"),
            "X-RapidAPI-Host": "skyscanner-api.p.rapidapi.com",
        }

        response = requests.request("GET", url, headers=headers)

    except requests.RequestException:
        return None

    # Parse response
    try:
        result = response.json()
        with open("static/json/currencies.json", "w") as f:
            json.dump(result["currencies"], f, indent=4)
        return result

    except (KeyError, TypeError, ValueError):
        return None


def get_locations():
    load_dotenv(find_dotenv())
    try:
        url = "https://skyscanner-api.p.rapidapi.com/v3/geo/hierarchy/flights/en-US"

        headers = {
            "X-RapidAPI-Key": os.environ.get("API_key"),
            "X-RapidAPI-Host": "skyscanner-api.p.rapidapi.com",
        }

        response = requests.request("GET", url, headers=headers)

    except requests.RequestException:
        return None

    # Parse response
    try:
        result = response.json()
        with open("static/json/locations.json", "w") as f:
            json.dump(result["places"], f, indent=4)
        return result

    except (KeyError, TypeError, ValueError):
        return None


def update_airports():
    # Open the first JSON file
    with open("static/json/locations.json") as f:
        locations_data = json.load(f)

    # Open the second JSON file
    # source: https://gist.github.com/tdreyno/4278655
    with open("static/json/airportsList.json") as f:
        airportsList_data = json.load(f)

    # Create a dictionary of airport data, keyed by iata code
    airport_dict = {airport["code"]: airport for airport in airportsList_data}

    # Combine the data from the two files
    airport = []
    for location in locations_data.values():
        if location["iata"] in airport_dict:
            airport_data = airport_dict[location["iata"]]
            airport_str = f"({location['iata']}) {airport_data['name']}, {airport_data['state']} - {airport_data['country']}"
            airport_str = re.sub(",  -", f", {airport_data['country']} -", airport_str)
            airport_str = re.sub("\) ,", f") {airport_data['city']},", airport_str)
            
            airport.append(airport_str)


    airport = [s.encode("ascii", "ignore").decode() for s in airport]
    airport = list(set(airport))

    with open("static/json/airports.json", "w") as f:
        json.dump(airport, f, indent=2)


def get_session_token(
    market, locale, currency, queryLegs, adults, children, cabin_class
):
    load_dotenv(find_dotenv())

    try:
        url = "https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create"

        payload = {
            "query": {
                "market": market,
                "locale": locale,
                "currency": currency,
                "queryLegs": queryLegs,
                "cabinClass": cabin_class,
                "adults": adults,
                "childrenAges": children,
            }
        }
        headers = {
            "content-type": "application/json",
            "x-api-key": os.environ.get("API_key"),
        }

        response = requests.request("POST", url, json=payload, headers=headers)
        result = response.json()

        try:
            token = result["sessionToken"]
            return token

        except:
            return None

    except requests.RequestException:
        return None


def search(token):
    # Parse response
    try:
        url = f"https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/{token}"

        headers = {"x-api-key": os.environ.get("API_key")}

        response = requests.post(url, headers=headers)

    except requests.RequestException:
        return None

    try:
        result = response.json()
        return result["content"]

    except (KeyError, TypeError, ValueError):
        return None


def get_pictures():
    # Set the endpoint URL
    url = "https://api.unsplash.com/search/photos"

    # Set the headers with your access key
    headers = {"Authorization": f"Client-ID {os.environ.get('Access_key')}"}

    # Set the query parameters
    params = {"query": "travel", "orientation": "landscape", "page": 1, "per_page": 20}

    # Send the GET request to the API
    response = requests.get(url, headers=headers, params=params)

    # Check the response status code
    if response.status_code == 200:
        # Extract the JSON data from the response
        data = response.json()
        results = data["results"]

        # Save results in list and json file
        urls = {}
        for result in results:
            description = (
                result["description"].encode("ascii", "ignore").decode()
                if result["description"]
                else ""
            )
            urls[result["urls"]["regular"]] = description

        with open("static/json/pictures.json", "w") as f:
            json.dump(urls, f, indent=2)

    else:
        print("Error:", response.status_code)


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


if __name__ == "__main__":
    main()
