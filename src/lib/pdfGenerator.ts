import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

export const generateCertificatePDF = async (certificate: any) => {
  try {
    const qrData = `
      Certificate ID: ${certificate.certificate_id}
      Student: ${certificate.student_name}
      Course: ${certificate.course}
      Grade: ${certificate.grade}
      University: ${certificate.university}
    `;

    const qrCodeDataUrl = await QRCode.toDataURL(qrData);
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(248, 250, 252);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    pdf.setDrawColor(79, 70, 229);
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);
    pdf.setDrawColor(165, 180, 252);
    pdf.setLineWidth(0.5);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Set a default font. jsPDF defaults to 'helvetica'.
    pdf.setFont('helvetica');

    // University Name
    pdf.setFontSize(22);
    pdf.setTextColor(55, 65, 81);
    pdf.setFontStyle('bold'); // Corrected
    pdf.text(certificate.university, pageWidth / 2, 35, { align: 'center' });

    // Certificate Title
    pdf.setFontSize(40);
    pdf.setTextColor(79, 70, 229);
    pdf.setFontStyle('bold'); // Corrected
    pdf.text('CERTIFICATE', pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(18);
    pdf.setTextColor(55, 65, 81);
    pdf.setFontStyle('normal'); // Corrected
    pdf.text('OF ACHIEVEMENT', pageWidth / 2, 72, { align: 'center' });

    // Content
    const contentY = 100;
    pdf.setFontSize(16);
    pdf.text('This is to certify that', pageWidth / 2, contentY, { align: 'center' });

    pdf.setFontSize(36);
    pdf.setTextColor(79, 70, 229);
    pdf.setFontStyle('bold'); // Corrected
    pdf.text(certificate.student_name, pageWidth / 2, contentY + 18, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setTextColor(55, 65, 81);
    pdf.setFontStyle('normal'); // Corrected
    pdf.text('has successfully completed the course', pageWidth / 2, contentY + 30, { align: 'center' });

    pdf.setFontSize(28);
    pdf.setTextColor(79, 70, 229);
    pdf.setFontStyle('bold'); // Corrected
    pdf.text(certificate.course, pageWidth / 2, contentY + 45, { align: 'center' });

    pdf.setFontSize(18);
    pdf.setTextColor(16, 185, 129);
    pdf.setFontStyle('bold'); // Corrected
    pdf.text(`Grade: ${certificate.grade}`, pageWidth / 2, contentY + 60, { align: 'center' });

    // Footer section
    const issueDate = new Date(certificate.created_at).toLocaleDateString('en-US', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    pdf.setFontSize(12);
    pdf.setFontStyle('normal'); // Reset font style for footer
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Issued on: ${issueDate}`, 20, pageHeight - 20);

    // QR Code
    const qrSize = 35;
    pdf.addImage(qrCodeDataUrl, 'PNG', pageWidth - 20 - qrSize, pageHeight - 20 - qrSize, qrSize, qrSize);

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};