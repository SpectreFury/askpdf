class AppExceptions(Exception):

    def __init__(self, message: str, status_code: int):
        self.message: str = message
        self.status_code: int = status_code
        super().__init__(self.message)


class UserAlreadyExistsException(AppExceptions):
    def __init__(self, message: str = "A user with this email already exists."):
        super().__init__(message=message, status_code=400)
