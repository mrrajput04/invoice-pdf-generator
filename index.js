const express = require('express');
const Invoice = require('./src/models/invoice');
const PDFGenerator = require('./src/services/pdf-generator');

const app = express();
app.use(express.json());

app.post('/generate-invoice', (req, res) => {
  try {
    const { customerData, lineItems } = req.body;
    const invoice = new Invoice(customerData, lineItems);
    const pdfPath = PDFGenerator.generateInvoice(invoice);
    
    res.json({
      message: 'Invoice generated successfully',
      invoiceId: invoice.id,
      pdfPath: pdfPath
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate invoice', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Invoice generation service running on port ${PORT}`);
});