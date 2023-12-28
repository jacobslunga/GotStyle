import re
import random
import requests
import json


def check_email(email):
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

    if not re.match(email_regex, email):
        return False

    return True


def get_dark_color():
    return "#{:06x}".format(random.randint(0, 0x888888))


from datetime import datetime, timedelta


def is_today(date_string):
    date = datetime.strptime(date_string, "%a, %d %b %Y %H:%M:%S %Z")

    current_date = datetime.now()

    if date.date() == current_date.date():
        return True

    if (
        date.date() == (current_date - timedelta(days=1)).date()
        and date.hour == 23
        and current_date.hour == 0
    ):
        return False

    return False


def send_push_notification(to, title, body):
    url = "https://exp.host/--/api/v2/push/send"
    headers = {
        "host": "exp.host",
        "Content-Type": "application/json",
    }
    payload = json.dumps({"to": to, "title": title, "body": body})
    requests.post(url, headers=headers, data=payload)


import requests


def is_valid_url(url):
    try:
        response = requests.head(url, allow_redirects=True, timeout=5)
        if response.status_code == 200:
            return True
        else:
            return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
