const API_BASE_URL = 'http://localhost:3001';

/**
 * Generate PDF using Puppeteer server
 */
export async function generatePdfWithPuppeteer(htmlContent, filename = 'Carsure360_Vehicle_Report.pdf') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ htmlContent, filename }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Also open preview in new tab
    window.open(url, '_blank');

    return true;
  } catch (error) {
    console.error('Puppeteer PDF generation failed:', error);
    throw error;
  }
}

/**
 * Fallback: Generate PDF using html2canvas and jsPDF (client-side)
 */
export async function generatePdfClientSide(contentElement, filename = 'Carsure360_Vehicle_Report.pdf') {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const RENDER_SCALE = 2.5;
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  const MARGIN_MM = 10;
  const USABLE_WIDTH_MM = A4_WIDTH_MM - 2 * MARGIN_MM;
  const USABLE_HEIGHT_MM = A4_HEIGHT_MM - 2 * MARGIN_MM;

  // Wait for images
  const allImages = contentElement.querySelectorAll('img');
  await Promise.all(
    Array.from(allImages).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );

  await new Promise((resolve) => setTimeout(resolve, 500));

  const canvas = await html2canvas(contentElement, {
    scale: RENDER_SCALE,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 30000,
  });

  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const pageHeightInCanvasPixels = (canvasWidth / USABLE_WIDTH_MM) * USABLE_HEIGHT_MM;

  let position = 0;
  let pageCount = 0;

  while (position < canvasHeight) {
    pageCount++;
    if (pageCount > 1) pdf.addPage();

    const sliceHeight = Math.min(pageHeightInCanvasPixels, canvasHeight - position);

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvasWidth;
    pageCanvas.height = sliceHeight;
    const pageCtx = pageCanvas.getContext('2d');
    pageCtx.imageSmoothingEnabled = true;
    pageCtx.imageSmoothingQuality = 'high';
    pageCtx.drawImage(canvas, 0, position, canvasWidth, sliceHeight, 0, 0, canvasWidth, sliceHeight);

    const imageData = pageCanvas.toDataURL('image/png', 1.0);
    const sliceHeightMM = (sliceHeight / canvasWidth) * USABLE_WIDTH_MM;

    pdf.addImage(imageData, 'PNG', MARGIN_MM, MARGIN_MM, USABLE_WIDTH_MM, sliceHeightMM, '', 'FAST');

    position += sliceHeight;
  }

  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
  pdf.save(filename);

  return true;
}

/**
 * Generate PDF - tries Puppeteer first, falls back to client-side
 */
export async function generatePdf(contentElement, filename) {
  try {
    // Get HTML content for Puppeteer
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
          <style>
            ${document.querySelector('style')?.textContent || ''}
            body { font-family: 'Roboto', sans-serif; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${contentElement.outerHTML}
        </body>
      </html>
    `;

    await generatePdfWithPuppeteer(htmlContent, filename);
    return true;
  } catch (error) {
    console.warn('Puppeteer PDF failed, falling back to client-side:', error);
    return generatePdfClientSide(contentElement, filename);
  }
}
