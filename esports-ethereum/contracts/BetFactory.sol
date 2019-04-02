pragma solidity ^0.5.0;
import "./SafeMath.sol";

contract BetFactory {
    using SafeMath for uint256;

    event NewBet(uint indexed matchId, uint betId, uint teamId, uint betValue);
    event WinPayedOut(uint win, address winner);
    
    struct Bet {
        uint betValue;
        uint team_id;
        uint match_id;
    }

    Bet[] public bets;
    

    mapping(uint => address payable) private betToBetter;

    // mapping(address => uint) balance;
    
    mapping(uint => uint) public closingTimestamp;

    modifier checkTime(uint _match_id) {
        if (closingTimestamp[_match_id] == 0) {
            _;
        }
        require(closingTimestamp[_match_id] > now, "Betpool is closed");
        _;
    }

    function setTimestamp(uint _match_id, uint closingTime) external {
        closingTimestamp[_match_id] = closingTime;
        
    }

    function newBet(uint _match_id, uint _team_id) external payable checkTime(_match_id) {
        uint id = bets.push(Bet(msg.value, _team_id, _match_id)).sub(1);
        betToBetter[id] = msg.sender;
        emit NewBet(_match_id, id, _team_id, msg.value);
    }

    function payOut(uint betId) external payable {
        betToBetter[betId].transfer(msg.value);
        emit WinPayedOut(msg.value, betToBetter[betId]);
    }

}
