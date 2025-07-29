import type { Transaction } from './types';

// This type helps us handle the translated 'type' field for export
type ExportableTransaction = Omit<Transaction, 'type'> & {
    type: string; 
};

export function exportToCsv(filename: string, rows: ExportableTransaction[]) {
  if (!rows || !rows.length) {
    return;
  }
  const separator = ',';
  const keys: (keyof ExportableTransaction)[] = ['date', 'description', 'type', 'amount'];
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows.map(row => {
      return keys.map(k => {
        let cell: string | number = row[k] ?? '';
        
        if (typeof cell === 'string' && cell.includes(separator)) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(separator);
    }).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
