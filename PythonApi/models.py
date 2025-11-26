from pydantic import BaseModel
from typing import Optional

# Pydantic används för datavalidering.
# BaseModel ser till att datan vi skickar in och ut har rätt typ (str, int, etc).

# Modell för att ta emot data när vi skapar en bok (inget ID krävs).
# Användaren skickar bara titel, författare och år.
# Detta motsvarar en "DTO" (Data Transfer Object) i C#, t.ex. CreateBookDto.
class BookCreate(BaseModel):
    title: str
    author: str
    year: int

# Modell för att returnera data (inkluderar ID).
# Denna klass ärver från BookCreate, så den har alla fält ovan + id.
# Detta används när vi skickar tillbaka data till klienten.
# Detta motsvarar en "DTO" i C#, t.ex. BookDto.
class Book(BookCreate):
    id: int