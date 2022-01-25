import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlitedict import SqliteDict

from routers.jewel import router as jewel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex='https?:\/\/(localhost|gmg\.money|.*\.gmg\.money|.*--gmjewel.netlify.app)(:8080)?',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jewel, prefix="/jewel")
