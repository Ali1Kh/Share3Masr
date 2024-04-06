import fs from "fs";
import PDFDocument from "pdfkit";

function createInvoice(invoice, path) {
  let doc = new PDFDocument({ size: "A5", margin: 50 });

  doc.registerFont("Simplified Arabic", "simpo.ttf");
  doc.registerFont("Simplified Arabic Bold", "simpbdo.ttf");
  doc.font("Simplified Arabic");

  doc.encoding = "UTF-8";

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Share3 Masr", 105, 45)
    .font("Helvetica")
    .fontSize(10)
    .text("Share3 Masr Delivery App", 200, 62, { align: "right" })
    .text("132 St.Obour", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .font("Simplified Arabic Bold")
    .text("الفاتورة", 50, 135, { align: "right" });

  generateHr(doc, 170);

  const customerInformationTop = 185;

  doc
    .fontSize(10)
    .font("Simplified Arabic Bold")
    .text(reverseText("الرقم المسلسل:"), 300, customerInformationTop, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(invoice.invoice_nr, 150, customerInformationTop, {
      align: "center",
    })
    .font("Simplified Arabic Bold")
    .text(reverseText("التاريخ:"), 300, customerInformationTop + 15, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(formatDate(new Date()), 150, customerInformationTop + 15, {
      align: "center",
    })
    .font("Simplified Arabic Bold")
    .text(reverseText("السعر الأجمالي:"), 300, customerInformationTop + 30, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(formatCurrency(invoice.total), 150, customerInformationTop + 30, {
      align: "center",
    })

    .font("Simplified Arabic Bold")
    .text(reverseText("أسم العميل:"), 150, customerInformationTop)
    .font("Simplified Arabic")
    .text(invoice.shipping.name, 50, customerInformationTop)
    .font("Simplified Arabic Bold")
    .text(reverseText("العنوان:"), 150, customerInformationTop + 15)
    .font("Simplified Arabic")
    .text(invoice.shipping.address, 50, customerInformationTop + 15)
    .font("Simplified Arabic Bold")
    .text(reverseText("رقم الهاتف:"), 150, customerInformationTop + 30)
    .font("Simplified Arabic")
    .text(invoice.shipping.phone, 50, customerInformationTop + 30)
    .moveDown();

  generateHr(doc, 237);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 270;

  doc.font("Simplified Arabic Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    reverseText("المجموع"),
    reverseText("العدد"),
    reverseText("السعر"),
    reverseText("سعر الأضافات"),
    reverseText("الأضافات"),
    reverseText("المطعم"),
    reverseText("الوصف"),
    reverseText("الأسم")
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Simplified Arabic");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      formatCurrency(item.productPrice * item.quantity),
      convertArNum(item.quantity),
      formatCurrency(item.productPrice),
      "3",
      "4",
      reverseText(item.productId.resturant.nameAR),
      reverseText(item.productId.descriptionAR),
      reverseText(item.productId.nameAR)
    );

    generateHr(doc, position + 20);
  }

  const orderPricePosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    orderPricePosition,
    formatCurrency(invoice.orderPrice),
    "",
    "",
    "",
    "",
    "",
    "",
    "السعر"
  );

  const deleveryFeesPosition = orderPricePosition + 20;
  generateTableRow(
    doc,
    deleveryFeesPosition,
    formatCurrency(invoice.deleveryFees),
    "",
    "",
    "",
    "",
    "",
    "",
    reverseText("خدمة التوصيل")
  );

  const totalPosition = deleveryFeesPosition + 25;
  doc.font("Simplified Arabic Bold");

  generateTableRow(
    doc,
    totalPosition,
    formatCurrency(invoice.total),
    "",
    "",
    "",
    "",
    "",
    "",
    "الأجمالي"
  );
  doc.font("Simplified Arabic");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Share3 Masr Delivery App ." + reverseText("شكرا لك على استخدام"),
      50,
      520,
      {
        align: "center",
        width: 500,
      }
    );
}

function generateTableRow(
  doc,
  y,
  total,
  price,
  quantity,
  extraPrice,
  extra,
  resturant,
  description,
  name
) {
  doc
    .fontSize(10)
    .text(total, 20, y)
    .text(quantity, 70, y)
    .text(price, 120, y)
    .text(extraPrice, 170, y)
    .text(extra, 220, y)
    .text(resturant, 270, y)
    .text(description, 320, y)
    .text(name, 370, y);
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(20, y).lineTo(550, y).stroke();
}

function formatCurrency(num) {
  return (
    reverseText(" ج.م") +
    Math.round(num).toLocaleString("ar-eg").split("").reverse().join("")
  );
}
function convertArNum(num) {
  return Math.round(num).toLocaleString("ar-eg").split("").reverse().join("");
}

function formatDate(date) {
  date = new Date(date).toLocaleDateString("ar-en");
  return date
    .split("/")
    .map((d) => d.split("").reverse().join(""))
    .join("/");
}

function reverseText(text) {
  return " " + text.split(" ").reverse().join(" ") + " ";
}

export default createInvoice;
