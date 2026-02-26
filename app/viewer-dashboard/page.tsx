'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ViewerTransactionTable from '@/components/ViewerTransactionTable'
import PrintReport from '@/components/PrintReport'
import { LogOut, ChevronDown, Settings, Printer } from 'lucide-react'
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
  createdAt: string
  userId: string
  fund: string
}

type SortField = 'date' | 'controlNumber' | 'amount' | 'accountCode' | 'fund'

export default function ViewerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [assignedEntryUsers, setAssignedEntryUsers] = useState<any[]>([])
  const [selectedEntryUser, setSelectedEntryUser] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEntryUserEmail, setSelectedEntryUserEmail] = useState<string>('')
  const [bankNames, setBankNames] = useState<string[]>([])
  const [selectedBankName, setSelectedBankName] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedFund, setSelectedFund] = useState<string>('')
  const printRef = useRef<HTMLDivElement>(null)
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
      if (user.role !== 'viewer_user') {
        router.push('/entry-dashboard')
        return
      }

      setUser(user)
      fetchAssignedEntryUsers(user.id)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const fetchAssignedEntryUsers = async (viewerId: string) => {
    try {
      const response = await fetch(`/api/viewer-assignments?viewerId=${viewerId}`)
      if (response.ok) {
        const data = await response.json()
        setAssignedEntryUsers(data)
        if (data.length > 0) {
          setSelectedEntryUser(data[0].entryUserId)
          setSelectedEntryUserEmail(data[0].email || '')
          await fetchTransactions(data[0].entryUserId)
        }
      }
    } catch (error) {
      console.error('Error fetching assigned users:', error)
    }
  }

  const fetchTransactions = async (entryUserId: string) => {
    try {
      const response = await fetch(`/api/transactions?userId=${entryUserId}`)
      if (response.ok) {
        const data = await response.json()
        setAllTransactions(data)
        extractBankNames(data)
        setSortedTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const extractBankNames = (txs: Transaction[]) => {
    const names = Array.from(new Set(txs.map(tx => tx.bankName).filter(Boolean)))
    setBankNames(names.sort())
  }

  const applyFiltersAndSort = (data: Transaction[]) => {
    let filtered = [...data]
    
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

    let sorted = [...filtered]
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'controlNumber':
        sorted.sort((a, b) => a.controlNumber.localeCompare(b.controlNumber))
        break
      case 'amount':
        sorted.sort((a, b) => b.amount - a.amount)
        break
      case 'accountCode':
        sorted.sort((a, b) => a.accountCode.localeCompare(b.accountCode))
        break
      case 'fund':
        sorted.sort((a, b) => a.fund.localeCompare(b.fund))
        break
    }
    setTransactions(sorted)
  }

  const setSortedTransactions = (data: Transaction[]) => {
    applyFiltersAndSort(data)
  }

  const handleSortChange = (field: SortField) => {
    setSortBy(field)
    applyFiltersAndSort(allTransactions)
  }

  useEffect(() => {
    if (allTransactions.length > 0) {
      applyFiltersAndSort(allTransactions)
    }
  }, [selectedBankName, selectedDate, selectedFund, sortBy, allTransactions])

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
          <div>
            <h1 className="text-2xl font-bold text-emerald-900">Viewer Dashboard</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
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
      <div className="w-full px-6 py-8">
        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name
              </label>
              <div className="relative">
                <select
                  value={selectedBankName}
                  onChange={(e) => setSelectedBankName(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
                >
                  <option value="">All Bank Names</option>
                  {bankNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fund
              </label>
              <div className="relative">
                <select
                  value={selectedFund}
                  onChange={(e) => setSelectedFund(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
                >
                  <option value="">All Funds</option>
                  {fundOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortField)}
                  className="w-full appearance-none rounded-lg border border-emerald-200 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
                >
                  <option value="date">Date</option>
                  <option value="controlNumber">Control Number</option>
                  <option value="amount">Amount</option>
                  <option value="accountCode">Account Code</option>
                  <option value="fund">Fund</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {(selectedBankName || selectedDate || selectedFund) && (
            <button
              onClick={() => {
                setSelectedBankName('')
                setSelectedDate('')
                setSelectedFund('')
              }}
              className="mt-4 text-emerald-600 text-sm hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Transaction Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Transactions</h2>
            <Button
              onClick={() => {
                const printWindow = window.open('', '', 'height=1000,width=1200')
                if (printWindow && printRef.current) {
                  printWindow.document.write(printRef.current.outerHTML)
                  printWindow.document.close()
                  printWindow.print()
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={transactions.length === 0}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </div>
          <ViewerTransactionTable transactions={transactions} />
        </div>
      </div>

      {/* Hidden Print Report */}
      <div className="hidden">
        <PrintReport
          ref={printRef}
          transactions={transactions}
          entryUserEmail={selectedEntryUserEmail}
        />
      </div>
    </div>
  )
}
