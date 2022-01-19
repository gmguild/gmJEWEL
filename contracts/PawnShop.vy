# @dev Handles creating UTXOs + minting and burning of the ERC20 token via "pawning" UTXOs
# @author LLJewelJ


from vyper.interfaces import ERC20
from vyper.interfaces import ERC20Detailed


interface JewelToken:
    def totalBalanceOf(_holder: address) -> uint256: view
    def balanceOf(_holder: address) -> uint256: view
    def lockOf(_holder: address) -> uint256: view
    def approve(_spender : address, _amount : uint256) -> bool: nonpayable
    def transfer(_to: address, _amount: uint256) -> bool: nonpayable
    def transferFrom(_sender: address, _recipient: address, _amount: uint256): nonpayable
    def transferAll(_to: address): nonpayable

interface UTXO:
    def initialize(_pawnshop: address, _minter: address, _jewel: address, _profiles: address): nonpayable
    def createProfile(_name: Bytes[32]): nonpayable
    def transferAll(_to: address): nonpayable
    def transferUnlocked(_to: address, _amount: uint256): nonpayable
    def minter() -> address: view
    def nominalLockedValue() -> uint256: view
    def nominalUnlockedValue() -> uint256: view
    def nominalCombinedValue() -> uint256: view

interface llJEWEL:
    def mint(_to: address, _value: uint256): nonpayable
    def redeem(_to: address, _value: uint256): nonpayable
    def transferFrom(_from : address, _to : address, _value : uint256) -> bool: nonpayable
    def balanceOf(_holder: address) -> uint256: view

interface CentralBank:
    def buy(_amount: uint256): nonpayable
    def buyWithReceiver(_amount: uint256, _receiver: address): nonpayable


event OwnershipTransferred:
    previousOwner: indexed(address)
    newOwner: indexed(address)

event Paused:
    account: indexed(address)

event Unpaused:
    account: indexed(address)

event UTXOCreated:
    minter: indexed(address)
    utxoAddress: indexed(address)

event MintedFromUTXO:
    UTXOAddress: indexed(address)
    mintooor: indexed(address)
    mintedAmount: uint256

event UTXORedeemed:
    UTXOAddress: indexed(address)
    redeemooor: indexed(address)
    redeemedAmount: uint256
    feePaid: uint256
    feeRatio: uint256
    totalCost: uint256

event UTXOValue:
    UTXOAddress: indexed(address)
    newVal: uint256
    blockNumber: uint256
    blockTimestamp: uint256

event FeeTierUpdated:
    tier: indexed(uint256)
    oldBps: uint256
    oldThreshold: uint256
    newBps: uint256
    newThreshold: uint256

event FeeWalletUpdated:
    oldWallet: indexed(address)
    newWallet: indexed(address)



# ERC20 address for JEWEL Token
JEWEL_TOKEN_ADDRESS: immutable(address)
# ERC20 address for llJEWEL Token
LIQLOCKJEWEL_TOKEN_ADDRESS: immutable(address)
# Address of deployed UTXO contract we can create minimal proxies to
UTXO_TEMPLATE_ADDRESS: immutable(address)
# Address of deployed CentralBank contract
CENTRAL_BANK_ADDRESS: immutable(address)
# Address of deployed Profiles contract
PROFILES_ADDRESS: immutable(address)

# Lists canonical UTXO addresses
isValidUTXO: public(HashMap[address, bool])
# Keeps track of amount of llJEWEL minted per UTXO
# Will go to zero when the UTXO is redeemed
mintedFromUTXO: public(HashMap[address, uint256])

owner: public(address)
isPaused: public(bool)



# FEES. Note: all fees denoted in bps
MAXIMUM_POSSIBLE_FEE: constant(uint256) = 500 # max 5% fee
MAXIMUM_NUMBER_TIERS: constant(uint256) = 4
FEES_BPS: public(uint256[MAXIMUM_NUMBER_TIERS])
FEES_THRESHOLD: public(uint256[MAXIMUM_NUMBER_TIERS])

# Maximum number of UTXOs that a user can deploy from a single address
MAXIMUM_NUMBER_UTXOS: constant(uint256) = 8
getUTXO: public(HashMap[address, address[MAXIMUM_NUMBER_UTXOS]])
numUTXOs: public(HashMap[address, uint256])

@external
def __init__(_lljewel: address, _template: address, _central_bank: address, _jewel: address, _profiles: address):
    LIQLOCKJEWEL_TOKEN_ADDRESS = _lljewel
    UTXO_TEMPLATE_ADDRESS      = _template
    CENTRAL_BANK_ADDRESS       = _central_bank
    JEWEL_TOKEN_ADDRESS        = _jewel
    PROFILES_ADDRESS           = _profiles

    self.owner = msg.sender

    self.FEES_BPS = [10,30,60,100]
    self.FEES_THRESHOLD = [
        as_wei_value(100_000, "ether"), # TIER 4: 0.1%
        as_wei_value(10_000, "ether"),  # TIER 3: 0.3%
        as_wei_value(1_000, "ether"),   # TIER 2: 0.6%
        0]                              # TIER 1: 1%


@internal
def _transferOwnership(_to: address):
    """
    @dev Transfer ownership of the token, and therefore admin rights, to a given account. Internal function without access restriction.
    @param _to The account that will receive ownership rights.
    """
    oldOwner: address = self.owner
    self.owner = _to
    log OwnershipTransferred(oldOwner, _to)


@external
def transferOwnership(_to: address):
    """
    @dev Transfer ownership of the token, and therefore admin rights, to a given account. Can only be called by current owner.
    @param _to The account that will receive ownership rights.
    """
    assert msg.sender == self.owner # dev: not admin
    assert _to != ZERO_ADDRESS # dev: cant destroy responsibility
    self._transferOwnership(_to)


@internal
def _pause(_pausedBy: address):
    assert self.isPaused == False # dev: already paused
    self.isPaused = True
    log Paused(_pausedBy)


@external
def pause():
    assert msg.sender == self.owner
    self._pause(msg.sender)


@internal
def _unpause(_unpausedBy: address):
    assert self.isPaused == True # dev: not paused
    self.isPaused = False
    log Unpaused(_unpausedBy)


@external
def unpause():
    assert msg.sender == self.owner
    self._unpause(msg.sender)


@internal
def _createUTXO(_minter: address) -> address:
    num: uint256 = self.numUTXOs[_minter]
    assert num < MAXIMUM_NUMBER_UTXOS # dev: too many UTXOs
    utxo: address = create_forwarder_to(UTXO_TEMPLATE_ADDRESS)
    UTXO(utxo).initialize(self, _minter, JEWEL_TOKEN_ADDRESS, PROFILES_ADDRESS)
    self.getUTXO[_minter][num] = utxo
    self.numUTXOs[_minter] += 1
    self.isValidUTXO[utxo] = True
    log UTXOCreated(_minter, utxo)
    return utxo


@external
def createUTXO() -> address:
    assert self.isPaused == False # dev: contract is paused
    return self._createUTXO(msg.sender)


@external
def createUTXOWithProfile(_name: Bytes[32]) -> address:
    assert self.isPaused == False # dev: contract is paused
    utxo: address = self._createUTXO(msg.sender)
    UTXO(utxo).createProfile(_name)
    return utxo


@view
@internal
def _getFeeTier(amount: uint256) -> uint256:
    for i in range(MAXIMUM_NUMBER_TIERS):
        if amount > self.FEES_THRESHOLD[i]:
            return self.FEES_BPS[i]
    # shouldn't reach this
    return MAXIMUM_POSSIBLE_FEE


@view
@external
def getFeeTier(amount: uint256) -> uint256:
    return self._getFeeTier(amount)


@internal
def _logUpdateUTXO(_utxo: address):
    newVal: uint256 = JewelToken(JEWEL_TOKEN_ADDRESS).totalBalanceOf(_utxo)
    log UTXOValue(_utxo, newVal, block.number, block.timestamp)


@internal
def _mintFromUTXO(_utxo: address) -> uint256:
    assert self.isValidUTXO[_utxo] # dev: utxo is not valid address minted by this PawnShop contract

    utxoCombinedValue: uint256 = UTXO(_utxo).nominalCombinedValue()
    amountToMint: uint256 = utxoCombinedValue - self.mintedFromUTXO[_utxo]
    minter: address = UTXO(_utxo).minter() # NOTE, the user receiving tokens is the owner of UTXO.
    # It is NOT the person that deposited the locked jewel

    assert amountToMint > 0 # dev: nothing to mint

    self.mintedFromUTXO[_utxo] += amountToMint

    llJEWEL(LIQLOCKJEWEL_TOKEN_ADDRESS).mint(minter, amountToMint)

    log MintedFromUTXO(_utxo, minter, amountToMint)
    self._logUpdateUTXO(_utxo)

    return amountToMint


@external
def mintFromUTXO(_utxo: address) -> uint256:
    assert self.isPaused == False # dev: contract is paused
    return self._mintFromUTXO(_utxo)


@internal
def _redeemUTXOForFullCombinedValue(_redeemer: address, _utxo: address, _jewelAmount: uint256):
    """
    @dev Redeem the full unlocked + locked value of a UTXO at _utxo address, sent to _redeemer
    The user must already have appropriate allowances set for this contract on the relevant ERC20 contracts.
    @param _redeemer The address that will pay llJEWEL/JEWEL and will receive the underlying value from the UTXO.
    @param _utxo The address of the UTXO contract
    @param _jewelAmount If user does not have enough llJEWEL, they can pay excess in JEWEL
    """
    assert self.isValidUTXO[_utxo] # dev: utxo is not valid address minted by this PawnShop contract

    utxoCombinedValue: uint256 = UTXO(_utxo).nominalCombinedValue()
    feeBps: uint256 = self._getFeeTier(utxoCombinedValue)
    feeToPay: uint256 = utxoCombinedValue * feeBps / 10_000

    # dev: JEWEL fee-paying works by buying llJEWEL with JEWEL 1:1 from the Central Bank
    # after transferring JEWEL from the redeemer to the PawnShop, and then the full
    # amount of llJEWEL is "redeemed"
    if _jewelAmount > 0:
        JewelToken(JEWEL_TOKEN_ADDRESS).transferFrom(_redeemer, self, _jewelAmount)
        JewelToken(JEWEL_TOKEN_ADDRESS).approve(CENTRAL_BANK_ADDRESS, _jewelAmount)
        CentralBank(CENTRAL_BANK_ADDRESS).buyWithReceiver(_jewelAmount, _redeemer)

    llJEWEL(LIQLOCKJEWEL_TOKEN_ADDRESS).redeem(_redeemer, utxoCombinedValue + feeToPay)

    self.mintedFromUTXO[_utxo] -= utxoCombinedValue
    UTXO(_utxo).transferAll(_redeemer)

    log UTXORedeemed(_utxo, _redeemer, utxoCombinedValue, feeToPay, _jewelAmount, utxoCombinedValue + feeToPay)
    self._logUpdateUTXO(_utxo)


@internal
def _redeemUTXOForUnlockedValue(_redeemer: address, _utxo: address, _jewelAmount: uint256):
    """
    @dev Redeem the full unlocked + locked value of a UTXO at _utxo address, sent to _redeemer
    The user must already have appropriate allowances set for this contract on the relevant ERC20 contracts.
    @param _redeemer The address that will pay llJEWEL/JEWEL and will receive the underlying value from the UTXO.
    @param _utxo The address of the UTXO contract
    @param _jewelAmount If user does not have enough llJEWEL, they can pay excess in JEWEL
    """

    assert self.isValidUTXO[_utxo] # dev: utxo is not valid address minted by this PawnShop contract

    utxoUnlockedValue: uint256 = UTXO(_utxo).nominalUnlockedValue()
    feeBps: uint256 = self._getFeeTier(utxoUnlockedValue)
    feeToPay: uint256 = utxoUnlockedValue * feeBps / 10_000

    # dev: JEWEL fee-paying works by buying llJEWEL with JEWEL 1:1 from the Central Bank
    # after transferring JEWEL from the redeemer to the PawnShop, and then the full
    # amount of llJEWEL is "redeemed"
    if _jewelAmount > 0:
        JewelToken(JEWEL_TOKEN_ADDRESS).transferFrom(_redeemer, self, _jewelAmount)
        JewelToken(JEWEL_TOKEN_ADDRESS).approve(CENTRAL_BANK_ADDRESS, _jewelAmount)
        CentralBank(CENTRAL_BANK_ADDRESS).buyWithReceiver(_jewelAmount, _redeemer)

    llJEWEL(LIQLOCKJEWEL_TOKEN_ADDRESS).redeem(_redeemer, utxoUnlockedValue + feeToPay)

    self.mintedFromUTXO[_utxo] -= utxoUnlockedValue
    UTXO(_utxo).transferUnlocked(_redeemer, utxoUnlockedValue)

    log UTXORedeemed(_utxo, _redeemer, utxoUnlockedValue, feeToPay, _jewelAmount, utxoUnlockedValue + feeToPay)
    self._logUpdateUTXO(_utxo)


@external
def redeemUTXOForFullCombinedValue(_utxo: address, _jewelAmount: uint256):
    self._redeemUTXOForFullCombinedValue(msg.sender, _utxo, _jewelAmount)


@external
def redeemUTXOForUnlockedValue(_utxo: address, _jewelAmount: uint256):
    self._redeemUTXOForUnlockedValue(msg.sender, _utxo, _jewelAmount)


@external
def redeemMultipleUTXOsForFullCombinedValue(_utxos: address[10], _jewelAmount: uint256):
    for _utxo in _utxos:
        self._redeemUTXOForFullCombinedValue(msg.sender, _utxo, _jewelAmount)


@external
def adjustFees(tier: uint256, bps: uint256, threshold: uint256):
    assert msg.sender == self.owner # dev: not admin
    assert tier < MAXIMUM_NUMBER_TIERS # dev: tier doesnt exist
    assert bps < MAXIMUM_POSSIBLE_FEE # dev: fee too large you capitalist swine
    log FeeTierUpdated(tier, self.FEES_BPS[tier], self.FEES_THRESHOLD[tier], bps, threshold)
    self.FEES_BPS[tier] = bps
    self.FEES_THRESHOLD[tier] = threshold


@external
def forceRedeemUTXO(_utxo: address, _jewelAmount: uint256):
    """
    @dev This function exists to prevent 'grief' attacks where a malicious user sends 1 wei to UTXO
    This causes the UTXO to be unredeemable (as its owner has not minted all its value)
    """
    assert self.isPaused == False # dev: contract is paused
    self._mintFromUTXO(_utxo)
    self._redeemUTXOForFullCombinedValue(msg.sender, _utxo, _jewelAmount)

@external
@view
def getAllUTXOs(_user: address) -> address[MAXIMUM_NUMBER_UTXOS]:
    """
    This function uses a lot of gas, but is helpful for the frontend
    """
    returnAddr: address[MAXIMUM_NUMBER_UTXOS] = empty(address[MAXIMUM_NUMBER_UTXOS])
    for i in range(MAXIMUM_NUMBER_UTXOS):
        returnAddr[i] = self.getUTXO[_user][i]
    return returnAddr
