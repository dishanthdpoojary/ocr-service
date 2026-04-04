const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// Multer setup
const upload = multer({ dest: 'uploads/' });

// OCR API
app.post('/scan', upload.single('image'), async (req, res) => {
  try {
    console.log("📩 Request received");

    // ✅ Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📁 File received:", req.file);

    // ✅ Read image as buffer
    const imageBuffer = fs.readFileSync(req.file.path);

    // ✅ OCR processing
    const result = await Tesseract.recognize(imageBuffer, 'eng');
    const text = result.data.text;

    console.log("🧠 OCR Result:\n", text);

    // 🔍 Extract useful data
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);

    // Extract merchant (usually first non-empty line)
    const merchant = lines[0] || null;

    // Amount - more flexible pattern (with or without $ symbol)
    let amount = null;
    const amountPatterns = [
      /(?:total|subtotal|amount|due)[\s:]*\$?([\d,]+\.?\d{0,2})/i,
      /^\s*\$?([\d,]+\.?\d{0,2})\s*$/m,
      /(?:total|subtotal).*?(\d+\.\d{2})/i
    ];
    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = match[1].replace(/,/g, '');
        break;
      }
    }

    // Date - handle multiple formats
    let date = null;
    const datePatterns = [
      /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/,  // dd/mm/yyyy or variants
      /\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/,    // yyyy/mm/dd
      /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}[,\s]+\d{4}/i
    ];
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        date = match[0];
        break;
      }
    }

    // 🛒 Extract line items (item name and price)
    const items = [];
    lines.forEach(line => {
      // Match lines with a price at the end (e.g., "ITEM NAME CODE 45.00")
      const priceMatch = line.match(/^(.+?)\s+([\d,]+\.?\d{0,2})\s*$/);
      if (priceMatch) {
        let itemText = priceMatch[1].trim();
        const price = priceMatch[2].replace(/,/g, '');
        
        // Remove leading quantity numbers (e.g., "1 TURKEY BURGER" -> "TURKEY BURGER")
        itemText = itemText.replace(/^\d+\s+/, '').trim();
        
        // Remove item code (last word with alphanumerics) from item name
        // e.g., "OIL CHANGE OC201" -> "OIL CHANGE", "ALIGNMENT ~ WA105" -> "ALIGNMENT"
        const itemParts = itemText.split(/\s+/);
        const lastPart = itemParts[itemParts.length - 1];
        
        // Check if last part looks like a code (contains letters/numbers and is alphanumeric only)
        if (/^[A-Z0-9]{2,}$/.test(lastPart) && lastPart.length <= 5) {
          itemParts.pop(); // Remove the code
          itemText = itemParts.join(' ').replace(/~+/g, '').trim(); // Also remove tilde separators
        }
        
        // Skip common non-item lines and lines that are just numbers or very short
        if (!itemText.toLowerCase().match(/^(total|subtotal|tax|amount|due|change|no|qty)$/i) && itemText.length > 2) {
          items.push({
            item: itemText,
            price: price
          });
        }
      }
    });

    // ✅ Send structured response with merchant, total, and items
    res.json({
      merchant,
      total: amount,
      items
    });

    // 🧹 Optional: delete file after processing
    fs.unlinkSync(req.file.path);

  } catch (err) {
    console.error("❌ OCR ERROR:", err);
    res.status(500).json({ error: "OCR failed" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});