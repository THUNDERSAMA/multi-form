import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
export function downloadJSONasXLSX(
  jsonData: any,
  filename = "courier_data.xlsx"
) {
  try {
    // 🧩 Add or modify columns
    // const formattedData = jsonData.map((item, index) => ({
    //   "SL No": index + 1,
    //   "CN Number": item["cn-no"],
    //   "Date": item.date,
    //   "Destination": item.destination,
    //   "Weight (KG)": item.weight,
    //   "Mode": item.mode,
    //   "Remarks": "" // keep blank or fill dynamically
    // }));

    // 📘 Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    // 🧾 Auto-size columns
    worksheet["!cols"] = Object.keys(jsonData[0]).map((key) => ({
      wch: key.length + 10,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Courier Data");

    // 💾 Save the file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename);
    toast.success("Report downloaded successfully! ✅");
  } catch (error) {
    console.error("❌ Error generating XLSX:", error);
  }
}
