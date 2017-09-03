pragma solidity >0.4.11;

contract Test {

    uint256 public a;

    function setA (uint256 _a) {
        a = _a;
    }

    function setLargeA (uint256 _a) returns (bool) {
        if (_a < 100) {
            return false;
        }
        a = _a;
        return true;
    }

    function Test (uint256 _a) {
        a = _a;
    }

}
