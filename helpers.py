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
            "destinationPlaceId": {"iata": "SAO"},
            "date": {"year": 2023, "month": 6, "day": 23},
        },
        {
            "originPlaceId": {"iata": "SAO"},
            "destinationPlaceId": {"iata": "CNF"},
            "date": {"year": 2023, "month": 7, "day": 10},
        },
    ]

    #print(search("BR", "pt-BR", "BRL", querylegs, 2, [], "CABIN_CLASS_ECONOMY"))
    
    # call api to update market.json list
    #get_market()
    
    # call api to update currency.json list
    #get_currency()


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
        with open('static/markets.json', 'w') as f:
            json.dump(result['markets'], f, indent=4)
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
        with open('static/currencies.json', 'w') as f:
            json.dump(result['currencies'], f, indent=4)
        return result

    except (KeyError, TypeError, ValueError):   
        return None


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
