import * as XLSX from 'xlsx';
import { OrderItem } from './types';

interface OrderExcelData {
  ownerName: string;
  address: string;
  city: string;
  items: OrderItem[];
  shipping: number;
}

export function generateOrderExcel(data: OrderExcelData): void {
  const wb = XLSX.utils.book_new();

  // Build row data
  const rows: (string | number)[][] = [];

  // Header info
  rows.push([data.ownerName]);
  rows.push([data.address]);
  rows.push([data.city.toUpperCase()]);
  rows.push([]);

  const year = new Date().getFullYear();
  const monthNames = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  const month = monthNames[new Date().getMonth()];

  rows.push([`COTIZADOR PARA PEDIDOS ENERGITAS ${year}`]);
  rows.push(['PRODUCTOS', 'UNIDADES', 'PRECIO DISTRIBUIDOR', 'TOTAL']);

  let totalUnits = 0;
  let grandTotal = 0;

  data.items.forEach(item => {
    const subtotal = item.quantity * item.unit_cost;
    totalUnits += item.quantity;
    grandTotal += subtotal;
    rows.push([item.product_name, item.quantity, item.unit_cost, subtotal]);
  });

  // Totals
  rows.push([]);
  rows.push(['', totalUnits, '', grandTotal]);
  rows.push(['', '', 'ENVIO A DOMICILIO', data.shipping]);
  rows.push(['', '', 'TOTAL', grandTotal + data.shipping]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 55 },
    { wch: 12 },
    { wch: 22 },
    { wch: 14 },
  ];

  const sheetName = `PEDIDO ${month} ${year}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Download
  XLSX.writeFile(wb, `Pedido_${month}_${year}.xlsx`);
}
