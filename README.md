

**DECENTRALIZED CERTIFICATE MANAGEMENT SYSTEM (DCMS)**

**Blockchain-Based Certificate Issuance & Verification using Ethereum**

---

**OVERVIEW**

The Decentralized Certificate Management System (DCMS) is a blockchain-based platform built on the Ethereum network that enables secure issuance, storage, and verification of digital certificates.

This system eliminates certificate forgery, ensures tamper-proof validation, and provides transparent verification using smart contracts.

The project leverages:

* Ethereum Blockchain
* Smart Contracts (Solidity)
* Web3 Integration
* IPFS (for decentralized storage, if integrated)
* React / Vite Frontend



**KEY FEATURES**

* Tamper-proof certificate issuance
* Blockchain-generated unique certificate ID
* Instant certificate verification
* Decentralized and transparent architecture
* Role-based access (Admin / Issuer / Student)
* Smart contract-based validation
* IPFS integration for secure document storage (optional)


**SYSTEM ARCHITECTURE**

1. Admin/Issuer issues a certificate.
2. Certificate metadata is stored on blockchain via smart contract.
3. Certificate document is stored on IPFS.
4. A unique blockchain-based Certificate ID is generated.
5. Anyone can verify certificate authenticity using the Certificate ID.


**TECH STACK**

Frontend: React / Vite
Blockchain: Ethereum
Smart Contracts: Solidity
Wallet: MetaMask
Storage: IPFS 
Web3 Integration: Ethers.js / Web3.js


**INSTALLATION & SETUP**

Follow the steps below to run the project locally:

1. Clone the Repository

    git clone https://github.com/SudeepRedddy/Decentralised-Certificate-Management-System.git

2. Navigate to Project Directory

    cd Decentralised-Certificate-Management-System

3. Install Dependencies

    npm install

4. Run the Development Server

    npm run dev

    SERVER STATUS

    After running the above command:
    
    * The development server will start.
    * Open your browser and navigate to:
    
    [http://localhost:5173](http://localhost:5173)

(Note: Port may vary depending on your Vite configuration.)

---

**SMART CONTRACT DEPLOYMENT** 

1. Compile the Solidity smart contract.
2. Deploy using Remix IDE.
3. Update the deployed contract address in frontend configuration.
4. Connect MetaMask to testnet.


**CERTIFICATE WORKFLOW**

Issuing a Certificate:

* Issuer inputs student details.
* Smart contract stores certificate hash.
* Blockchain generates Certificate ID.

**Verifying a Certificate:**

* Enter Certificate ID.
* Smart contract validates and returns certificate metadata.
* Displays authenticity status.


**EXAMPLE USE CASES**

* University degree verification
* Internship certificate validation
* Government-issued credentials
* Professional certifications
* Skill-based blockchain credentials


**SECURITY BENEFITS**

* Immutable record storage
* No centralized database tampering
* Transparent public verification
* Eliminates fake certificate fraud
* Trustless validation model

---

PROJECT STRUCTURE (Example)

/contracts       → Solidity Smart Contracts
/src             → Frontend source files
/utils           → Web3 & blockchain utilities
