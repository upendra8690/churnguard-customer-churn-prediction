import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { CustomerRecord } from "@workspace/api-client-react";

const columns: ColumnDef<CustomerRecord>[] = [
  {
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.customerId}</span>,
  },
  {
    accessorKey: "contract",
    header: "Contract",
  },
  {
    accessorKey: "tenure",
    header: "Tenure (Mo)",
  },
  {
    accessorKey: "monthlyCharges",
    header: "Monthly ($)",
    cell: ({ row }) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.original.monthlyCharges),
  },
  {
    accessorKey: "churnScore",
    header: "Risk Score",
    cell: ({ row }) => {
      const score = row.original.churnScore;
      let colorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      if (score > 70) colorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      else if (score > 40) colorClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";

      return <Badge variant="outline" className={`px-2 py-0.5 rounded border-transparent ${colorClass}`}>{score}</Badge>;
    },
  },
  {
    accessorKey: "churn",
    header: "Churned",
    cell: ({ row }) => {
      const churned = row.original.churn === "Yes";
      return (
        <span className={churned ? "text-red-600 font-medium" : "text-muted-foreground"}>
          {row.original.churn}
        </span>
      );
    }
  },
];

export function CustomerTable({ data, loading }: { data: CustomerRecord[] | undefined, loading: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search customers..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  );
}
