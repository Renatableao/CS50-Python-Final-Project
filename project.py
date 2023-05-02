from datetime import date, datetime
import json
import re


def main():
    print(min_to_hours(1200))
    print(
        obj_to_datetime(
            {
                "year": 2019,
                "month": 12,
                "day": 3,
                "hour": 2,
                "minute": 35,
                "second": "12",
            }
        )
    )
    print(format_price(1230.12, "BDT"))


def min_to_hours(min: int) -> str:
    hours = min // 60
    minutes = min % 60
    return "{:02d}h{:02d}m".format(hours, minutes)


def obj_to_datetime(dict: dict) -> date:
    date_parts = [dict[key] for key in ["year", "month", "day"]]
    date_str = "/".join(map(str, date_parts))
    date_object = datetime.strptime(date_str, "%Y/%m/%d")
    return date_object


# Load the currencies.json file
with open("./static/currencies.json", "r") as f:
    currencies = json.load(f)


def format_price(price, currency_code):
    # Find the currency object that matches the code
    currency = next((c for c in currencies if c["code"] == currency_code), None)
    if currency:
        decimal_places = currency["decimalDigits"]
        price_str = (
            f"{float(price):.{decimal_places}f}"
            if decimal_places > 0
            else f"{int(price)}"
        )
        symbol = currency["symbol"]
        if currency["symbolOnLeft"]:
            # If the symbol is on the left, put a space after it
            formatted_price = f"{symbol}{price_str}"
            if currency["spaceBetweenAmountAndSymbol"]:
                formatted_price = f"{symbol} {price_str}"
        else:
            # If the symbol is on the right, put a space before it
            formatted_price = f"{price_str}{symbol}"
            if currency["spaceBetweenAmountAndSymbol"]:
                formatted_price = f"{price_str} {symbol}"
        formatted_price = formatted_price.replace(".", currency["decimalSeparator"])
        if currency["thousandsSeparator"] != " ":
            formatted_price = re.sub(
                r"(\d)(?=(\d{3})+(?!\d))",
                f"\\1{currency['thousandsSeparator']}",
                formatted_price,
            )
        return formatted_price
    else:
        return price


if __name__ == "__main__":
    main()
