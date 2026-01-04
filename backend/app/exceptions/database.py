from fastapi import HTTPException, status


class NotFoundError(HTTPException):
    def __init__(self, resource: str = "Resource", identifier: str = None):
        detail = f"{resource} not found" if not identifier else f"{resource} '{identifier}' not found"
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class ConflictError(HTTPException):
    def __init__(self, resource: str = "Resource", reason: str = "already exists"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=f"{resource} {reason}")


class DatabaseError(HTTPException):
    def __init__(self, detail: str = "A database error occurred"):
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=detail)