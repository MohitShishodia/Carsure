require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const evaluationsRouter = require('./routes/evaluations');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3002;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ============================================================
// BROWSER POOL - Reuse browser instance for faster PDF generation
// ============================================================
let browserInstance = null;
let browserLaunchPromise = null;
const BROWSER_TIMEOUT = 5 * 60 * 1000; // 5 minutes idle timeout
let browserIdleTimer = null;

async function getBrowser() {
  // If browser exists and is connected, reuse it
  if (browserInstance && browserInstance.isConnected()) {
    resetBrowserIdleTimer();
    return browserInstance;
  }
  
  // If browser is being launched, wait for it
  if (browserLaunchPromise) {
    return browserLaunchPromise;
  }
  
  // Launch new browser
  browserLaunchPromise = launchBrowser();
  try {
    browserInstance = await browserLaunchPromise;
    resetBrowserIdleTimer();
    return browserInstance;
  } finally {
    browserLaunchPromise = null;
  }
}

async function launchBrowser() {
  console.log('🚀 Launching browser...');
  
  let puppeteer, launchOptions;
  
  if (IS_PRODUCTION) {
    // Production: Use @sparticuz/chromium for serverless
    puppeteer = require('puppeteer-core');
    const chromium = require('@sparticuz/chromium');
    chromium.setHeadlessMode = true;
    chromium.setGraphicsMode = false;
    
    launchOptions = {
      args: chromium.args,
      defaultViewport: { width: 1024, height: 768, deviceScaleFactor: 1.5 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    };
  } else {
    // Local development: Use regular puppeteer (faster!)
    try {
      puppeteer = require('puppeteer');
    } catch {
      // Fallback to puppeteer-core if puppeteer not installed
      puppeteer = require('puppeteer-core');
      const chromium = require('@sparticuz/chromium');
      launchOptions = {
        args: chromium.args,
        defaultViewport: { width: 1024, height: 768, deviceScaleFactor: 1.5 },
        executablePath: await chromium.executablePath(),
        headless: true,
      };
    }
    
    if (!launchOptions) {
      launchOptions = {
        headless: true,
        defaultViewport: { width: 1024, height: 768, deviceScaleFactor: 1.5 },
        args: [
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      };
    }
  }
  
  const browser = await puppeteer.launch(launchOptions);
  console.log('✅ Browser ready!');
  return browser;
}

function resetBrowserIdleTimer() {
  if (browserIdleTimer) {
    clearTimeout(browserIdleTimer);
  }
  browserIdleTimer = setTimeout(async () => {
    if (browserInstance) {
      console.log('⏰ Closing idle browser...');
      try {
        await browserInstance.close();
      } catch {}
      browserInstance = null;
    }
  }, BROWSER_TIMEOUT);
}

// ============================================================
// Middleware
// ============================================================
app.use(cors({
  origin: ['https://carsure-iota.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/evaluations', evaluationsRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    browserReady: browserInstance?.isConnected() || false,
    environment: IS_PRODUCTION ? 'production' : 'development',
    timestamp: new Date().toISOString() 
  });
});

// ============================================================
// OPTIMIZED PDF Generation endpoint
// ============================================================
app.post('/api/generate-pdf', async (req, res) => {
  const { htmlContent, filename = 'Carsure360_Vehicle_Report.pdf' } = req.body;
  const startTime = Date.now();

  if (!htmlContent) {
    return res.status(400).json({ error: 'HTML content is required' });
  }

  let page = null;

  try {
    console.log('📄 Starting PDF generation...');
    
    // Get reusable browser instance
    const browser = await getBrowser();
    
    // Create new page
    page = await browser.newPage();

    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for images with shorter timeout
    await page.evaluate(async () => {
      const images = document.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 3000); // 3 second timeout per image
          });
        })
      );
    });

    // Minimal layout wait
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('⚡ Generating PDF...');
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

    const duration = Date.now() - startTime;
    console.log(`✅ PDF generated: ${(pdfBuffer.length / 1024).toFixed(1)}KB in ${duration}ms`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.end(pdfBuffer, 'binary');

  } catch (error) {
    console.error('❌ PDF generation error:', error.message);
    
    // If browser crashed, reset it
    if (error.message.includes('Target closed') || error.message.includes('Session closed')) {
      browserInstance = null;
    }
    
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  } finally {
    // Close page but keep browser alive
    if (page) {
      try { await page.close(); } catch {}
    }
  }
});

// Generate PDF from URL
app.post('/api/generate-pdf-from-url', async (req, res) => {
  const { url, filename = 'Carsure360_Vehicle_Report.pdf' } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let page = null;

  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    await new Promise(resolve => setTimeout(resolve, 500));

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
    if (page) {
      try { await page.close(); } catch {}
    }
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  if (browserInstance) {
    await browserInstance.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PDF Server running on http://localhost:${PORT}`);
  console.log(`   Network: http://192.168.1.13:${PORT}`);
  console.log(`   Mode: ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`   ⚡ Optimized with browser pooling`);
});

