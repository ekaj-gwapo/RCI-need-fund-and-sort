'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown } from 'lucide-react'

type Transaction = {
  id: string
  bankName: string
  payee: string
  address: string
  dvNumber: string
  particulars: string
  amount: number
  date: string
  controlNumber: string
  accountCode: string
  debit: number
  credit: number
  remarks: string
  createdAt: string
  userId: string
  fund: string
}

type ViewerTransactionTableProps = {
  transactions: Transaction[]
}

type SortField = 'date' | 'bankName' | 'payee' | 'dvNumber' | 'controlNumber' | 'particulars' | 'amount' | 'accountCode' | 'fund'

export default function ViewerTransactionTable({
  transactions,
}: ViewerTransactionTableProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
      }

      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return sorted
  }, [transactions, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortableHeader = ({ label, field }: { label: string; field: SortField }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-6 py-3 text-left text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors"
    >
      <div className="flex items-center gap-2">
        {label}
        {sortField === field && <ArrowUpDown className="w-4 h-4" />}
      </div>
    </th>
  )
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-emerald-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          No transactions available. Select a data entry user to view their transactions.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-emerald-100 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-emerald-100 bg-emerald-50 sticky top-0">
              <SortableHeader label="Date" field="date" />
              <SortableHeader label="Bank Name" field="bankName" />
              <SortableHeader label="Payee" field="payee" />
              <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-900">
                Address
              </th>
              <SortableHeader label="DV #" field="dvNumber" />
              <SortableHeader label="Control #" field="controlNumber" />
              <SortableHeader label="Particulars" field="particulars" />
              <SortableHeader label="Account Code" field="accountCode" />
              <SortableHeader label="Fund" field="fund" />
              <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => handleSort('amount')}>
                <div className="flex items-center gap-2 justify-end">
                  Amount
                  {sortField === 'amount' && <ArrowUpDown className="w-4 h-4" />}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900">Debit</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900">
                Credit
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-emerald-900">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx, idx) => (
              <tr
                key={tx.id}
                className={`border-b border-emerald-100 hover:bg-emerald-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'
                }`}
              >
                <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-sm text-gray-900">{tx.bankName}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{tx.payee}</td>
                <td className="px-6 py-3 text-sm text-gray-900 max-w-xs truncate">
                  {tx.address}
                </td>
                <td className="px-6 py-3 text-sm text-gray-900 font-medium">{tx.dvNumber}</td>
                <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                  {tx.controlNumber}
                </td>
                <td className="px-6 py-3 text-sm text-gray-900 max-w-xs truncate">
                  {tx.particulars}
                </td>
                <td className="px-6 py-3 text-sm text-gray-900 font-medium">{tx.accountCode}</td>
                <td className="px-6 py-3 text-sm text-gray-900">{tx.fund}</td>
                <td className="px-6 py-3 text-sm text-right text-gray-900 font-semibold">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900">
                  {tx.debit > 0 ? `$${tx.debit.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-3 text-sm text-right text-gray-900">
                  {tx.credit > 0 ? `$${tx.credit.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{tx.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-emerald-50 border-t border-emerald-100 px-6 py-3">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-emerald-900">{transactions.length}</span> transactions
        </p>
      </div>
    </div>
  )
}
