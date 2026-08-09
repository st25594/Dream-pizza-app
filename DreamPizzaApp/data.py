import json
import os

FILE_NAME = "data/orders.json"

def save_order(order):

    orders = []

    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            try:
                orders = json.load(file)
            except:
                orders = []

    orders.append(order)

    with open(FILE_NAME, "w") as file:
        json.dump(orders, file, indent=4)
        