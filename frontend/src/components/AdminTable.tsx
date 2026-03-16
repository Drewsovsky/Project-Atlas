type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
};

type AdminTableProps<T extends { id: string }> = {
  title: string;
  rows: T[];
  columns: Column<T>[];
};

export function AdminTable<T extends { id: string }>({
  title,
  rows,
  columns,
}: AdminTableProps<T>) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
      </header>
      <div className="overflow-x-auto">
      <table className="min-w-[640px] w-full border-collapse">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-muted)]">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[var(--color-border)]">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-[var(--color-text)]">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
