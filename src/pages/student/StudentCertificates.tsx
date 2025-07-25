import React, { useEffect, useState } from 'react';
import { Award, Download, Search, Loader2, Shield, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { authService } from '../../lib/auth';
import { generateCertificatePDF } from '../../lib/pdfGenerator';

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const user = authService.getCurrentUser();

  useEffect(() => {
    fetchStudentCertificates();
  }, []);

  const fetchStudentCertificates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          universities (name, email)
        `)
        .eq('student_uuid', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificate: any) => {
    try {
      setDownloadingId(certificate.certificate_id);
      const pdf = await generateCertificatePDF(certificate);
      pdf.save(`${certificate.student_name.replace(/\s+/g, '_')}_${certificate.course.replace(/\s+/g, '_')}_Certificate.pdf`);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      alert('Failed to download certificate. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.grade && cert.grade.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">All certificates issued to you</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-indigo-600" />
                  </div>
                  {certificate.blockchain_verified ? (
                    <div className="flex items-center text-green-600">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Blockchain Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Database Only</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{certificate.course}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Certificate ID:</span>
                    <span className="font-medium text-gray-900">{certificate.certificate_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Grade:</span>
                    <span className={`font-medium ${
                      certificate.grade?.startsWith('A') ? 'text-green-600' :
                      certificate.grade?.startsWith('B') ? 'text-blue-600' :
                      certificate.grade?.startsWith('C') ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {certificate.grade || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">University:</span>
                    <span className="font-medium text-gray-900">{certificate.universities?.name || certificate.university}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Issue Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(certificate.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => downloadCertificate(certificate)}
                  disabled={downloadingId === certificate.certificate_id}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {downloadingId === certificate.certificate_id ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No certificates found</p>
            <p className="text-sm text-gray-500 mt-1">
              Certificates issued by your university will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCertificates;