require('dotenv').config();
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const path = require('path');

// Import routes
const evaluationsRouter = require('./routes/evaluations');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// PDF Generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  const { htmlContent, filename = 'Carsure360_Vehicle_Report.pdf' } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  let browser = null;

  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1024,
      height: 768,
      deviceScaleFactor: 2,
    });

    // Set content with longer timeout - use domcontentloaded for faster response with base64 images
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded',
      timeout: 120000, // 2 minutes timeout
    });

    // Wait for images to load with timeout
    await page.evaluate(async () => {
      const images = document.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
            // Timeout for individual image - 10 seconds
            setTimeout(resolve, 10000);
          });
        })
      );
    });

    // Additional wait for layout
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    console.log(`PDF generated: ${pdfBuffer.length} bytes`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Generate PDF from URL (alternative method)
app.post('/api/generate-pdf-from-url', async (req, res) => {
  const { url, filename = 'Carsure360_Vehicle_Report.pdf' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    await page.setViewport({
      width: 1024,
      height: 768,
      deviceScaleFactor: 2,
    });

    await page.goto(url, {
      waitUntil: ['networkidle0', 'load'],
      timeout: 30000,
    });

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Start server - bind to 0.0.0.0 for network access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Puppeteer PDF Server running on http://localhost:${PORT}`);
  console.log(`   Network access: http://192.168.1.13:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
