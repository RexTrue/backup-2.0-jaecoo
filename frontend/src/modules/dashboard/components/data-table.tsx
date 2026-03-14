import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
}

export default function DataTable<T>({ columns, rows }: DataTableProps<T>) {
  return (
    <div className="dashboard-table-wrap">
      <table className="dashboard-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={String(column.key)}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
