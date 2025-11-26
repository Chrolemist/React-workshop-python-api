from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models import Book, BookCreate

# APIRouter används för att gruppera endpoints.
# Det gör att vi kan inkludera dessa i main.py utan att ha all kod där.
router = APIRouter()

# Mock-databas (en enkel lista i minnet)
# I en riktig applikation skulle detta vara en koppling till en SQL-databas.
books: List[Book] = [
    Book(id=1, title="1984", author="George Orwell", year=1949),
    Book(id=2, title="The Great Gatsby", author="F. Scott Fitzgerald", year=1925),
    Book(id=3, title="The Hobbit", author="J.R.R. Tolkien", year=1937)
]

# GET - Hämta alla (med filtrering)
# response_model=List[Book] berättar för Swagger hur svaret ser ut.
# Parametrarna 'author' och 'year' blir automatiskt query-parametrar (t.ex. /books?author=orwell).
@router.get("/books", response_model=List[Book])
def get_books(author: Optional[str] = None, year: Optional[int] = None):
    result = books
    # Filtrera på författare om parametern finns
    if author:
        result = [b for b in result if author.lower() in b.author.lower()]
    # Filtrera på år om parametern finns
    if year:
        result = [b for b in result if b.year == year]
    return result

# GET - Hämta en specifik bok
# {book_id} i URL:en matchas mot argumentet book_id i funktionen.
@router.get("/books/{book_id}", response_model=Book)
def get_book(book_id: int):
    # Sök efter boken i listan
    book = next((b for b in books if b.id == book_id), None)
    if not book:
        # Om boken inte finns, kasta ett 404-fel (Not Found)
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# POST - Skapa ny bok
# status_code=201 betyder "Created", vilket är standard för lyckade skapanden.
# Vi tar emot en BookCreate (utan ID) och returnerar en Book (med ID).
@router.post("/books", response_model=Book, status_code=201)
def create_book(book_in: BookCreate):
    # Generera ett nytt ID (bara för denna mock-databas)
    new_id = max(b.id for b in books) + 1 if books else 1
    
    # Skapa en ny Book-instans. **book_in.dict() packar upp fälten från input-modellen.
    new_book = Book(id=new_id, **book_in.dict())
    books.append(new_book)
    return new_book

# PUT - Uppdatera bok
# Vi behöver både ID i URL:en och den nya datan i body.
@router.put("/books/{book_id}", response_model=Book)
def update_book(book_id: int, book_in: BookCreate):
    # Hitta index för boken vi ska uppdatera
    index = next((i for i, b in enumerate(books) if b.id == book_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Ersätt den gamla boken med en ny som har samma ID men ny data
    updated_book = Book(id=book_id, **book_in.dict())
    books[index] = updated_book
    return updated_book

# DELETE - Ta bort bok
# status_code=204 betyder "No Content", vilket är standard när man tar bort något.
@router.delete("/books/{book_id}", status_code=204)
def delete_book(book_id: int):
    index = next((i for i, b in enumerate(books) if b.id == book_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Book not found")
    
    books.pop(index)
    return