pragma solidity ^0.4.13;
pragma experimental ABIEncoderV2;

contract College {
    address private owner; //will help in require statement part
    bytes32 public collegeName;

    modifier restricted() {
      if (msg.sender == owner) _;
    }

    function constuctor() public {
      owner = msg.sender;
    }

    struct Student {
        uint256 adhaar;
        bytes32 studentName;
        bytes32[] encryptedDocs;
    }

    //not sure if both are needed
    //Student[] studentList;
  

    mapping (uint256 => Student) public studentMap;

   // event StudentAdded(uint256 adhaar, bytes32 name); //triggers event to web interface

    function addStudent (uint256 adhaar, bytes32 name) public restricted {
        //require (msg.sender == owner);
        Student storage student;
        student.adhaar = adhaar;
        student.studentName = name;
       studentMap[adhaar]=student;
       // emit StudentAdded(adhaar, name); //trigger point
    }

   // event DocumentAdded (uint256 adhaar, string encryptedHash);

    function addDocument (uint256 adhaar, bytes32 encryptedHash) public {
        Student storage stu = studentMap[adhaar];
        stu.encryptedDocs.push(encryptedHash);
    }

    function returnDocs (uint256 adhaar) public returns (bytes32[]) {
        Student storage stu = studentMap[adhaar];
        return (stu.encryptedDocs);
    }
}
