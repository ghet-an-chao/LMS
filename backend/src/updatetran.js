const sql = require('mssql');
const config = require('../config');

async function handleUpdateTransaction(req, res) {
  try {
    const { id } = req.params; // txn_id
    const { status, gateway_ref } = req.body;

    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing transaction id'
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing status field'
      });
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid status value'
      });
    }

    const pool = await sql.connect(config);

    // Kiểm tra transaction tồn tại
    const txnCheck = await pool.request()
      .input('txn_id', sql.Int, id)
      .query('SELECT txn_id FROM [Transaction] WHERE txn_id = @txn_id');

    if (txnCheck.recordset.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Transaction not found'
      });
    }

    // Update transaction
    const updateResult = await pool.request()
      .input('txn_id', sql.Int, id)
      .input('status', sql.VarChar(10), status)
      .input('gateway_ref', sql.VarChar(100), gateway_ref || null)
      .query(`
        UPDATE [Transaction]
        SET status = @status,
            gateway_ref = @gateway_ref
        OUTPUT INSERTED.txn_id, INSERTED.course_id, INSERTED.amount_vnd,
               INSERTED.status, INSERTED.gateway_ref, INSERTED.created_at
        WHERE txn_id = @txn_id
      `);

    const transaction = updateResult.recordset[0];

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleUpdateTransaction };