'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive, ChevronRight } from 'lucide-react'

type Batch = {
  id: string
  viewerId: string
  entryUserId: string
  batchName: string
  transactionCount: number
  totalAmount: number
  appliedFilters: string
  createdAt: string
}

interface BatchListProps {
  viewerId: string
  onSelectBatch: (batch: Batch) => void
}

export default function BatchList({ viewerId, onSelectBatch }: BatchListProps) {
  const [batches, setBatches] = useState<Batch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/batches?viewerId=${viewerId}`)
        if (!response.ok) throw new Error('Failed to fetch batches')
        const data = await response.json()
        setBatches(data)
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {batches.map((batch) => (
        <Card
          key={batch.id}
          className="border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
          onClick={() => onSelectBatch(batch)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg text-emerald-900">
                  {batch.batchName}
                </CardTitle>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  {batch.id.slice(0, 8)}...
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions:</span>
                <span className="font-semibold text-emerald-900">
                  {batch.transactionCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-emerald-900">
                  {formatCurrency(batch.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-700 text-xs">
                  {formatDate(batch.createdAt)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
