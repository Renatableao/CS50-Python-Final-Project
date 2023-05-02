from project import min_to_hours, obj_to_datetime, format_price
from datetime import datetime


def test_min_to_hours():
    assert min_to_hours(340) == "05h40m"
    assert min_to_hours(0) == "00h00m"


def test_obj_to_datetime():
    assert isinstance(obj_to_datetime({"year": 2012, "month": 6, "day": 12}), datetime)
    expected_output = datetime(2019, 12, 3)
    assert (
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
        == expected_output
    )


def test_format_price():
    assert format_price(560, "EUR") == "560,00 €"
    assert format_price(4500.34, "AUD") == "$4,500.34"
    assert format_price(1230.12, "BDT") == "BDT 1,230.12"
