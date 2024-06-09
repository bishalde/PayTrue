const express = require('express');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const Transaction = require('../models/transactionModel');

const router = express.Router();

router.use('/data', express.static(path.join(__dirname, '..', 'data')));

router.post('/', async (req, res) => {
    const { uid } = req.body;

    try {
        const transactions = await Transaction.find({ uid });
        const monthlySummary = getSummary(transactions, 'month');
        const sixMonthlySummary = getSummary(transactions, '6-month');
        const yearlySummary = getSummary(transactions, 'year');

        const doc = new PDFDocument({ margin: 40 });
        const fileName = `tx${uid}.pdf`;
        const filePath = path.join(__dirname, '..', 'data', fileName);

        if (!fs.existsSync(path.join(__dirname, '..', 'data'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'data'));
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add content to PDF
        addCoverPage(doc, uid);
        addTransactionTable(doc, transactions);
        addSummaryDetails(doc, 'Monthly Summary', monthlySummary);
        addSummaryDetails(doc, '6-Month Summary', sixMonthlySummary);
        addSummaryDetails(doc, 'Yearly Summary', yearlySummary);

        // Finalize the PDF and end the stream
        doc.end();

        writeStream.on('finish', () => {
            res.status(201).json({ message: 'PDF generated successfully', url: fileName });
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

function addCoverPage(doc, uid) {
    doc.fontSize(28).fillColor('#003366').text('Transaction Summary Report', {  
        align: 'center',
        underline: true
    }).moveDown(2);

    doc.fontSize(16).fillColor('#003366').text(`Generated for User ID: ${uid}`, {
        align: 'center'
    }).moveDown(2);
 
    doc.fontSize(14).fillColor('#003366').text(`Report Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, {
        align: 'center'
    }).moveDown(2);

    // const logoPath = path.join(__dirname, 'logo.png');
    // if (fs.existsSync(logoPath)) {
    //     doc.image(logoPath, (doc.page.width - 100) / 2, doc.y, { width: 100 }).moveDown(2);
    // }

    doc.fontSize(30).fillColor('#003366').text(`PayTrue`, {
        align: 'center'
    }).moveDown(8);

    
    doc.moveDown(2);
    doc.addPage();
}

function addTransactionTable(doc, transactions) {
    doc.fontSize(18).fillColor('#003366').text('Transaction Details', { underline: true }).moveDown();

    const tableTop = doc.y;
    const tableLeft = 40;
    const rowHeight = 40;
    const colWidth = 100;
    const headerHeight = 25;

    const headers = ['Date', 'Type', 'Amount', 'Category', 'Description'];

    doc.lineWidth(2);
    doc.lineCap('butt')
       .moveTo(tableLeft, tableTop)
       .lineTo(tableLeft + colWidth * headers.length, tableTop)
       .stroke();

    doc.font('Helvetica-Bold').fontSize(12).fillColor('#FFFFFF');
    headers.forEach((header, i) => {
        doc.fillColor('#003366').rect(tableLeft + colWidth * i, tableTop, colWidth, headerHeight).fill();
        doc.fillColor('#FFFFFF').text(header, tableLeft + colWidth * i + 5, tableTop + 8);
    });

    doc.font('Helvetica').fontSize(10).fillColor('black');
    transactions.forEach((transaction, index) => {
        const rowIndex = index + 1;
        const rowY = tableTop + headerHeight + rowHeight * rowIndex;
        doc.fillColor(index % 2 === 0 ? '#F0F0F0' : '#FFFFFF')
           .rect(tableLeft, rowY, colWidth * headers.length, rowHeight)
           .fill();

        doc.fillColor('black').text(moment(transaction.date).format('YYYY-MM-DD'), tableLeft + colWidth * 0 + 5, rowY + 5);
        doc.text(transaction.type, tableLeft + colWidth * 1 + 5, rowY + 5);
        doc.text(transaction.amount.toString(), tableLeft + colWidth * 2 + 5, rowY + 5);
        doc.text(transaction.category || '-', tableLeft + colWidth * 3 + 5, rowY + 5);
        doc.text(transaction.description || '-', tableLeft + colWidth * 4 + 5, rowY + 5);
    });

    doc.moveDown(2);
}

function addSummaryDetails(doc, title, summary) {
    doc.fontSize(18).fillColor('#003366').text(title, { underline: true }).moveDown();

    doc.fontSize(12).fillColor('black');
    for (const [key, value] of Object.entries(summary)) {
        doc.fontSize(14).fillColor('#003366').text(`${key}:`, { continued: true }).moveDown(0.5);
        doc.fontSize(12).fillColor('black').text(` Total Debit: ${value.debit} | Total Credit: ${value.credit}`).moveDown(1);
    }
}

module.exports = router;
