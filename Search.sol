pragma solidity  >=0.4.24;

contract Search{
    struct hash{
        string id;
        string hashv;
    }
    
    mapping(string => hash) hashvalue;
    string[] public list;
     
    function set(string memory _id,string memory _hash) public{
        hashvalue[_hash]=hash(_id,_hash);
         list.push(_hash) -1;
    }
    
    function get(string memory val) view public returns (string memory){
        bool flag = false;
        for (uint i=0; i<list.length; i++){
         if(keccak256(abi.encode(val)) == keccak256(abi.encode(list[i])))
         {
          flag= true;
          break;
         }
         else
         {
         flag =false;
         }
        }
        if(flag==true)
            return (hashvalue[val].id);
        else 
            return ("Document not Verified");
    }
       
}
