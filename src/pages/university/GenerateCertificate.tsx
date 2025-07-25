import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { FileCheck, Loader2, AlertCircle, CheckCircle, Eye, Shield } from 'lucide-react';
import { issueCertificateOnBlockchain } from '../../lib/blockchain';
import { authService } from '../../lib/auth';
import { generateCertificatePDF } from '../../lib/pdfGenerator';
import { Link } from 'react-router-dom';
import { useBlockchain } from '../../hooks/useBlockchain';

const GenerateCertificate = () => {
  const { contract } = useBlockchain();
  const [students, setStudents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    student_id: '',
    course: '',
    grade: 'A',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const user = authService.getCurrentUser();
  const universityData = user?.data as any;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('university_id', user.id)
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setError("Blockchain is not connected. Please make sure MetaMask is installed and connected.");
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    setTxHash(null);

    try {
      const selectedStudent = students.find(s => s.id === formData.student_id);
      if (!selectedStudent) throw new Error('Please select a student');

      const { certificateId, transactionHash } = await issueCertificateOnBlockchain(
        contract,
        selectedStudent.roll_number,
        selectedStudent.name,
        formData.course,
        universityData.name,
        formData.grade
      );

      const certificateData = {
        certificate_id: certificateId,
        student_id: selectedStudent.roll_number,
        student_name: selectedStudent.name,
        course: formData.course,
        grade: formData.grade,
        university: universityData.name,
        university_id: user?.id,
        student_uuid: formData.student_id,
        blockchain_verified: true,
        blockchain_tx_hash: transactionHash,
        created_at: new Date().toISOString(),
      };

      const { error: dbError } = await supabase.from('certificates').insert(certificateData);
      if (dbError) throw dbError;

      setSuccess('Certificate successfully generated and registered on the blockchain!');
      setTxHash(transactionHash);

      const pdf = await generateCertificatePDF(certificateData);
      const pdfBlob = pdf.output('blob');
      const previewUrl = URL.createObjectURL(pdfBlob);
      setPreviewUrl(previewUrl);

    } catch (error: any) {
      setError(error.message || 'Failed to generate certificate');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {!previewUrl ? (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <FileCheck className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Generate Certificate</h1>
          </div>
          <form onSubmit={handleGenerateCertificate} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">Student *</label>
                <select id="student_id" value={formData.student_id} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required>
                  <option value="">Select a student</option>
                  {students.map((student) => (<option key={student.id} value={student.id}>{student.name} ({student.roll_number})</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course *</label>
                <input type="text" id="course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required />
              </div>
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade *</label>
                <select id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" required>
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="B-">B-</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="C-">C-</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                  <option value="Distinction">Distinction</option>
                  <option value="Merit">Merit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {submitting ? (<><Loader2 className="animate-spin h-5 w-5 mr-2" />Generating...</>) : (<><Eye className="h-5 w-5 mr-2" />Preview & Generate</>)}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}
          {txHash && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">Transaction Hash:</span>
              </div>
              <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                {txHash}
              </a>
            </div>
          )}
          <div className="aspect-[1.414] w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <iframe src={previewUrl} className="w-full h-full" title="Certificate Preview" />
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button onClick={() => { setPreviewUrl(null); setSuccess(''); setError(''); setFormData({student_id: '', course: '', grade: 'A'}); }} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">Generate Another</button>
            <Link to="/university/certificates" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">View All Certificates</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateCertificate;