import { jsPDF } from 'jspdf';

/**
 * ✅ Sanitize text by:
 * - Removing non-ASCII characters
 * - Stripping markdown (**bold**)
 * - Normalizing Unicode
 */
const sanitizeContent = (text: string) => {
  return text
    .normalize('NFKD')                // Unicode normalization
    .replace(/[^\x00-\x7F]/g, '')     // Remove non-ASCII characters
    .replace(/\*\*/g, '')             // Remove '**' used for bold
    .replace(/_/g, '');               // Remove underscores if any
};

const downloadAsPDF = (content: string, title: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxLineWidth = pageWidth - margin * 2;
  const lineHeight = 8;

  // ✅ Sanitize content before adding
  const cleanContent = sanitizeContent(content);
  const lines = doc.splitTextToSize(cleanContent, maxLineWidth);

  let cursorY = margin;
  doc.setFont('helvetica', 'normal'); // ✅ Use Helvetica for UTF-8 support
  doc.setFontSize(12);

  lines.forEach((line: string) => {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(line, margin, cursorY, { maxWidth: maxLineWidth });
    cursorY += lineHeight;
  });

  doc.save(`${title}.pdf`);
};

export default downloadAsPDF;
