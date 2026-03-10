'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import TransactionForm from '@/components/TransactionForm'
import TransactionTable from '@/components/TransactionTable'
import { LogOut, Plus, Settings } from 'lucide-react'
import Link from 'next/link'

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
  fund: string
  createdAt: string
}

export default function EntryDashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bankNames, setBankNames] = useState<string[]>([])
  const [selectedBankName, setSelectedBankName] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedFund, setSelectedFund] = useState<string>('')
  const router = useRouter()

  const fundOptions = [
    'General Fund',
    'Development Fund',
    'Trust Fund',
    'Hospital Fund',
    'MOPH'
  ]

  useEffect(() => {
    const checkAuth = () => {
      const userStr = localStorage.getItem('user')
      if (!userStr) {
        router.push('/auth/login')
        return
      }

      const user = JSON.parse(userStr)
      if (user.role !== 'entry_user') {
        router.push('/viewer-dashboard')
        return
      }

      setUser(user)
      fetchTransactions(user.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/transactions?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setAllTransactions(data)
        setTransactions(data)
        extractBankNames(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const extractBankNames = (txs: Transaction[]) => {
    const names = Array.from(new Set(txs.map(tx => tx.bankName).filter(Boolean)))
    setBankNames(names.sort())
  }

  const applyFilters = () => {
    let filtered = [...allTransactions]

    if (selectedBankName) {
      filtered = filtered.filter(tx => tx.bankName === selectedBankName)
    }

    if (selectedDate) {
      filtered = filtered.filter(tx =>
        new Date(tx.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
      )
    }

    if (selectedFund) {
      filtered = filtered.filter(tx => tx.fund === selectedFund)
    }

    setTransactions(filtered)
  }

  useEffect(() => {
    if (allTransactions.length > 0) {
      applyFilters()
    }
  }, [selectedBankName, selectedDate, selectedFund, allTransactions])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-100 sticky top-0 z-40">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {logo && (
              <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-emerald-900">Data Entry</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/settings">
              <Button
                variant="outline"
                className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8 flex flex-col gap-8">
        

        {/* Transaction Form */}
        {showForm && (
          <Card className="mb-8 border-emerald-200">
            <CardHeader>
              <CardTitle>New Transaction</CardTitle>
              <CardDescription>Enter transaction details</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionForm
                userId={user?.id}
                onSuccess={() => {
                  if (user?.id) fetchTransactions(user.id)
                  setShowForm(false)
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bank-filter" className="mb-2 block">Bank Name</Label>
                <select
                  id="bank-filter"
                  value={selectedBankName}
                  onChange={(e) => setSelectedBankName(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">All Bank Names</option>
                  {bankNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date-filter" className="mb-2 block">Date</Label>
                <input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <Label htmlFor="fund-filter" className="mb-2 block">Fund</Label>
                <select
                  id="fund-filter"
                  value={selectedFund}
                  onChange={(e) => setSelectedFund(e.target.value)}
                  className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">All Funds</option>
                  {fundOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            {(selectedBankName || selectedDate || selectedFund) && (
              <Button
                onClick={() => {
                  setSelectedBankName('')
                  setSelectedDate('')
                  setSelectedFund('')
                }}
                variant="outline"
                className="mt-4 text-emerald-600 border-emerald-300 hover:bg-emerald-50"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Transactions Header */}
<div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>

  <Button
    onClick={() => setShowForm(!showForm)}
    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
  >
    <Plus className="w-4 h-4" />
    {showForm ? 'Hide Form' : 'Add Transaction'}
  </Button>
</div>

        

        {/* Transaction Table */}
        <TransactionTable
          transactions={transactions}
          onTransactionDeleted={() => {
            if (user?.id) fetchTransactions(user.id)
          }}
          onTransactionUpdated={() => {
            if (user?.id) fetchTransactions(user.id)
          }}
        />
      </div>
    </div>
  )
}
