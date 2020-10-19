pragma solidity ^ 0.4.24;
import "github.com/oraclize/ethereum-api/oraclizeAPI_0.4.sol";
//import "github.com/Arachnid/solidity-stringutils/strings.sol";
 
contract SparkLottery is usingOraclize {
 //using strings for *;
 address public player;
 address public manager;
 uint public lottery_entry_amount; //minimum of equal lottery amount
 string public random_result;
 
 event LogPriceUpdated(string price);
 event LogNewOraclizeQuery(string description);
 
 constructor(uint minimum) public {
   manager = msg.sender; //deployer is manager //can we hardcode this address?
   lottery_entry_amount = minimum;
 }
 
 modifier restricted() {
   require(msg.sender == manager, "Not Authorised");
   _;
 }
 
 // to check contract balance
 function checkLotteryBalance() public restricted view returns(uint) {
   return address(this).balance;
 }
 // manager has to deposit eth to make payments to players
 function depositIntoContract() public payable restricted {
 }
 
 function withdrawFromContract() public restricted {
   // dont close contract without transfering eth into manager
   manager.transfer(address(this).balance);
 }
 
 function enter() public payable returns(string) {
   // string[] memory winning;  //empty variable for new player
   require(msg.value > lottery_entry_amount, "Enter minimum eth value");
   player = msg.sender;
   random_result = "";
   if (oraclize_getPrice("URL") > this.balance) {
     LogNewOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
   }
   else {
     LogNewOraclizeQuery("Oraclize query was sent, standing by for the answer..");
     oraclize_query("URL", "json(https://api.random.org/json-rpc/1/invoke).result.random.data", '\n{"jsonrpc":"2.0","method":"generateSignedIntegers","params":{"apiKey":"f78218a1-740b-4757-a009-14bb6f2d8afe","n":6,"min":1,"max":49,"replacement":false,"base":10},"id":10590}');
   }
   return random_result;
 }
 
 function __callback(bytes32 myid, string result) {
   if (msg.sender != oraclize_cbAddress()) revert();
   random_result = result;
   LogPriceUpdated(result);
 }
 
 function payWinner(uint winning_amt) public restricted{
   require(winning_amt <= address(this).balance, "Insufficient funds in contract.");
   require(winning_amt > 0, "Won amount is empty");
   player.transfer(winning_amt);
 }
 
 /*
 // winning amount stored in wei
 if(white_hits == 2 )
   player_win_amt = 5000000000000000 ; //0.005 eth
 else if(white_hits == 3)
