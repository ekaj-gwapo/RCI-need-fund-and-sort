'use client'

import { forwardRef } from 'react'

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
}

interface PrintReportProps {
  transactions: Transaction[]
  logo: string | null
  entryUserEmail: string
  batchId?: string
}

const PrintReport = forwardRef<HTMLDivElement, PrintReportProps>(
  ({ transactions, logo, entryUserEmail, batchId }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
    const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
    const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0)

    return (
      <div
        ref={ref}
        className="w-full bg-white p-8 font-serif print:p-4"
        style={{ minHeight: '100vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-gray-800">
          <div className="flex items-center gap-4">
            {logo && (
              <img
                src={logo}
                alt="Organization Logo"
                className="h-16 w-16 object-contain"
              />
            )}
          </div>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              TRANSACTION REPORT
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {formatDate(new Date().toISOString())}
            </p>
          </div>
        </div>

        {/* Entry User Info */}
        <div className="mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Data Entry User:</span> {entryUserEmail}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Total Records:</span> {transactions.length}
          </p>
          {batchId && (
            <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-100 rounded font-mono">
              <span className="font-semibold">Batch ID:</span> {batchId}
            </p>
          )}
        </div>

        {/* Transactions Table */}
        <table className="w-full text-sm border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-3 px-2 font-bold">Check Date</th>
              <th className="text-left py-3 px-2 font-bold">DV No.</th>
              <th className="text-left py-3 px-2 font-bold">Control No.</th>
              <th className="text-left py-3 px-2 font-bold">Bank Name</th>
              <th className="text-left py-3 px-2 font-bold">Payee</th>
              <th className="text-left py-3 px-2 font-bold">Account Code</th>
              <th className="text-left py-3 px-2 font-bold">Nature of Payment</th>
              <th className="text-right py-3 px-2 font-bold">Amount</th>
              <th className="text-right py-3 px-2 font-bold">Debit</th>
              <th className="text-right py-3 px-2 font-bold">Credit</th>
              <th className="text-left py-3 px-2 font-bold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className="border-b border-gray-300">
                <td className="py-2 px-2">{formatDate(transaction.date)}</td>
                <td className="py-2 px-2">{transaction.dvNumber}</td>
                <td className="py-2 px-2">{transaction.controlNumber}</td>
                <td className="py-2 px-2">{transaction.bankName}</td>
                <td className="py-2 px-2">{transaction.payee}</td>
                <td className="py-2 px-2">{transaction.accountCode}</td>
                <td className="py-2 px-2">{transaction.particulars}</td>
                <td className="py-2 px-2 text-right font-semibold">
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-2 px-2 text-right">
                  {transaction.debit > 0 ? formatCurrency(transaction.debit) : '-'}
                </td>
                <td className="py-2 px-2 text-right">
                  {transaction.credit > 0 ? formatCurrency(transaction.credit) : '-'}
                </td>
                <td className="py-2 px-2 text-xs">{transaction.remarks}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-800 font-bold">
              <td colSpan={7} className="py-3 px-2 text-right">
                TOTAL:
              </td>
              <td className="py-3 px-2 text-right border-t-2 border-gray-800">
                {formatCurrency(totalAmount)}
              </td>
              <td className="py-3 px-2 text-right border-t-2 border-gray-800">
                {formatCurrency(totalDebit)}
              </td>
              <td className="py-3 px-2 text-right border-t-2 border-gray-800">
                {formatCurrency(totalCredit)}
              </td>
              <td className="py-3 px-2"></td>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="border-b border-gray-800 mb-2 h-16"></p>
              <p className="text-xs font-semibold">Prepared By</p>
            </div>
            <div>
              <p className="border-b border-gray-800 mb-2 h-16"></p>
              <p className="text-xs font-semibold">Checked By</p>
            </div>
            <div>
              <p className="border-b border-gray-800 mb-2 h-16"></p>
              <p className="text-xs font-semibold">Approved By</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

PrintReport.displayName = 'PrintReport'

export default PrintReport
