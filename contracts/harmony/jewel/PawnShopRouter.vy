"""
There is a bad UX when using the PawnShop contract directly

The function 'forceRedeemUTXO' takes a single parameter which 
represents the amount of fee to be paid in JEWEL (rather than gmJEWEL)
It is possible for a user to accidentally overpay this fee by redeeming a stash
which has already been redeemed.

This contract enforces additional checks to prevent this from happening
"""

pawn_shop: public(address)
jewel: public(address)
gmJewel: public(address)

interface PawnShop:
    def forceRedeemUTXO(_utxo: address, _jewelAmount: uint256): nonpayable
    def isValidUTXO(_utxo: address) -> bool: view
    def getFeeTier(_amount: uint256) -> uint256: view
    def mintedFromUTXO(_utxo: address) -> uint256: view
    def redeemUTXOForFullCombinedValue(_utxo: address, _amount: uint256): nonpayable

interface UTXO:
    def nominalCombinedValue() -> uint256: view

interface JewelToken:
    def transferAll(_to: address): nonpayable

from vyper.interfaces import ERC20

@external
def __init__(_pawnshop: address, _gmJewel: address, _jewel: address):
    self.pawn_shop = _pawnshop
    self.gmJewel = _gmJewel
    self.jewel = _jewel

@external
def fullRedeem(_utxo: address, _jewelAmount: uint256):
    # User must approve this contract first with gmjewel

    # Do checks
    assert PawnShop(self.pawn_shop).isValidUTXO(_utxo) # dev: invalid UTXO
    # pawnshop also enforces above
    utxoValue: uint256 = UTXO(_utxo).nominalCombinedValue()
    assert utxoValue > 0 # dev: empty stash
    assert _jewelAmount < utxoValue # dev: cannot overpay for stash


    feeBps: uint256 = PawnShop(self.pawn_shop).getFeeTier(utxoValue)
    feeToPay: uint256 = utxoValue * feeBps / 10_000

    # This function will make the contract the redeemer
    # Therefore we should transfer token to this contract
    # And then transfer unlocked/locked jewel to user

    costInGmJewel: uint256 = utxoValue + feeToPay - _jewelAmount

    ERC20(self.gmJewel).transferFrom(msg.sender, self, costInGmJewel)
    ERC20(self.jewel).transferFrom(msg.sender, self, _jewelAmount)

    ERC20(self.jewel).approve(self.pawn_shop, _jewelAmount)

    amountToMint: uint256 = utxoValue - PawnShop(self.pawn_shop).mintedFromUTXO(_utxo)
    if amountToMint > 0:
        PawnShop(self.pawn_shop).forceRedeemUTXO(_utxo,_jewelAmount)
    else:
        PawnShop(self.pawn_shop).redeemUTXOForFullCombinedValue(_utxo, _jewelAmount)

    JewelToken(self.jewel).transferAll(msg.sender)


@external
@view
def utxoValues(_utxo: address) -> uint256[3]:
    utxoValue: uint256 = UTXO(_utxo).nominalCombinedValue()
    mintedAmount: uint256 = PawnShop(self.pawn_shop).mintedFromUTXO(_utxo)
    amountToMint: uint256 = utxoValue - mintedAmount
    return [amountToMint, utxoValue, mintedAmount]