class Participant:
    def __init__(self, first, last, email, phone, target = None):
        self._first = first
        self._last = last
        self._email = email
        self._phone = phone
        self._target = target

    # Getter and Setter for Target
    def get_target(self):
        return self._target

    def set_target(self, target):
        self._target = target

    # Getter and Setter for First Name
    def get_first(self):
        return self._first

    def set_first(self, first):
        self._first = first

    # Getter and Setter for Last Name
    def get_last(self):
        return self._last

    def set_last(self, last):
        self._last = last

    # Getter and Setter for Email
    def get_email(self):
        return self._email

    def set_email(self, email):
        self._email = email

    # Getter and Setter for Phone
    def get_phone(self):
        return self._phone

    def set_phone(self, phone):
        self._phone = phone

    # Optional: String representation
    def __str__(self):
        target_name = f"{self._target._first} {self._target._last}" if self._target else "None"
        return f"{self._first} {self._last} -> {target_name}"

