import PDFDocument from "pdfkit";
import fs from "fs";

const generatePdf = (title: string, data: any[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    if (!data.length) return reject(new Error("No data found"));

    const doc = new PDFDocument({ margin: 30 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

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

const main = async () => {
    const data = [
        {name: "Alice", age: 30, city: "New York"},
        {name: "Bob", age: 25, city: "London"}
    ];
    try {
        const buf = await generatePdf("Test", data);
        fs.writeFileSync("test.pdf", buf);
        console.log("PDF created successfully, length:", buf.length);
    } catch(err) {
        console.error(err);
    }
}
main();
