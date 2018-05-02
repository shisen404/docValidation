pragma solidity ^0.4.13;

contract College {
    address private owner; //will help in require statement part
    string public collegeName;

    modifier restricted() {
      if (msg.sender == owner) _;
    }

    function College() public {
      owner = msg.sender;
    }

    struct Student {
        uint256 adhaar;
        string studentName;
        //string[] encryptedDocs;
    }

    //not sure if both are needed
    Student[] studentList;
    mapping (uint256 => Student) studentMap;

    event StudentAdded(uint256 adhaar, string name); //triggers event to web interface

    function addStudent (uint256 adhaar, string name) public restricted {
        //require (msg.sender == owner);
        Student memory student = Student(adhaar, name);
        studentList.push(student);
        emit StudentAdded(adhaar, name); //trigger point
    }

    event DocumentAdded (uint256 adhaar, string encryptedHash);

    function addDocument (uint256 adhaar, string encryptedHash) public restricted {
        //require (msg.sender == owner);
        Student memory stu = studentMap[adhaar];
        stu.encryptedDocs.push(encryptedHash);
        DocumentAdded(adhaar, encryptedHash); //trigger point
    }

    function returnDocs (uint256 adhaar) public returns (string[]) {
        // not sure if require is needed Token based stuff
        Student memory stu = studentMap[adhaar];
        return (stu.encryptedDocs);
    }
}
