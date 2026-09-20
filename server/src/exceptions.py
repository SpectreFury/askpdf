class AppExceptions(Exception):

    def __init__(self, message: str, status_code: int):
        self.message: str = message
        self.status_code: int = status_code
        super().__init__(self.message)


class UserAlreadyExistsException(AppExceptions):
    def __init__(self, message: str = "A user with this email already exists."):
        super().__init__(message=message, status_code=400)

class UserNotExistsException(AppExceptions):
    def __init__(self, message: str = "A user was not found."):
        super().__init__(message=message, status_code=400)

class EmailOrPasswordMissingException(AppExceptions):
    def __init__(self, message: str = "Email and password are mandatory."):
        super().__init__(message=message, status_code=400)

class IncorrectPasswordException(AppExceptions):
    def __init__(self, message: str = "Your credentials are incorrect, try again."):
        super().__init__(message=message, status_code=400)
