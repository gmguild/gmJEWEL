import string
import random
import brownie


def get_random_name():
    letters = string.ascii_letters
    name = "".join(random.choice(letters) for i in range(15))
    return name


def bank_address():
    return "0xa9ce83507d872c5e1273e745abcfda849daa654f"


users_with_locked_jewel = [
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
    "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
    "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
    "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
    "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
    "0x3160938Ac57224E919af47fEA544882C4A7dcea1",
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
    "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
    "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
    "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
    "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
    "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
    "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
    "0xD3f177920bc0b407644e60568CABeC77fC043E2f",
    "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
    "0x6333DD17adb9171bbdF7604292490D9b75847561",
]

users_with_locked_crystal = ["0xe028CB3E566059A0a0D43b90eF011eA1399E29c8"]


def anti_whale_transfer_value():
    return 1500767312484200867793381


max_uint256 = brownie.convert.to_uint(
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    type_str="uint256",
)
