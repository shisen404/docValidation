pragma solidity ^0.4.13;

contract Driver {

 uint public CollegeID;
 string public collegename;


struct Student {
  uint256 adhaar;
  string studentName;
  string[]  encryptedDocs;
}

mapping(uint256 => Student) StudentList;

function addDocument(uint256 adhaar,string _encrypted_hash) public {
  require(msg.sender==owner);
  Student  student = StudentList[_adhaar];
  student.encryptedDocs[student.encryptedDocs.length+1]=_encrypted_hash;
}





function addStudent(uint256 _adhaar,string _name){
require(msg.sender==owner);
  Student memory student = Student(_adhaar,_name);
  StudentList[_adhaar]=student;
}


function sendDoc(uint256 _adhaar) returns (string[])  {
  require(msg.sender==owner);
  Student  student = StudenList[_adhaar];
  return (student.encryptedDocs);

}
}