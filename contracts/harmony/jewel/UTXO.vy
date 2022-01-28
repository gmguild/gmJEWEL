# @dev Single instance of a "pot" of locked JEWEL. Can be "unboxed" by the PawnShop that created it.
# @author LLJewelJ


interface JewelToken:
    def balanceOf(_holder: address) -> uint256: view
    def totalBalanceOf(_holder: address) -> uint256: view
    def lockOf(_holder: address) -> uint256: view
    def transfer(_to: address, _amount: uint256) -> bool: nonpayable
    def transferAll(_to: address): nonpayable

interface Profile:
    def addressToIndex(profileAddress: address) -> uint256: view


# ERC20 address for JEWEL Token
JEWEL: address
# Address for Profiles contract
Profiles: address
# Address for PawnShop contract
PawnShop: address
# Each UTXO contract must be linked to a profile
profileId: uint256
# Each UTXO has a "minter", this is the person that receives the liquid token on deposit to the PawnShop
# Note: this does not necessarily need to be the person that deposits locked token
minter: public(address)


# todo: fully comment all functions


@external
def initialize(_pawnshop: address, _minter: address, _jewel: address, _profiles: address):
    """
    @dev Initialize contract without assigning profile
    """
    assert self.PawnShop == ZERO_ADDRESS # dev: already initialized
    self.PawnShop = _pawnshop
    self.JEWEL    = _jewel
    self.minter   = _minter
    self.Profiles = _profiles
    

@external
def createProfile(_name: Bytes[32]):
    assert self.profileId == 0 # dev: already has profile
    picId: uint8 = 0
    response: Bytes[32] = raw_call(
        self.Profiles, 
        _abi_encode(_name, picId, method_id=method_id("createProfile(string,uint8)")),
        max_outsize=32,
    )
    assert convert(response, bool) # dev: error making profile
    self.profileId = Profile(self.Profiles).addressToIndex(self)


@external
def transferAll(_to: address):
    assert msg.sender == self.PawnShop
    JewelToken(self.JEWEL).transferAll(_to) # dev: this transfers ALL unlocked and locked JEWEL to _to


@external
def transferUnlocked(_to: address, _amount: uint256):
    assert msg.sender == self.PawnShop
    success: bool = JewelToken(self.JEWEL).transfer(_to, _amount) # dev: this transfers unlocked JEWEL of _amount to _to
    assert success


@view
@external
def nominalLockedValue() -> uint256:
    return JewelToken(self.JEWEL).lockOf(self)


@view
@external
def nominalUnlockedValue() -> uint256:
    return JewelToken(self.JEWEL).balanceOf(self)


@view
@external
def nominalCombinedValue() -> uint256:
    return JewelToken(self.JEWEL).totalBalanceOf(self)

