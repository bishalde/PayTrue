const express = require('express');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const Transaction = require('../models/transactionModel');

const router = express.Router();

router.use('/data', express.static(path.join(__dirname, 'data')));

router.post('/', async (req, res) => {
    const { uid } = req.body;

    try {
        const transactions = await Transaction.find({ uid });
        const monthlySummary = getSummary(transactions, 'month');
        const sixMonthlySummary = getSummary(transactions, '6-month');
        const yearlySummary = getSummary(transactions, 'year');

        const doc = new PDFDocument();
        const fileName = `tx${uid}.pdf`;
        const filePath = path.join(__dirname, '..', 'data', fileName);

        if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'data'));
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add content to PDF
        doc.fontSize(16).text('Transaction Summary', { align: 'center' });
        doc.moveDown();

        addTransactionTable(doc, transactions);
        doc.addPage();

        addSummaryDetails(doc, 'Monthly Summary', monthlySummary);
        doc.addPage();

        addSummaryDetails(doc, '6-Month Summary', sixMonthlySummary);
        doc.addPage();

        addSummaryDetails(doc, 'Yearly Summary', yearlySummary);

        // Finalize the PDF and end the stream
        doc.end();

        writeStream.on('finish', () => {
            const fileUrl = `http://localhost:3000/data/${fileName}`;
            res.status(200).json({ message: 'PDF generated successfully', url: fileUrl });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

function getSummary(transactions, period) {
    const summary = {};
    transactions.forEach(transaction => {
        let key;
        if (period === 'month') {
            key = moment(transaction.date).format('YYYY-MM');
        } else if (period === '6-month') {
            key = moment(transaction.date).format('YYYY') + '-H' + (Math.ceil((moment(transaction.date).month() + 1) / 6));
        } else if (period === 'year') {
            key = moment(transaction.date).format('YYYY');
        }

        if (!summary[key]) {
            summary[key] = { debit: 0, credit: 0 };
        }

        if (transaction.type === 'debit') {
            summary[key].debit += transaction.amount;
        } else {
            summary[key].credit += transaction.amount;
        }
    });
    return summary;
}

function addTransactionTable(doc, transactions) {
    doc.fontSize(18).text('Transaction Details', { underline: true }).moveDown();

    const tableTop = doc.y + 20;
    const tableLeft = 50;
    const rowHeight = 30;
    const colWidth = 100;
    const headerHeight = 50;

    const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];

    doc.lineWidth(0);
    doc.lineCap('butt')
       .moveTo(tableLeft, tableTop)
       .lineTo(tableLeft + colWidth * headers.length, tableTop)
       .stroke();

    doc.font('Helvetica-Bold').fontSize(14);
    headers.forEach((header, i) => {
        doc.text(header, tableLeft + colWidth * i, tableTop + 10);
    });

    doc.font('Helvetica').fontSize(12);
    transactions.forEach((transaction, index) => {
        const rowIndex = index + 1;
        doc.text(moment(transaction.date).format('YYYY-MM-DD'), tableLeft + colWidth * 0, tableTop + headerHeight + rowHeight * rowIndex);
        doc.text(transaction.type, tableLeft + colWidth * 1, tableTop + headerHeight + rowHeight * rowIndex);
        doc.text(transaction.amount.toString(), tableLeft + colWidth * 2, tableTop + headerHeight + rowHeight * rowIndex);
        doc.text(transaction.category || '-', tableLeft + colWidth * 3, tableTop + headerHeight + rowHeight * rowIndex);
        doc.text(transaction.description || '-', tableLeft + colWidth * 4, tableTop + headerHeight + rowHeight * rowIndex);
    });

    doc.moveTo(tableLeft, tableTop + headerHeight)
       .lineTo(tableLeft, tableTop + headerHeight + rowHeight * (transactions.length + 1))
       .stroke();

    for (let i = 0; i <= headers.length; i++) {
        doc.moveTo(tableLeft + colWidth * i, tableTop + headerHeight)
           .lineTo(tableLeft + colWidth * i, tableTop + headerHeight + rowHeight * (transactions.length + 1))
           .stroke();
    }

    // Move cursor to the bottom of the table
    doc.moveDown(transactions.length + 1);
}

function addSummaryDetails(doc, title, summary) {
    doc.fontSize(18).text(title, { underline: true }).moveDown();

    for (const [key, value] of Object.entries(summary)) {
        doc.fontSize(14).text(`${key}:`).moveDown();
        doc.fontSize(12).text(`Total Debit: ${value.debit}`).moveDown();
        doc.text(`Total Credit: ${value.credit}`).moveDown();
    }
}

module.exports = router;
