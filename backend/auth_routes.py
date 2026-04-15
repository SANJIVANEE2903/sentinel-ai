from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import hash_password, verify_password, create_token

Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- SIGNUP ----------------
@router.post("/signup")
def signup(username: str, email: str, password: str, db: Session = Depends(get_db)):
    user = User(
        username=username,
        email=email,
        password=hash_password(password)
    )
    db.add(user)
    db.commit()
    return {"message": "User created successfully"}

# ---------------- LOGIN ----------------
@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        return {"error": "Invalid credentials"}

    token = create_token({"sub": user.email})
    return {"access_token": token}

# ---------------- FORGOT PASSWORD ----------------
@router.post("/recover")
def recover(email: str, new_password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {"error": "User not found"}

    user.password = hash_password(new_password)
    db.commit()

    return {"message": "Password updated successfully"}