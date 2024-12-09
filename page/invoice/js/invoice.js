document.addEventListener('DOMContentLoaded', async () => {
  const transactionId = localStorage.getItem('transactionId'); // Ambil transactionId dari localStorage
  if (!transactionId) {
    alert('Transaction ID not found!');
    return;
  }

  try {
    const response = await fetch(`http://localhost/laundry/api/invoice.php?transaction_id=${transactionId}`);
    const data = await response.json();

    if (data.status === 'success') {
      // Tampilkan data transaksi
      document.getElementById('transaction-id').innerText = data.transaction.transaction_id;
      document.getElementById('customer-address').innerText = data.transaction.laundry_location;

      // Render item detail
      const itemsContainer = document.getElementById('invoice-items');
      let totalAmount = 0;

      data.details.forEach(detail => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${detail.service_name}</td>
          <td>${detail.value_count}</td>
          <td>Rp ${parseFloat(detail.price).toFixed(2)}</td>
          <td>Rp ${parseFloat(detail.sum_offered_price).toFixed(2)}</td>
        `;
        totalAmount += parseFloat(detail.sum_offered_price);
        itemsContainer.appendChild(row);
      });

      // Total Amount
      document.getElementById('total-amount').innerText = `Rp ${totalAmount.toFixed(2)}`;
    } else {
      alert('Failed to fetch invoice details: ' + data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while fetching the invoice details.');
  }
});
