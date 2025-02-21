"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import { User } from "@/types/user"

interface UsersTableProps {
  users: User[]
  total: number
  currentPage: number
  perPage: number
  onPageChange: (page: number) => void
  onSearch: (term: string) => void
  searchTerm: string
  refetch: () => void
}

export function UsersTable({ 
  users, 
  total, 
  currentPage, 
  perPage,
  onPageChange,
  onSearch,
  searchTerm,
  refetch
}: UsersTableProps) {
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={users}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onSearch={onSearch}
        searchTerm={searchTerm}
        refetch={refetch}
      />
    </div>
  )
}
