import { ethers } from 'ethers';

export const certificateContractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "certificateId",
				"type": "bytes32"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "university",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "grade",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "certificates",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "certificateId",
				"type": "bytes32"
			},
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "university",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "grade",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "university",
				"type": "string"
			}
		],
		"name": "generateCertificateId",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "certificateId",
				"type": "bytes32"
			}
		],
		"name": "getCertificate",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bytes32",
						"name": "certificateId",
						"type": "bytes32"
					},
					{
						"internalType": "string",
						"name": "studentId",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "studentName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "course",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "university",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "grade",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "issuer",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "exists",
						"type": "bool"
					}
				],
				"internalType": "struct CertificateContract.Certificate",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "university",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "grade",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const CONTRACT_ADDRESS = '0xYourDeployedContractAddress'; // Replace with your new contract address

export const issueCertificateOnBlockchain = async (
  contract: ethers.Contract,
  studentId: string,
  studentName: string,
  course: string,
  university: string,
  grade: string
): Promise<{ certificateId: string, transactionHash: string }> => {
  const tx = await contract.issueCertificate(studentId, studentName, course, university, grade);
  const receipt = await tx.wait();
  
  const event = receipt.logs?.find((log: any) => log.fragment && log.fragment.name === 'CertificateIssued');

  if (!event) {
    throw new Error('Certificate issuance event not found in transaction receipt.');
  }

  const certificateId = event.args[0];
  return { certificateId, transactionHash: receipt.transactionHash };
};

export const verifyCertificateOnBlockchain = async (
  contract: ethers.Contract,
  certificateId: string
): Promise<any> => {
  const certificateData = await contract.getCertificate(certificateId);
  if (!certificateData || !certificateData.exists) {
    return null;
  }
  return certificateData;
};

export const isValidCertificateId = (certificateId: string): boolean => {
    return ethers.isHexString(certificateId) && certificateId.length === 66;
};