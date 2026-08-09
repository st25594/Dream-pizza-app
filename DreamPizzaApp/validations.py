def valid_name(name):
    return len(name.strip()) > 0


def valid_phone(phone):
    return phone.isdigit() and len(phone) >= 7


def valid_address(address):
    return len(address.strip()) > 0