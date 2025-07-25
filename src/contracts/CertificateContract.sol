// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CertificateContract {
    address public owner;

    struct Certificate {
        bytes32 certificateId;
        string studentId;
        string studentName;
        string course;
        string university;
        string grade;
        uint256 timestamp;
        address issuer;
        bool exists;
    }
    
    mapping(bytes32 => Certificate) public certificates;
    
    event CertificateIssued(
        bytes32 indexed certificateId,
        address indexed issuer,
        string studentId,
        string studentName,
        string course,
        string university,
        string grade,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }
    
    function issueCertificate(
        string memory studentId,
        string memory studentName,
        string memory course,
        string memory university,
        string memory grade
    ) public {
        bytes32 certificateId = generateCertificateId(studentId, course, university);
        require(!certificates[certificateId].exists, "Certificate already exists");
        
        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            studentId: studentId,
            studentName: studentName,
            course: course,
            university: university,
            grade: grade,
            timestamp: block.timestamp,
            issuer: msg.sender,
            exists: true
        });

        emit CertificateIssued(
            certificateId,
            msg.sender,
            studentId,
            studentName,
            course,
            university,
            grade,
            block.timestamp
        );
    }

    function generateCertificateId(string memory studentId, string memory course, string memory university) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(studentId, course, university, block.timestamp));
    }
    
    function getCertificate(bytes32 certificateId) public view returns (Certificate memory) {
        require(certificates[certificateId].exists, "Certificate does not exist");
        return certificates[certificateId];
    }
}