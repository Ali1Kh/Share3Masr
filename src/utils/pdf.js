import fs from "fs";
import PDFDocument from "pdfkit";

function createInvoice(invoice, path) {
  return new Promise((resolve, reject) => {
    let doc = new PDFDocument({ size: "C5", margin: 50 });

    doc.registerFont("Simplified Arabic", "simpo.ttf");
    doc.registerFont("Simplified Arabic Bold", "simpbdo.ttf");
    doc.font("Simplified Arabic");
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    const writeStream = fs.createWriteStream(path);
    doc.pipe(writeStream);

    doc.end();

    writeStream.on("finish", () => {
      resolve();
    });

    writeStream.on("error", (error) => {
      reject(error);
    });
  });
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
    .text("الفاتورة", 50, 130, { align: "right" });

  generateHr(doc, 165);

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .font("Simplified Arabic Bold")
    .text(reverseText("التاريخ:"), 300, customerInformationTop, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(formatDate(new Date()), 150, customerInformationTop, {
      align: "center",
    })
    .font("Simplified Arabic Bold")
    .text(reverseText("الساعة:"), 300, customerInformationTop + 15, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(formatTime(new Date()), 150, customerInformationTop + 15, {
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
    .text(reverseText("رقم الطلب:"), 300, customerInformationTop + -15, {
      align: "right",
    })
    .font("Simplified Arabic")
    .text(invoice.invoice_nr, 150, customerInformationTop + -15, {
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
    reverseText("الكمية"),
    reverseText("السعر"),
    reverseText("الأضافات"),
    reverseText("المطعم"),
    // reverseText("الوصف"),
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
      reverseText(
        item.productId.extra.map((extraItem) => extraItem.itemNameAR).join(", ")
      ),
      reverseText(item.productId.resturant.nameAR),
      // reverseText(item.productId.descriptionAR),
      reverseText(
        item.productId.nameAR + " " + item.productId.prices[0].sizeNameAR
      )
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
    reverseText("السعر الأجمالي")
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
      580,
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
  extra,
  resturant,
  name
) {
  doc
    .fontSize(10)
    .text(total, 20, y)
    .text(quantity, 70, y)
    .text(price, 120, y)
    .text(extra, 170, y)
    .text(resturant, 250, y)
    .text(name, 320, y, {
      align: "right",
    });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(20, y).lineTo(440, y).stroke();
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
  date = new Date(date).toLocaleDateString("ar-eg");
  return date
    .split("/")
    .map((d) => d.split("").reverse().join(""))
    .join("/");
}
function formatTime(date) {
  date = new Date(date).toLocaleTimeString("ar-eg", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return date
    .split("/")
    .map((d) => d.split("").reverse().join(""))
    .join("/");
}

function reverseText(text) {
  return " " + text.split(" ").reverse().join(" ") + " ";
}

export default createInvoice;
