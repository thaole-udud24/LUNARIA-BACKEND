import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelBaseService {
  async exportData(data: any[], fieldsToExport: string[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('FULL_DATA');

    if (!data || data.length === 0) {
      throw new BadRequestException('Empty data');
    }

    worksheet.columns = fieldsToExport.map((field) => ({
      header: field.toUpperCase(),
      key: field,
      width: 25,
    }));

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
    worksheet.addRows(data);

    return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }

async previewImport(buffer: any, mapping: Record<string, string>, requiredFields: string[]): Promise<any> {    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) throw new BadRequestException('Empty excel file');

    const headers: string[] = [];
    const previewResults: any[] = [];
    let validCount = 0;
    let invalidCount = 0;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = cell.value?.toString().trim() || '';
        });
      } else {
        let isValid = true;
        const rowData: any = {};
        const errors: string[] = [];

        Object.keys(mapping).forEach((excelColumnName) => {
          const dbField = mapping[excelColumnName];
          const colIndex = headers.indexOf(excelColumnName);
          let cellValue = colIndex !== -1 ? row.getCell(colIndex).value : null;

          if (cellValue && typeof cellValue === 'object' && 'richText' in cellValue) {
            cellValue = (cellValue as any).richText.map((rt: any) => rt.text).join('');
          }

          const finalValue = cellValue ? cellValue.toString().trim() : null;
          rowData[dbField] = finalValue;

          if (requiredFields.includes(dbField) && !finalValue) {
            isValid = false;
            errors.push(`Missing: ${excelColumnName}`);
          }
        });

        if (isValid) validCount++; else invalidCount++;
        previewResults.push({ rowNumber, data: rowData, isValid, errors });
      }
    });

    return { totalRows: previewResults.length, validCount, invalidCount, previewData: previewResults };
  }
}