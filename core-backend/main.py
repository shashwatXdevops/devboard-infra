import os
from fastapi import FastAPI, Depends, HTTPException, status
from auth import verify_jwt, create_jwt_token
from database import get_pg_session, get_mongo_db
from grpc_client import summarize_task

app = FastAPI(title="Devboard Core Backend")

@app.get("/")
def read_root():
    return {"message": "Welcome to Devboard Core Backend"}

@app.post("/token")
def login(username: str):
    # Dummy authentication logic
    token = create_jwt_token(data={"sub": username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/secure-data")
def secure_data(token: dict = Depends(verify_jwt)):
    return {"message": "This is protected data", "user": token}

@app.post("/summarize")
def summarize(task_description: str):
    try:
        summary = summarize_task(task_description)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
