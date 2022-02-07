// SPDX-License-Identifier: MIT-LICENSE
pragma solidity 0.6.12;

import "OpenZeppelin/openzeppelin-contracts@3.3.0/contracts/token/ERC20/IERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@3.3.0/contracts/token/ERC20/ERC20.sol";
import "OpenZeppelin/openzeppelin-contracts@3.3.0/contracts/math/SafeMath.sol";
import "interfaces/IUniswapV2Pair.sol";
import "interfaces/IUniswapV2Router.sol";

contract StakedGMG is ERC20("Staked Merchants Guild", "xGMG") {
    using SafeMath for uint256;
    IERC20 public token;
    IERC20 public immutable jewel;
    address public keeper;
    IUniswapV2Router public router;

    constructor(
        IERC20 _token,
        address _keeper,
        IUniswapV2Router _router,
        IERC20 _jewel
    ) public {
        token = _token;
        keeper = _keeper;
        jewel = _jewel;
        router = _router;
    }

    function enter(uint256 _amount) public {
        uint256 totalToken = token.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalToken == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalToken);
            _mint(msg.sender, what);
        }
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(token.balanceOf(address(this))).div(
            totalShares
        );
        _burn(msg.sender, _share);
        token.transfer(msg.sender, what);
    }

    function swap(
        address[] calldata path,
        uint256 amountIn,
        uint256 amountOutMin
    ) external onlyKeeper {
        require(path[0] != address(token), "dont do that");
        IERC20(path[0]).approve(address(router), amountIn);
        router.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            path,
            address(this),
            block.timestamp + 1
        );
    }

    modifier onlyKeeper() {
        require(keeper == msg.sender, "caller is not keeper");
        _;
    }
}
