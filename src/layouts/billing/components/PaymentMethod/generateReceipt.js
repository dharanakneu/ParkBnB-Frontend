import jsPDF from "jspdf";

const generateReceiptPDF = (paymentData) => {
  const {
    renteeDetails,
    amount,
    parkingDetails,
    spotDetails,
    date,
    startTime,
    endTime,
  } = paymentData;

  const doc = new jsPDF();

  // Set fonts
  doc.setFont("helvetica", "normal");

  // Title
  doc.setFontSize(18);
  doc.text("PARKING RECEIPT", 105, 20, null, null, "center");

  // // Add company info
  // doc.setFontSize(15);
  // doc.text("Park BnB", 105, 30, null, null, "center");

  // Add company info
  doc.setFontSize(20); // Larger font size for brand name
  doc.setFont("helvetica", "bold"); // Bold font for emphasis
  doc.setTextColor(0, 102, 204); // Set a color (e.g., blue) for the brand name
  doc.text("Park BnB", 105, 30, null, null, "center");

  // Reset font and color for subsequent text
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.setFontSize(12); // Reset to standard font size

  // Draw a line separator
  doc.setLineWidth(0.5);
  doc.line(20, 55, 190, 55);

  // Add rentee details
  if (renteeDetails) {
    doc.setFontSize(12);
    doc.text("Rentee Details:", 20, 65);
    doc.setFontSize(10);
    doc.text(
      `Name: ${renteeDetails.firstName} ${renteeDetails.lastName}`,
      20,
      75
    );
    doc.text(`Email: ${renteeDetails.email}`, 20, 80);
    doc.text(`Phone: ${renteeDetails.phone}`, 20, 85);
  }

  // Draw another separator
  doc.line(20, 90, 190, 90);

  // Add parking location details
  if (parkingDetails) {
    doc.setFontSize(12);
    doc.text("Parking Location:", 20, 100);
    doc.setFontSize(10);
    doc.text(
      `${parkingDetails.street}, ${parkingDetails.city}, ${parkingDetails.state}, ${parkingDetails.country}`,
      20,
      110
    );
  }

  // Add parking spot details
  if (spotDetails) {
    doc.setFontSize(12);
    doc.text("Parking Spot:", 20, 120);
    doc.setFontSize(10);
    doc.text(`Spot Number: ${spotDetails.spotNumber}`, 20, 130);
    doc.text(`Spot Type: ${spotDetails.spotType}`, 20, 135);
  }

  // Add time and date
  doc.setFontSize(12);
  doc.text("Parking Time:", 20, 145);
  doc.setFontSize(10);
  doc.text(`Date: ${date}`, 20, 155);
  doc.text(`Start Time: ${startTime}`, 20, 160);
  doc.text(`End Time: ${endTime}`, 20, 165);

  // Add payment details
  doc.setFontSize(14);
  doc.text(`Total Paid: $${amount.toFixed(2)}`, 105, 180, null, null, "center");

  // Draw final separator
  doc.line(20, 185, 190, 185);

  // Add thank you message
  doc.setFontSize(12);
  doc.text("THANK YOU AND DRIVE SAFELY!", 105, 200, null, null, "center");

  // Add footer (optional)
  doc.setFontSize(8);
  doc.text(
    "This receipt is generated automatically and cannot be refunded.",
    105,
    210,
    null,
    null,
    "center"
  );

  // Save the PDF
  doc.save("receipt.pdf");
};

export default generateReceiptPDF;
