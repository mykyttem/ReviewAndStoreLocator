from fastapi import FastAPI


app = FastAPI()


@app.get("/")
def add_store():
    return "Hello world"