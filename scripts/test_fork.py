from brownie import interface
import json


profiles_address = "0xabD4741948374b1f5DD5Dd7599AC1f85A34cAcDD"


def main():
    profiles = interface.Profiles(profiles_address)
    print("Profile count is " + str(profiles.getProfileCount()))
