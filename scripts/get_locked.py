from brownie import interface, web3

jewel_address = "0x72Cb10C6bfA5624dD07Ef608027E366bd690048F"


def users_with_locked_jewel():
    return [
        "0x1e3B6b278BA3b340d4BE7321e9be6DfeD0121Eac",
        "0x6333DD17adb9171bbdF7604292490D9b75847561",
        "0x3875e5398766a29c1B28cC2068A0396cba36eF99",
        "0x79F0d0670D17a89f509Ad1c16BB6021187964A29",
        "0x1d6f4e86E9Eaa5591DDAc378aA8d43422F02E66d",
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


def main():
    jewel_token = interface.Jewel(jewel_address)
    users = users_with_locked_jewel()

    max_whale = jewel_token.maxTransferAmount()
    print("Max transfer value", web3.fromWei(max_whale, unit="ether"))

    for user in users:
        bal = jewel_token.lockOf(user)
        print(f"Balance for {user} is {web3.fromWei(bal, unit='ether')} locked jewel")
