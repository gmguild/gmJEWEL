pragma solidity 0.8.10;

contract DeployerContract {
    function deploy(bytes memory code) public returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(code, 0x20), mload(code), 0)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        return addr;
    }
}
