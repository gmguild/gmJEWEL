from fastapi import FastAPI
import json
from fastapi.middleware.cors import CORSMiddleware
from sqlitedict import SqliteDict

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "https://gmg.money"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

state_utxo = SqliteDict(filename='./state_utxo.sqlite', autocommit=False,
                        flag="r", journal_mode="WAL")
state_utxos_by_user = SqliteDict(filename='./state_utxos_by_user.sqlite', autocommit=False,
                                 flag="r", journal_mode="WAL")


@app.get("/utxo/list")
def get_all_utxos():
    return [v for [_, v] in state_utxo.items()]


def _sort_by_size(e):
    if not "newVal" in e:
        return 0
    return int(e["newVal"])


@app.get("/utxo/minted")
def get_sorted_utxos():
    listed = [
        v for [_, v] in state_utxo.items()
        if "newVal" in v and int(v["newVal"]) > 0
    ]
    listed.sort(key=_sort_by_size, reverse=True)
    return listed


@app.get("/utxo/user")
def get_utxos_for_user(address):
    result = []
    if address.lower() in state_utxos_by_user and state_utxos_by_user[address.lower()] is not None:
        for utxo_address in state_utxos_by_user[address.lower()]:
            result.append(state_utxo[utxo_address])
        result.sort(key=_sort_by_size, reverse=True)
    return result
