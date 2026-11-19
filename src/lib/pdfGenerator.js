import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportProposalToPdf(elementId, filename = 'Westmere_Proposal.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  // Create canvas from DOM element
  const canvas = await html2canvas(element, {
    scale: 2, // High resolution crisp text
    useCORS: true,
    logging: false,
    backgroundColor: '#FFFFFF',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Multi-page support if proposal exceeds 1 A4 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
