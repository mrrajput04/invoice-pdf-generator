const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const brandingConfig = require('../config/company-branding');

class PDFGenerator {
  static generateInvoice(invoice) {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const outputPath = path.join(__dirname, `../../invoices/${invoice.id}.pdf`);
    
    // Create write stream
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Company Logo and Header
    doc.image(brandingConfig.logo, 50, 45, { width: 100 });
    
    doc
      .fillColor(brandingConfig.primaryColor)
      .fontSize(20)
      .text(brandingConfig.companyName, 200, 50, { align: 'right' });

    // Invoice Details
    doc
      .fontSize(10)
      .fillColor('#444444')
      .text(`Invoice #: ${invoice.id}`, 200, 80, { align: 'right' })
      .text(`Date: ${invoice.date}`, 200, 95, { align: 'right' })
      .text(`Due Date: ${invoice.dueDate}`, 200, 110, { align: 'right' });

    // Billing Information
    doc
      .fontSize(12)
      .text('Bill To:', 50, 150)
      .fontSize(10)
      .text(`${invoice.customerData.name}`, 50, 170)
      .text(`${invoice.customerData.address}`, 50, 185)
      .text(`${invoice.customerData.email}`, 50, 200);

    // Line Items Table
    const startY = 250;
    doc
      .fontSize(12)
      .text('Description', 50, startY)
      .text('Quantity', 300, startY)
      .text('Unit Price', 380, startY)
      .text('Total', 470, startY);

    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, startY + 20).lineTo(550, startY + 20).stroke();

    let lineItemY = startY + 40;
    invoice.lineItems.forEach((item, index) => {
      doc
        .fontSize(10)
        .text(item.description, 50, lineItemY)
        .text(item.quantity.toString(), 300, lineItemY)
        .text(`$${item.unitPrice.toFixed(2)}`, 380, lineItemY)
        .text(`$${(item.quantity * item.unitPrice).toFixed(2)}`, 470, lineItemY);
      
      lineItemY += 20;
    });

    // Totals
    const subtotal = invoice.calculateTotal();
    const tax = invoice.getTaxAmount();
    const total = invoice.getGrandTotal();

    doc
      .fontSize(12)
      .text('Subtotal:', 380, lineItemY + 20)
      .text(`$${subtotal.toFixed(2)}`, 470, lineItemY + 20)
      .text('Tax (8%):', 380, lineItemY + 40)
      .text(`$${tax.toFixed(2)}`, 470, lineItemY + 40)
      .text('Total:', 380, lineItemY + 60)
      .text(`$${total.toFixed(2)}`, 470, lineItemY + 60);

    // Footer
    doc
      .fontSize(8)
      .fillColor('#888888')
      .text(
        `${brandingConfig.contactInfo.address} | ` +
        `${brandingConfig.contactInfo.phone} | ` +
        `${brandingConfig.contactInfo.email}`, 
        50, 
        750, 
        { align: 'center' }
      );

    doc.end();
    return outputPath;
  }
}

module.exports = PDFGenerator;