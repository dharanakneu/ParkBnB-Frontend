import jsPDF from "jspdf";

const generateReceiptPDF = (paymentData) => {
  const doc = new jsPDF();

  // Set fonts
  doc.setFont("helvetica", "normal");

  // Title
  doc.setFontSize(18);
  doc.text("PARKING RECEIPT", 105, 20, null, null, "center");

  // Add company info
  doc.setFontSize(12);
  doc.text("Royal Valet Parking", 105, 30, null, null, "center");
  doc.text("Hill Park Ave, New York, NY, USA", 105, 40, null, null, "center");
  doc.text("888-888-8888", 105, 50, null, null, "center");

  // Draw a line separator
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);

  // Time & Date
  doc.setFontSize(10);
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const currentDate = new Date().toLocaleDateString();
  doc.text(`Time: ${currentTime}`, 20, 65);
  doc.text(`Date: ${currentDate}`, 105, 65, null, null, "center");

  // Space Number
  doc.text(
    `Space: ${paymentData.parkingSpace || "621"}`,
    190,
    65,
    null,
    null,
    "right",
  );

  // Payment Details
  doc.setFontSize(14);
  doc.text(
    `Paid: $${paymentData.amount.toFixed(2)}`,
    105,
    85,
    null,
    null,
    "center",
  );

  // Draw another line separator
  doc.setLineWidth(0.5);
  doc.line(20, 90, 190, 90);

  // Thank You Message
  doc.setFontSize(12);
  doc.text("THANK YOU AND DRIVE SAFELY!", 105, 110, null, null, "center");

  // Add footer (optional)
  doc.setFontSize(8);
  doc.text(
    "This receipt is generated automatically and cannot be refunded.",
    105,
    120,
    null,
    null,
    "center",
  );

  // Save the PDF
  doc.save("receipt.pdf");
};

export default generateReceiptPDF;
