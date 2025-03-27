const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

class Invoice {
    constructor(customerData, lineItems) {
        this.id = uuidv4();
        this.customerData = customerData;
        this.lineItems = lineItems;
        this.date = moment().format('YYYY-MM-DD');
        this.dueDate = moment().add(30, 'days').format('YYYY-MM-DD');
    }


    calculateTotal() {
        return this.lineItems.reduce((total, item) =>
            total + (item.quantity * item.unitPrice), 0);
    }

    getTaxAmount(taxRate = 0.08) {
        return this.calculateTotal() * taxRate;
    }

    getGrandTotal(taxRate = 0.08) {
        return this.calculateTotal() * (1 + taxRate);
    }
}

module.exports = Invoice;