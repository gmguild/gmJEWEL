# @dev Sells llJEWEL in exchange for regular JEWEL 1:1
# @author LLJewelJ


interface JewelToken:
    def totalBalanceOf(_holder: address) -> uint256: view
    def balanceOf(_holder: address) -> uint256: view
    def lockOf(_holder: address) -> uint256: view
    def transfer(_to: address, _amount: uint256) -> bool: nonpayable
    def transferFrom(_sender: address, _recipient: address, _amount: uint256): nonpayable
    def transferAll(_to: address): nonpayable

interface llJEWEL:
    def balanceOf(_holder: address) -> uint256: view
    def mint(_to: address, _value: uint256): nonpayable
    def redeem(_to: address, _value: uint256): nonpayable


event OwnershipTransferred:
    previousOwner: indexed(address)
    newOwner: indexed(address)

event Paused:
    account: indexed(address)

event Unpaused:
    account: indexed(address)

event UpdateFeeWallet:
    newFeeWallet: indexed(address)


# ERC20 address for JEWEL Token
JEWEL_TOKEN_ADDRESS: immutable(address)
# ERC20 address for llJEWEL Token
LIQLOCKJEWEL_TOKEN_ADDRESS: immutable(address)

owner: public(address)
isPaused: public(bool)
feeWallet: public(address)
keeper: public(address)


@external
def __init__(_lljewel: address, _jewel: address):
    LIQLOCKJEWEL_TOKEN_ADDRESS = _lljewel
    JEWEL_TOKEN_ADDRESS        = _jewel

    self.owner = msg.sender
    self.feeWallet = msg.sender
    self.keeper = msg.sender


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
def _mintWithJewel(_purchaser: address, _receiver: address, _amount: uint256):
    JewelToken(JEWEL_TOKEN_ADDRESS).transferFrom(_purchaser, self, _amount)
    llJEWEL(LIQLOCKJEWEL_TOKEN_ADDRESS).mint(_receiver, _amount)


@external
def buy(_amount: uint256):
    assert self.isPaused == False # dev: contract is paused
    assert _amount > 0 # dev: must be more than zero
    self._mintWithJewel(msg.sender, msg.sender, _amount)


@external
def buyWithReceiver(_amount: uint256, _receiver: address):
    assert self.isPaused == False # dev: contract is paused
    assert _receiver != ZERO_ADDRESS # dev: cannot buy for burn
    assert _amount > 0 # dev: must be more than zero
    self._mintWithJewel(msg.sender, _receiver, _amount)


@internal
def _withdrawCentralBankJewelTo(_to: address, _amount: uint256):
    JewelToken(JEWEL_TOKEN_ADDRESS).transfer(_to, _amount)


@external
def withdrawCentralBankJewel(_amount: uint256):
    assert msg.sender in [self.owner,self.keeper] # dev: only owner can withdraw
    self._withdrawCentralBankJewelTo(self.feeWallet, _amount)

@external
def updateKeeper(new_keeper: address):
    assert msg.sender == self.owner
    self.keeper = new_keeper


@external
def updateFeeWallet(_newWallet: address):
    assert msg.sender == self.owner # dev: only owner can update fee
    self.feeWallet = _newWallet
    log UpdateFeeWallet(_newWallet)
       