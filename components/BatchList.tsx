'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, ChevronRight, X } from 'lucide-react'

type Batch = {
  id: string
  viewerId: string
  entryUserId: string
  batchName: string
  transactionCount: number
  totalAmount: number
  appliedFilters: string
  createdAt: string
  fund?: string
  bankName?: string
  month?: string
}

interface BatchListProps {
  viewerId: string
  onSelectBatch: (batch: Batch) => void
}

export default function BatchList({ viewerId, onSelectBatch }: BatchListProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFund, setSelectedFund] = useState<string>('')
  const [selectedBank, setSelectedBank] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [funds, setFunds] = useState<string[]>([])
  const [banks, setBanks] = useState<string[]>([])

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/batches?viewerId=${viewerId}`)
        if (!response.ok) throw new Error('Failed to fetch batches')
        const data = await response.json()
        
        // Extract filters from batches and parse metadata
        const batchesWithMetadata = data.map((batch: Batch) => {
          try {
            const filters = JSON.parse(batch.appliedFilters || '{}')
            const createdDate = new Date(batch.createdAt)
            const month = createdDate.toLocaleDateString('en-US', { month: 'long' })
            
            return {
              ...batch,
              fund: filters.fund || 'General Fund',
              bankName: filters.bankName || 'All Banks',
              month: month,
            }
          } catch {
            return {
              ...batch,
              fund: 'General Fund',
              bankName: 'All Banks',
              month: new Date(batch.createdAt).toLocaleDateString('en-US', { month: 'long' }),
            }
          }
        })
        
        setBatches(batchesWithMetadata)
        
        // Extract unique funds and banks for filters
        const uniqueFunds = ['', ...new Set(batchesWithMetadata.map((b: Batch) => b.fund))]
        const uniqueBanks = ['', ...new Set(batchesWithMetadata.map((b: Batch) => b.bankName))]
        
        setFunds(uniqueFunds as string[])
        setBanks(uniqueBanks as string[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBatches()
  }, [viewerId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredBatches = batches.filter((batch) => {
    if (selectedFund && batch.fund !== selectedFund) return false
    if (selectedBank && batch.bankName !== selectedBank) return false
    if (selectedMonth && batch.month !== selectedMonth) return false
    return true
  })

  const uniqueMonths = [...new Set(batches.map((b) => b.month))].sort() as string[]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading batches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-800">Error loading batches: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (batches.length === 0) {
    return (
      <Card className="border-emerald-100">
        <CardContent className="pt-6 text-center">
          <Archive className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
          <p className="text-gray-600">No batches yet. Print a report to create a batch.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border border-emerald-100 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Fund</label>
            <select
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Funds</option>
              {funds.filter(f => f).map((fund) => (
                <option key={fund} value={fund}>
                  {fund}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Banks</option>
              {banks.filter(b => b).map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Months</option>
              {uniqueMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {(selectedFund || selectedBank || selectedMonth) && (
            <Button
              onClick={() => {
                setSelectedFund('')
                setSelectedBank('')
                setSelectedMonth('')
              }}
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:bg-emerald-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Batch Grid */}
      {filteredBatches.length === 0 ? (
        <Card className="border-emerald-100">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No batches match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBatches.map((batch) => (
            <Card
              key={batch.id}
              className="border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer hover:shadow-md"
              onClick={() => onSelectBatch(batch)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-emerald-900">
                    {batch.batchName}
                  </CardTitle>
                  <ChevronRight className="w-5 h-5 text-emerald-400 mt-1" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-emerald-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Fund</p>
                      <p className="text-sm font-semibold text-emerald-900">{batch.fund}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Bank</p>
                      <p className="text-sm font-semibold text-emerald-900">{batch.bankName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Month</p>
                    <p className="text-sm font-semibold text-emerald-900">{batch.month}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Transactions</p>
                      <p className="text-lg font-bold text-emerald-900">{batch.transactionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                      <p className="text-lg font-bold text-emerald-900">
                        {formatCurrency(batch.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
