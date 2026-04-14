import PDFDocument from "pdfkit";
import Excel from 'exceljs'

const generatePdf = (title: string, data: any[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {

    if (!data.length) {
      return reject(new Error("No data found"));
    }

    const doc = new PDFDocument({ margin: 30 });

    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Title
    doc.fontSize(18).text(title, { align: "center" });
    doc.moveDown();

    const headers = Object.keys(data[0]);
    const columnWidth = 500 / headers.length;

    // Header
    const headerY = doc.y;
    doc.font("Helvetica-Bold");
    headers.forEach((h, i) => {
      doc.text(h, 40 + i * columnWidth, headerY, {
        width: columnWidth,
        align: "center"
      });
    });

    doc.moveDown();
    doc.font("Helvetica");

    // Rows
    data.forEach((row) => {
      const rowY = doc.y;
      headers.forEach((h, i) => {
        doc.text(String(row[h] ?? ""), 40 + i * columnWidth, rowY, {
          width: columnWidth,
          align: "center"
        });
      });
      doc.moveDown();

      if (doc.y > 700) doc.addPage();
    });

    doc.end();
  });

};

  const excel =(data:any[])=>{
    const excel = new Excel.Workbook();
    const book = excel.addWorksheet("Books")
     if (!data.length) {
    throw new Error("No data found");
  }
  const header =Object.keys(data[0]);
  book.columns = header.map((key)=>({
    header:key,
    key:key,
    width:20
  }))
   data.forEach((item) => {
    book.addRow(item);
  });
  const buffer =  excel.xlsx.writeBuffer()
  return buffer
  }
export  {generatePdf,excel};