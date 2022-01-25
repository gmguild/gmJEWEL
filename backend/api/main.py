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


###################
#                 #
#   LEGACY APIS   #
#                 #
###################


SCRIPT_DIR = os.path.dirname(__file__)  # <-- absolute dir the script is in
DB_FOLDER_PREFIX = os.path.join(SCRIPT_DIR, '../db/jewel')


state_utxo = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_utxo.sqlite'),
                        autocommit=False,
                        flag="r", journal_mode="WAL")

state_utxos_by_user = SqliteDict(filename=os.path.join(DB_FOLDER_PREFIX, './state_utxos_by_user.sqlite'),
                                 autocommit=False,
                                 flag="r", journal_mode="WAL")


def _sort_by_size(e):
    if not "newVal" in e:
        return 0
    return int(e["newVal"])


@app.get("/utxo/list", deprecated=True)
def get_all_utxos():
    return [v for [_, v] in state_utxo.items()]


@app.get("/utxo/minted", deprecated=True)
def get_sorted_utxos():
    listed = [
        v for [_, v] in state_utxo.items()
        if "newVal" in v and int(v["newVal"]) > 0
    ]
    listed.sort(key=_sort_by_size, reverse=True)
    return listed


@app.get("/utxo/user", deprecated=True)
def get_utxos_for_user(address):
    result = []
    if address.lower() in state_utxos_by_user and state_utxos_by_user[address.lower()] is not None:
        for utxo_address in state_utxos_by_user[address.lower()]:
            result.append(state_utxo[utxo_address])
        result.sort(key=_sort_by_size, reverse=True)
    return result
