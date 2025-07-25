import React from 'react';
import { Link } from 'react-router-dom';
import { Award, FileCheck, Search, Shield, Building2 } from 'lucide-react';
import BlockchainStatus from '../components/BlockchainStatus';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Certify
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A secure and efficient platform for generating, verifying, and managing blockchain-secured academic certificates.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-12">
        <BlockchainStatus />
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Building2 className="h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">For Universities</h2>
          <p className="text-gray-600 mb-4">
            Register your university to issue and manage secure, blockchain-verified certificates for your students.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Now
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Search className="h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Verify Certificates</h2>
          <p className="text-gray-600 mb-4">
            Instantly verify the authenticity of any certificate issued through our platform using its unique ID.
          </p>
          <Link
            to="/verify"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verify Now
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <Award className="h-12 w-12 text-purple-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">For Students</h2>
          <p className="text-gray-600 mb-4">
            Log in to view, manage, and download all the academic certificates issued to you by your university.
          </p>
          <Link
            to="/login"
            className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Student Login
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-2xl font-bold mb-6">How Blockchain Verification Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <FileCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Certificate Creation</h3>
            <p className="text-gray-600">
              When a certificate is created, a unique hash is generated using the certificate data and stored on the Ethereum blockchain.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Blockchain Registration</h3>
            <p className="text-gray-600">
              The certificate is registered on the Ethereum blockchain using a smart contract, creating an immutable record.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <Search className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Verification</h3>
            <p className="text-gray-600">
              Anyone can verify a certificate by checking its ID against the blockchain record, ensuring authenticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;