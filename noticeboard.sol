pragma solidity ^0.4.23;
 
contract noticeboard
{
   struct Message
   {
       address creator;
       string subject;
       string message;
       uint time;
   }
 
   uint public current = 1;
   mapping(uint => Message) public messages;
 
   //uint[20] public topPosts;
   uint public feeToPost;
   address public owner;
   event MessagePosted(uint id);
 
   constructor() public
   {
       owner = msg.sender;
       feeToPost = 0;
       //minimumTip = 1;
   }
 
   modifier isOwner()
   {
       require(msg.sender == owner);
       _;
   }
 
   function postMessage(string sub, string message) public payable
   {
       require(msg.value >= feeToPost);
 
       messages[current] = Message(
       {
           creator: msg.sender,
           subject: sub,
           message: message,
           time: now
       });
       emit MessagePosted(current);
       current++;
   }
 
   function updateFeeToPost(uint _feeToPost) isOwner public
   {
       feeToPost = _feeToPost;
   }
 
   function withdraw() isOwner public
   {
       owner.transfer(address(this).balance);
   }
 
   function changeOwner(address _owner) isOwner public
   {
       owner = _owner;
   }
}
