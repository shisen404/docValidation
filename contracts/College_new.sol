pragma solidity ^0.4.13;
//pragma experimental ABIEncoderV2;

contract College {
    address private owner; //will help in require statement part
    string public collegeName;

    modifier restricted() {
      if (msg.sender == owner) _;
    }

    function constuctor() public {
      owner = msg.sender;
    }

    struct Student {
        uint256 adhaar;
        string studentName;
        bytes32[] encryptedDocs;
    }

    //not sure if both are needed
    //Student[] studentList;
  

    mapping (uint256 => Student) public studentMap;

   // event StudentAdded(uint256 adhaar, string name); //triggers event to web interface

    function addStudent (uint256 _adhaar, string _name) public restricted {
        //require (msg.sender == owner);
        Student memory student ;// Student(adhaar, name, new bytes32[](0));
        student.adhaar=_adhaar;
        student.studentName=_name;
       studentMap[_adhaar]=student;
       // emit StudentAdded(adhaar, name); //trigger point
    }

   // event DocumentAdded (uint256 adhaar, string encryptedHash);

    function addDocument (uint256 adhaar, bytes32 encryptedHash) public restricted {
        //require (msg.sender == owner);
        Student storage stu = studentMap[adhaar];
        stu.encryptedDocs[stu.encryptedDocs.length+1]=encryptedHash;
    //    studentMap[adhaar]=stu;
       // DocumentAdded(adhaar, encryptedHash); //trigger point
    }

    function returnDocs (uint256 adhaar) public returns (bytes32[]) {
        // not sure if require is needed Token based stuff
        Student storage stu = studentMap[adhaar];
        return (stu.encryptedDocs);
    }
}
