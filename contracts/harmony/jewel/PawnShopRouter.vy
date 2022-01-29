"""
There is a bad UX when using the PawnShop contract directly

The function 'redeemUTXOForFullCombinedValue' takes a single parameter which 
represents the amount of fee to be paid in JEWEL (rather than gmJEWEL)
It is possible for a user to accidentally overpay this fee by redeeming a stash
which has already been redeemed.

This contract enforces additional checks to prevent this from happening
"""

pawn_shop: public(address)
jewel: public(address)
gmJewel: public(address)

interface PawnShop:
    def redeemUTXOForFullCombinedValue(_utxo: address, _jewelAmount: uint256): nonpayable
    def isValidUTXO(_utxo: address) -> bool: view
    def getFeeTier(_amount: uint256) -> uint256: view

interface UTXO:
    def forceRedeemUTXO() -> uint256: view

interface ERC20:
    def transferFrom(_from : address, _to : address, _value : uint256) -> bool: nonpayable
    def approve(_spender : address, _amount : uint256) -> bool: nonpayable

interface JewelToken:
    def transferAll(_to: address): nonpayable


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
    utxoValue: uint256 = UTXO(_utxo).forceRedeemUTXO()
    assert utxoValue > 0 # dev: empty stash
    assert _jewelAmount < utxoValue # dev: cannot overpay for stash


    feeBps: uint256 = PawnShop(self.pawn_shop).getFeeTier(utxoValue)
    feeToPay: uint256 = utxoValue + feeBps / 10_000

    # This function will make the contract the redeemer
    # Therefore we should transfer token to this contract
    # And then transfer unlocked/locked jewel to user

    feeInGmJewel: uint256 = feeToPay - _jewelAmount
    ERC20(self.gmJewel).transferFrom(msg.sender, self, feeInGmJewel)
    ERC20(self.jewel).transferFrom(msg.sender, self, _jewelAmount)

    ERC20(self.jewel).approve(self.pawn_shop, _jewelAmount)

    PawnShop(self.pawn_shop).redeemUTXOForFullCombinedValue(_utxo,_jewelAmount)

    JewelToken(self.jewel).transferAll(msg.sender)