from constants import *

def create_receipt(order):

    text = ""

    text += f"Customer: {order.customer}\n"

    if order.delivery:

        text += f"Address: {order.address}\n"
        text += f"Phone: {order.phone}\n"

    text += "\n"

    for pizza in order.pizzas:

        if pizza in PIZZAS[:7]:
            price = REGULAR_PRICE
        else:
            price = GOURMET_PRICE

        text += f"{pizza:<20}${price:.2f}\n"

    if order.delivery:
        text += f"\nDelivery Fee: ${DELIVERY_FEE:.2f}"

    text += f"\n\nTOTAL = ${order.total:.2f}"

    return text