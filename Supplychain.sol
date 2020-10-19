 pragma solidity >=0.4.0 <0.7.0;

contract Supplychain {
    uint public diamondCount = 0;
    uint public userCount =0;
    mapping(uint => User) public user;
    mapping(string => User) public users;
    mapping(uint => Diamond) public diamonds;
    struct Diamond {
        uint id;
        string name;
        uint weight;
        uint clarity;
        string logistic;
        string consumer;
        string producer;
        bool accepted;
        bool shipped;
        bool delivered;
    }
    
    struct User {
        string name;
        string email;
        string password;
        string role;
    }
   
   function createUser(string memory _name,string memory _email, string memory _password, string memory _role) public {
       require(bytes(_name).length>0);
       require(bytes(_email).length>0);
       require(bytes(_password).length>0);
       require(bytes(_role).length>0);
       userCount++;
       user[userCount]=User(_name,_email,_password,_role);
       users[_email]= User(_name,_email,_password,_role);
   }
   
    function createDiamond(string memory _name,uint _weight, uint _clarity, string memory _logistic,string memory _consumer, string memory _producer ) public {
        require(bytes(_name).length > 0);
        require(bytes(_logistic).length > 0);
        require(_weight > 0);
        diamondCount ++;
        diamonds[diamondCount] =Diamond(diamondCount, _name,_weight,_clarity,_logistic,_consumer,_producer,false,false,false);
     }
     
   function acceptDiamond(uint _id,string memory _logistic) public {
    Diamond memory _diamond = diamonds[_id];
     require(_diamond.id > 0 && _diamond.id <= diamondCount);
    require(!_diamond.accepted);
    require(!_diamond.shipped);
     require(keccak256(abi.encodePacked((_logistic))) == keccak256(abi.encodePacked((_diamond.logistic))));
    _diamond.accepted = true;
     diamonds[_id] = _diamond;
 }
 function shippedDiamond(uint _id,string memory _logistic) public {
    Diamond memory _diamond = diamonds[_id];
     require(_diamond.id > 0 && _diamond.id <= diamondCount);
    require(_diamond.accepted);
    require(!_diamond.shipped);
     require(keccak256(abi.encodePacked((_logistic))) == keccak256(abi.encodePacked((_diamond.logistic))));
    _diamond.shipped = true;
     diamonds[_id] = _diamond;
 }
  function deliveredDiamond(uint _id, string memory _consumer) public {
    Diamond memory _diamond = diamonds[_id];
     require(_diamond.id > 0 && _diamond.id <= diamondCount);
    require(_diamond.accepted);
    require(_diamond.shipped);
    require(keccak256(abi.encodePacked((_consumer))) == keccak256(abi.encodePacked((_diamond.consumer))));
    require(!_diamond.delivered);
     _diamond.delivered = true;
     diamonds[_id] = _diamond;
 }
 
}