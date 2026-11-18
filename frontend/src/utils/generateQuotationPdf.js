import { jsPDF } from 'jspdf';
import { formatINR } from './formatCurrency';

/**
 * Generate an official, professional PDF Quotation / Cost Sheet for BuildMaster
 */
export const generateQuotationPdf = ({
  quoteNo = `BM-QT-${Math.floor(100000 + Math.random() * 900000)}`,
  clientName = 'Valued Home Buyer',
  clientPhone = '+91 98765 43210',
  clientEmail = 'client@example.com',
  clientCity = 'Mumbai, India',
  propertyTitle = 'The Imperial Sky Villa',
  propertyType = 'Luxury Penthouse',
  location = 'Worli Sea Face, Mumbai',
  superArea = 3200,
  carpetArea = 2450,
  unitNo = 'Tower A - 2802',
  facing = 'Arabian Sea View (East-Facing Entrance)',
  baseRate = 18500, // ₹ per sq.ft
  baseCost = 45325000,
  floorRise = 1200000,
  plcFacing = 1500000,
  flooringUpgrade = 'Italian Carrara Marble',
  flooringCost = 650000,
  parkingBays = 2,
  parkingCost = 1000000,
  clubhouseCharges = 450000,
  infraCharges = 350000,
  gstRate = 5, // %
  stampDutyRate = 6, // %
  registrationFee = 30000,
}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Computations
  const subTotalBeforeTax =
    baseCost + floorRise + plcFacing + flooringCost + parkingCost + clubhouseCharges + infraCharges;
  const gstAmount = Math.round((subTotalBeforeTax * gstRate) / 100);
  const stampDutyAmount = Math.round((subTotalBeforeTax * stampDutyRate) / 100);
  const grandTotal = subTotalBeforeTax + gstAmount + stampDutyAmount + registrationFee;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const validUntilStr = new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Colors
  const navyDark = [10, 25, 47]; // #0A192F
  const goldPrimary = [212, 175, 55]; // #D4AF37
  const slateText = [71, 85, 105]; // #475569
  const slateLight = [241, 245, 249]; // #F1F5F9

  // 1. TOP HEADER BANNER (Navy with Gold Accents)
  doc.setFillColor(...navyDark);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(...goldPrimary);
  doc.rect(0, 28, pageWidth, 1.5, 'F');

  // Company Name & Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('BUILDMASTER', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(212, 175, 55);
  doc.text('INFRASTRUCTURE & LUXURY REAL ESTATE PVT LTD', margin, 17);

  doc.setTextColor(203, 213, 225);
  doc.setFontSize(7.5);
  doc.text('RERA Reg: #BM-77401-2024 · ISO 9001:2015 Certified · www.buildmaster.com', margin, 22);

  // Right Side Header: Document Type
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(212, 175, 55);
  doc.text('OFFICIAL COST SHEET', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Ref: ${quoteNo}`, pageWidth - margin, 17, { align: 'right' });
  doc.text(`Date: ${todayStr} · Valid: ${validUntilStr}`, pageWidth - margin, 22, { align: 'right' });

  let y = 36;

  // 2. CLIENT & UNIT DETAILS SECTION (2 Column Box)
  doc.setFillColor(...slateLight);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, 'S');

  // Left: Customer Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...navyDark);
  doc.text('CUSTOMER / PROSPECTIVE BUYER', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateText);
  doc.text(`Name:`, margin + 4, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(clientName, margin + 22, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(`Contact:`, margin + 4, y + 16);
  doc.text(`${clientPhone} | ${clientEmail}`, margin + 22, y + 16);

  doc.text(`City:`, margin + 4, y + 21);
  doc.text(clientCity, margin + 22, y + 21);

  // Right: Unit Details
  const colRightX = margin + (pageWidth - margin * 2) / 2 + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...navyDark);
  doc.text('PROPERTY ALLOTMENT SPECIFICATIONS', colRightX, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateText);
  doc.text(`Property:`, colRightX, y + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${propertyTitle} (${unitNo})`, colRightX + 22, y + 11);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateText);
  doc.text(`Area / Typology:`, colRightX, y + 16);
  doc.text(`${carpetArea} sq.ft Carpet (${superArea} sq.ft Super) · ${propertyType}`, colRightX + 22, y + 16);

  doc.text(`Orientation:`, colRightX, y + 21);
  doc.text(facing, colRightX + 22, y + 21);

  y += 34;

  // 3. ITEMIZED CONSTRUCTION & PROPERTY COST BREAKDOWN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...navyDark);
  doc.text('I. ITEMIZED PRICING & CONSTRUCTION COST BREAKDOWN', margin, y);

  y += 4;

  // Table Header
  const col1W = 10;
  const col2W = 110;
  const col3W = pageWidth - margin * 2 - col1W - col2W;

  doc.setFillColor(...navyDark);
  doc.rect(margin, y, pageWidth - margin * 2, 6.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 3, y + 4.5);
  doc.text('Cost Component Description', margin + col1W + 4, y + 4.5);
  doc.text('Amount (INR)', pageWidth - margin - 4, y + 4.5, { align: 'right' });

  y += 6.5;

  const costItems = [
    {
      desc: `Base Construction Cost (${carpetArea} sq.ft Carpet Area @ ₹ ${baseRate.toLocaleString('en-IN')}/sq.ft)`,
      amount: baseCost,
    },
    {
      desc: `Floor Rise Premium (Higher Floor Elevation Stacking)`,
      amount: floorRise,
    },
    {
      desc: `Preferential Location Charges (PLC - ${facing})`,
      amount: plcFacing,
    },
    {
      desc: `3D Configured Luxury Flooring (${flooringUpgrade})`,
      amount: flooringCost,
    },
    {
      desc: `Covered Dedicated Basement Parking Stalls (${parkingBays} Stalls Allotted)`,
      amount: parkingCost,
    },
    {
      desc: `Exclusive Club House Membership & Sports Amenities Access`,
      amount: clubhouseCharges,
    },
    {
      desc: `Infrastructure Development Charges (Electric Substation, Water, Sewage, Fire NOC)`,
      amount: infraCharges,
    },
  ];

  costItems.forEach((item, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - margin * 2, 5.5, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateText);
    doc.text(`${index + 1}`, margin + 3, y + 3.8);
    doc.text(item.desc, margin + col1W + 4, y + 3.8);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatINR(item.amount), pageWidth - margin - 4, y + 3.8, { align: 'right' });

    y += 5.5;
  });

  // Subtotal Row
  doc.setFillColor(...slateLight);
  doc.rect(margin, y, pageWidth - margin * 2, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...navyDark);
  doc.text('Subtotal (Agreed Value Before Statutory Taxes)', margin + col1W + 4, y + 4.2);
  doc.text(formatINR(subTotalBeforeTax), pageWidth - margin - 4, y + 4.2, { align: 'right' });

  y += 7.5;

  // 4. STATUTORY TAXES & GOVERNMENT DUTIES TABLE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...navyDark);
  doc.text('II. GOVERNMENT STATUTORY LEVIES & REGISTRATION (ESTIMATED)', margin, y);

  y += 3.5;

  const taxItems = [
    { desc: `Goods & Services Tax (GST @ ${gstRate}% on Construction Value)`, amount: gstAmount },
    { desc: `State Stamp Duty Registration (@ ${stampDutyRate}% of Document Value)`, amount: stampDutyAmount },
    { desc: `Government Legal Verification & Title Documentation Surcharge`, amount: registrationFee },
  ];

  taxItems.forEach((tax, index) => {
    doc.setFillColor(index % 2 === 0 ? 255 : 250, 250, 250);
    doc.rect(margin, y, pageWidth - margin * 2, 5, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - margin * 2, 5, 'S');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...slateText);
    doc.text(tax.desc, margin + col1W + 4, y + 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatINR(tax.amount), pageWidth - margin - 4, y + 3.5, { align: 'right' });

    y += 5;
  });

  // GRAND TOTAL SUMMARY BAR
  y += 1;
  doc.setFillColor(...navyDark);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 9, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text('TOTAL ALL-INCLUSIVE ESTIMATED INVESTMENT:', margin + 6, y + 5.8);

  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(formatINR(grandTotal), pageWidth - margin - 6, y + 6.2, { align: 'right' });

  y += 13;

  // 5. RERA PAYMENT MILESTONE SCHEDULE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navyDark);
  doc.text('III. RERA-COMPLIANT CONSTRUCTION LINKED PAYMENT SCHEDULE', margin, y);

  y += 3.5;

  const schedule = [
    { stage: '1. Booking Advance & Application Submission', pct: '10%', amount: Math.round(grandTotal * 0.1) },
    { stage: '2. Execution of Registered Agreement of Sale', pct: '10%', amount: Math.round(grandTotal * 0.1) },
    { stage: '3. Completion of Plinth Beam & Foundation Piles', pct: '15%', amount: Math.round(grandTotal * 0.15) },
    { stage: '4. Completion of Mid-Superstructure Slabs (L15)', pct: '25%', amount: Math.round(grandTotal * 0.25) },
    { stage: '5. Completion of External Facade, Windows & MEP', pct: '20%', amount: Math.round(grandTotal * 0.2) },
    { stage: '6. Interior Flooring & Sanitary Fittings Finishing', pct: '10%', amount: Math.round(grandTotal * 0.1) },
    { stage: '7. Receipt of Occupancy Certificate (OC) & Key Handover', pct: '10%', amount: Math.round(grandTotal * 0.1) },
  ];

  schedule.forEach((sch, i) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...slateText);
    doc.text(sch.stage, margin + 4, y + 3);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyDark);
    doc.text(sch.pct, margin + 115, y + 3);
    doc.text(formatINR(sch.amount), pageWidth - margin - 4, y + 3, { align: 'right' });

    doc.setDrawColor(241, 245, 249);
    doc.line(margin + 4, y + 4.5, pageWidth - margin - 4, y + 4.5);
    y += 4.5;
  });

  y += 3;

  // 6. BANK ESCROW & TERMS BOX
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, (pageWidth - margin * 2) * 0.58, 22, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, (pageWidth - margin * 2) * 0.58, 22, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...navyDark);
  doc.text('OFFICIAL RERA ESCROW ACCOUNT DETAILS FOR PAYMENTS:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateText);
  doc.text('Beneficiary: BuildMaster Infrastructure Escrow Account', margin + 4, y + 9);
  doc.text('Bank: HDFC Bank, Corporate Banking Branch, Mumbai', margin + 4, y + 13);
  doc.text('A/C No: 50200088991122 · IFSC Code: HDFC0000123', margin + 4, y + 17);

  // Authorized Signatory Block
  const sigX = margin + (pageWidth - margin * 2) * 0.62;
  const sigW = (pageWidth - margin * 2) * 0.38;
  doc.roundedRect(sigX, y, sigW, 22, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...slateText);
  doc.text('For BUILDMASTER INFRASTRUCTURE PVT LTD', sigX + 4, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...navyDark);
  doc.text('[Digitally Verified Signatory]', sigX + 4, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Chief Financial Controller & Sales Head', sigX + 4, y + 19);

  // 7. FOOTER
  doc.setDrawColor(...goldPrimary);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Note: This cost sheet is an estimate and subject to statutory RERA registration terms. Stamp duty & taxes are subject to state revisions.',
    margin,
    pageHeight - 8
  );
  doc.text('Page 1 of 1 · BuildMaster Proprietary Quotation', pageWidth - margin, pageHeight - 8, {
    align: 'right',
  });

  // Save the document as PDF
  const filename = `BuildMaster-Quotation-${quoteNo}-${clientName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
};
