import os
import requests
from dotenv import load_dotenv, find_dotenv
from flask import redirect, session
from functools import wraps
import json



def main():
    querylegs = [
        {
            "originPlaceId": {"iata": "CNF"},
            "destinationPlaceId": {"iata": "GRU"},
            "date": {"year": 2023, "month": 6, "day": 23},
        },
        {
            "originPlaceId": {"iata": "GRU"},
            "destinationPlaceId": {"iata": "CNF"},
            "date": {"year": 2023, "month": 7, "day": 10},
        },
    ]

    #print(len(search("BR", "pt-BR", "BRL", querylegs, 2, [], "CABIN_CLASS_ECONOMY")['sortingOptions']['cheapest']))

    # call api to update market.json list
    #get_market()

    # call api to update currency.json list
    # get_currency()

    # call api to update locations.json list
    # get_locations()

    # call api to update airports.json list
    # update_airports()

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
        with open("static/markets.json", "w") as f:
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
        with open("static/currencies.json", "w") as f:
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
        with open("static/locations.json", "w") as f:
            json.dump(result["places"], f, indent=4)
        return result

    except (KeyError, TypeError, ValueError):
        return None

def update_airports():
    
    # Open the first JSON file
    with open('static/locations.json') as f:
        locations_data = json.load(f)

    # Open the second JSON file
    # source: https://gist.github.com/tdreyno/4278655
    with open('static/airportsList.json') as f:
        airportsList_data = json.load(f)

    # Create a dictionary of airport data, keyed by iata code
    airport_dict = {airport['code']: airport for airport in airportsList_data}
   

    # Combine the data from the two files
    airport = []
    for location in locations_data.values():
        if location['iata'] in airport_dict:
            airport_data = airport_dict[location['iata']]
            airport_str = f"({location['iata']}) {airport_data['name']}, {airport_data['state']} - {airport_data['country']}"
            airport.append(airport_str)

    airport = [s.encode("ascii", "ignore").decode() for s in airport]
    airport = list(set(airport))

    
    with open('static/airports.json', 'w') as f:
        json.dump(airport, f, indent=2)


def search(market, locale, currency, queryLegs, adults, children, cabin_class):
    load_dotenv(find_dotenv())

    try:
        url = "https://skyscanner-api.p.rapidapi.com/v3e/flights/live/search/synced"

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
            "X-RapidAPI-Key": os.environ.get("API_key"),
            "X-RapidAPI-Host": "skyscanner-api.p.rapidapi.com",
        }

        response = requests.request("POST", url, json=payload, headers=headers)

    except requests.RequestException:
        return None

    # Parse response
    try:
        result = response.json()
        return result["content"]

    except (KeyError, TypeError, ValueError):
        return None


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
