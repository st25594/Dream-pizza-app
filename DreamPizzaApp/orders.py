from constants import *

class Order:

    def __init__(self):

        self.customer = ""
        self.phone = ""
        self.address = ""

        self.delivery = False

        self.pizzas = []

        self.total = 0

    def add_pizza(self, pizza):

        self.pizzas.append(pizza)

    def calculate_total(self):

        total = 0

        for pizza in self.pizzas:

            if pizza in PIZZAS[:7]:
                total += REGULAR_PRICE
            else:
                total += GOURMET_PRICE

        if self.delivery:
            total += DELIVERY_FEE

        self.total = total

        return total
    []