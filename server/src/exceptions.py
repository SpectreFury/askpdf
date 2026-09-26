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


class NoBearerTokenException(AppExceptions):
    def __init__(self, message: str = "Token is required for making this request"):
        super().__init__(message=message, status_code=401)


class InvalidBearerTokenException(AppExceptions):
    def __init__(self, message: str = "Your token is malformed"):
        super().__init__(message=message, status_code=401)


class ExpiredTokenException(AppExceptions):
    def __init__(self, message: str = "token_expired"):
        super().__init__(message=message, status_code=401)


class NoRefreshTokenException(AppExceptions):
    def __init__(self, message: str = "No refresh token cookie"):
        super().__init__(message=message, status_code=401)

class NoDocumentURLException(AppExceptions):
    def __init__(self, message: str = "No document url found"):
        super().__init__(message=message, status_code=404)
