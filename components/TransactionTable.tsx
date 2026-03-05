'use client'

import { useState, useMemo } from 'react'
import { X, ArrowUpDown, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  fund: string
}

type TransactionTableProps = {
  transactions: Transaction[]
  onTransactionDeleted?: () => void
  onTransactionUpdated?: () => void
}

type SortField = 'date' | 'bankName' | 'payee' | 'dvNumber' | 'controlNumber' | 'particulars' | 'amount' | 'accountCode' | 'fund'

export default function TransactionTable({ transactions, onTransactionDeleted, onTransactionUpdated }: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<Transaction> | null>(null)

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

  const handleEditStart = () => {
    if (selectedTransaction) {
      setEditFormData({ ...selectedTransaction })
      setIsEditing(true)
    }
  }

  const handleEditChange = (field: keyof Transaction, value: any) => {
    setEditFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleEditSave = async () => {
    if (!editFormData || !selectedTransaction) return

    setIsEditing(false)
    try {
      const response = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update transaction')
      }

      const updatedTx = await response.json()
      setSelectedTransaction(updatedTx)
      setEditFormData(null)
      onTransactionUpdated?.()
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert(`Error updating transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedTransaction) return

    if (!confirm('Are you sure you want to delete this transaction?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete transaction')
      }

      setSelectedTransaction(null)
      setIsEditing(false)
      onTransactionDeleted?.()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert(`Error deleting transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeleting(false)
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
        <p className="text-gray-600">No transactions yet. Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Table */}
      <div className="flex-1 bg-white border border-emerald-100 rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-emerald-100 bg-emerald-50 sticky top-0">
                <SortableHeader label="Date" field="date" />
                <SortableHeader label="Bank" field="bankName" />
                <SortableHeader label="Payee" field="payee" />
                <SortableHeader label="DV #" field="dvNumber" />
                <SortableHeader label="Control #" field="controlNumber" />
                <SortableHeader label="Particulars" field="particulars" />
                <SortableHeader label="Fund" field="fund" />
                <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={() => handleSort('amount')}>
                  <div className="flex items-center gap-2 justify-end">
                    Amount
                    {sortField === 'amount' && <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900">Debit</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-emerald-900">Credit</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((tx, idx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className={`border-b border-emerald-100 cursor-pointer transition-colors ${
                    selectedTransaction?.id === tx.id
                      ? 'bg-emerald-100'
                      : idx % 2 === 0
                        ? 'bg-white hover:bg-emerald-50'
                        : 'bg-emerald-50/30 hover:bg-emerald-50'
                  }`}
                >
                  <td className="px-6 py-3 text-sm text-gray-900">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{tx.bankName}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{tx.payee}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{tx.dvNumber}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{tx.controlNumber}</td>
                  <td className="px-6 py-3 text-sm text-gray-900 max-w-xs truncate">{tx.particulars}</td>
                  <td className="px-6 py-3 text-sm text-gray-900">{tx.fund}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900 font-medium">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">
                    {tx.debit > 0 ? `$${tx.debit.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-900">
                    {tx.credit > 0 ? `$${tx.credit.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Panel */}
      {selectedTransaction && (
        <div className="w-96 bg-white border border-emerald-100 rounded-lg p-6 h-[600px] overflow-y-auto flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Transaction' : 'Transaction Details'}
            </h3>
            <button
              onClick={() => {
                setSelectedTransaction(null)
                setIsEditing(false)
                setEditFormData(null)
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {isEditing && editFormData ? (
              <>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Date</label>
                  <input
                    type="date"
                    value={editFormData.date || ''}
                    onChange={(e) => handleEditChange('date', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Bank Name</label>
                  <input
                    type="text"
                    value={editFormData.bankName || ''}
                    onChange={(e) => handleEditChange('bankName', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Payee</label>
                  <input
                    type="text"
                    value={editFormData.payee || ''}
                    onChange={(e) => handleEditChange('payee', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Address</label>
                  <input
                    type="text"
                    value={editFormData.address || ''}
                    onChange={(e) => handleEditChange('address', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">DV Number</label>
                  <input
                    type="text"
                    value={editFormData.dvNumber || ''}
                    onChange={(e) => handleEditChange('dvNumber', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Control Number</label>
                  <input
                    type="text"
                    value={editFormData.controlNumber || ''}
                    onChange={(e) => handleEditChange('controlNumber', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Particulars</label>
                  <input
                    type="text"
                    value={editFormData.particulars || ''}
                    onChange={(e) => handleEditChange('particulars', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Fund</label>
                  <select
                    value={editFormData.fund || 'General Fund'}
                    onChange={(e) => handleEditChange('fund', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  >
                    {['General Fund', 'Development Fund', 'Trust Fund', 'Hospital Fund', 'MOPH'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.amount || ''}
                    onChange={(e) => handleEditChange('amount', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-emerald-600 uppercase">Debit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.debit || ''}
                      onChange={(e) => handleEditChange('debit', parseFloat(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-emerald-600 uppercase">Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.credit || ''}
                      onChange={(e) => handleEditChange('credit', parseFloat(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Account Code</label>
                  <input
                    type="text"
                    value={editFormData.accountCode || ''}
                    onChange={(e) => handleEditChange('accountCode', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Remarks</label>
                  <textarea
                    value={editFormData.remarks || ''}
                    onChange={(e) => handleEditChange('remarks', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Bank Name</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.bankName}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Payee</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.payee}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Address</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.address}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">DV Number</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.dvNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Control Number</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.controlNumber}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Particulars</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.particulars}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Fund</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.fund}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Amount</label>
                  <p className="text-sm text-gray-900 font-medium">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-emerald-600 uppercase">Debit</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.debit > 0 ? `$${selectedTransaction.debit.toFixed(2)}` : '-'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-emerald-600 uppercase">Credit</label>
                    <p className="text-sm text-gray-900">{selectedTransaction.credit > 0 ? `$${selectedTransaction.credit.toFixed(2)}` : '-'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Account Code</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.accountCode}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-emerald-600 uppercase">Remarks</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.remarks || '-'}</p>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-emerald-100 pt-4 mt-4 flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleEditSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                >
                  Save Changes
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setEditFormData(null)
                  }}
                  variant="outline"
                  className="flex-1 text-gray-600 border-gray-300 text-sm"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleEditStart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Update
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
