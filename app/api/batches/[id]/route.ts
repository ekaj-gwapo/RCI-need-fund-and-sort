import { getDb, initDb } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// GET batch details with transactions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDb()
    const db = await getDb()
    const batchId = params.id

    // Get batch metadata
    const batch = await db.get(
      'SELECT * FROM transaction_batches WHERE id = ?',
      [batchId]
    )

    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      )
    }

    // Get batch transactions
    const batchTransactions = await db.all(
      `SELECT id, transactionId, transactionData, createdAt 
       FROM batch_transactions 
       WHERE batchId = ? 
       ORDER BY createdAt DESC`,
      [batchId]
    )

    // Parse transaction data
    const transactions = batchTransactions.map((bt: any) => ({
      ...JSON.parse(bt.transactionData),
      batchTransactionId: bt.id,
    }))

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching batch details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch batch details' },
      { status: 500 }
    )
  }
}

// POST restore transactions from batch
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDb()
    const db = await getDb()
    const batchId = params.id
    const body = await request.json()

    const { transactionIds } = body

    if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
      return NextResponse.json(
        { error: 'No transaction IDs provided' },
        { status: 400 }
      )
    }

    // Get the batch transactions data
    const placeholders = transactionIds.map(() => '?').join(',')
    const batchTxs = await db.all(
      `SELECT transactionData FROM batch_transactions 
       WHERE batchId = ? AND transactionId IN (${placeholders})`,
      [batchId, ...transactionIds]
    )

    if (batchTxs.length === 0) {
      return NextResponse.json(
        { error: 'No transactions found in batch' },
        { status: 404 }
      )
    }

    // Restore transactions back to main transactions table
    const restoredTransactions = []
    const batchTxIds = []
    
    for (const batchTx of batchTxs) {
      const txData = JSON.parse(batchTx.transactionData)
      
      // Re-insert the transaction
      await db.run(
        `INSERT INTO transactions (id, userId, bankName, payee, address, dvNumber, particulars, amount, date, controlNumber, accountCode, debit, credit, remarks, fund, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          txData.id,
          txData.userId,
          txData.bankName,
          txData.payee,
          txData.address,
          txData.dvNumber,
          txData.particulars,
          txData.amount,
          txData.date,
          txData.controlNumber,
          txData.accountCode,
          txData.debit,
          txData.credit,
          txData.remarks,
          txData.fund,
          txData.createdAt,
        ]
      )

      restoredTransactions.push(txData)
      batchTxIds.push(txData.id)
    }

    // Remove restored transactions from batch_transactions table
    if (batchTxIds.length > 0) {
      const placeholders = batchTxIds.map(() => '?').join(',')
      await db.run(
        `DELETE FROM batch_transactions WHERE batchId = ? AND transactionId IN (${placeholders})`,
        [batchId, ...batchTxIds]
      )

      // Update batch count and amount
      const updatedBatch = await db.get(
        `SELECT COUNT(*) as count, COALESCE(SUM(CAST(json_extract(transactionData, '$.amount') AS REAL)), 0) as total 
         FROM batch_transactions WHERE batchId = ?`,
        [batchId]
      )

      await db.run(
        `UPDATE transaction_batches SET transactionCount = ?, totalAmount = ? WHERE id = ?`,
        [updatedBatch.count, updatedBatch.total, batchId]
      )
    }

    return NextResponse.json({
      success: true,
      restoredCount: restoredTransactions.length,
      transactions: restoredTransactions,
    })
  } catch (error) {
    console.error('Error restoring transactions:', error)
    return NextResponse.json(
      { error: 'Failed to restore transactions' },
      { status: 500 }
    )
  }
}
