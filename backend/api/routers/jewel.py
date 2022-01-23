from fastapi import APIRouter
import json
from sqlitedict import SqliteDict

router = APIRouter()

state_utxo = SqliteDict(filename='./state_utxo.sqlite', autocommit=False,
                        flag="r", journal_mode="WAL")
state_utxos_by_user = SqliteDict(filename='./state_utxos_by_user.sqlite', autocommit=False,
                                 flag="r", journal_mode="WAL")


def _sort_by_size(e):
    if not "newVal" in e:
        return 0
    return int(e["newVal"])


@router.get("/utxo/list", deprecated=True)
def get_all_utxos():
    return [v for [_, v] in state_utxo.items()]


@router.get("/utxo/minted", deprecated=True)
def get_sorted_utxos():
    listed = [
        v for [_, v] in state_utxo.items()
        if "newVal" in v and int(v["newVal"]) > 0
    ]
    listed.sort(key=_sort_by_size, reverse=True)
    return listed


@router.get("/utxo/user", deprecated=True)
def get_utxos_for_user(address):
    result = []
    if address.lower() in state_utxos_by_user and state_utxos_by_user[address.lower()] is not None:
        for utxo_address in state_utxos_by_user[address.lower()]:
            result.routerend(state_utxo[utxo_address])
        result.sort(key=_sort_by_size, reverse=True)
    return result


@router.get("/jewel/utxo/list")
def get_all_utxos():
    return [v for [_, v] in state_utxo.items()]


@router.get("/jewel/utxo/minted")
def get_sorted_utxos():
    listed = [
        v for [_, v] in state_utxo.items()
        if "newVal" in v and int(v["newVal"]) > 0
    ]
    listed.sort(key=_sort_by_size, reverse=True)
    return listed


@router.get("/jewel/utxo/user")
def get_utxos_for_user(address):
    result = []
    if address.lower() in state_utxos_by_user and state_utxos_by_user[address.lower()] is not None:
        for utxo_address in state_utxos_by_user[address.lower()]:
            result.append(state_utxo[utxo_address])
        result.sort(key=_sort_by_size, reverse=True)
    return result
