// invoice.js

document.addEventListener('DOMContentLoaded', () => {
  // Parse transaction_id dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const transactionId = urlParams.get('transaction_id');

  if (transactionId) {
    // Fetch data transaksi dari API berdasarkan transaction_id
    fetch(`http://localhost/TEORI_WEB/PHP/api/transaction.php?id=${transactionId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.data) {
          const transaction = data.data;

          const locationElement = document.getElementById('invoice-location');
          const servicesElement = document.getElementById('invoice-services');
          const itemsElement = document.getElementById('invoice-items');
          const totalElement = document.getElementById('invoice-total');
          const errorElement = document.getElementById('invoice-error');

          // Set lokasi
          locationElement.textContent = transaction.laundry_location || 'Tidak ditentukan';

          // Ambil nama layanan dari transaksi_detail
          const transactionDetails = transaction.transaction_details;
          const offeredIds = transactionDetails.map(detail => detail.offered_id);
          
          // Remove duplicate offered_id
          const uniqueOfferedIds = [...new Set(offeredIds)];

          // Fetch data layanan berdasarkan offered_id
          fetch(`http://localhost/TEORI_WEB/PHP/api/service_offered.php?offered_ids=${uniqueOfferedIds.join(',')}`)
            .then(response => response.json())
            .then(serviceData => {
              if (serviceData.success && Array.isArray(serviceData.data)) {
                const services = serviceData.data;
                const serviceMap = {};

                services.forEach(service => {
                  serviceMap[service.offered_id] = service.offered_name;
                });

                // Set nama layanan
                const serviceNames = uniqueOfferedIds.map(id => serviceMap[id] || `Service ${id}`);
                servicesElement.textContent = serviceNames.join(', ');

                // Populate items list dan hitung total
                let total = 0;
                transactionDetails.forEach(detail => {
                  const serviceName = serviceMap[detail.offered_id] || `Service ${detail.offered_id}`;
                  const quantity = detail.value_count;
                  const price = detail.sum_offered_price;

                  const listItem = document.createElement('li');
                  listItem.innerHTML = `${serviceName} x${quantity} <span>Rp ${price.toLocaleString()}</span>`;
                  itemsElement.appendChild(listItem);

                  total += price;
                });

                // Set total harga
                totalElement.textContent = `Rp ${total.toLocaleString()}`;
              } else {
                // Jika gagal mengambil data layanan
                errorElement.textContent = 'Gagal mengambil data layanan.';
                errorElement.style.display = 'block';
                document.getElementById('invoice-details').style.display = 'none';
              }
            })
            .catch(error => {
              console.error('Error fetching services:', error);
              errorElement.textContent = 'Terjadi kesalahan saat mengambil data layanan.';
              errorElement.style.display = 'block';
              document.getElementById('invoice-details').style.display = 'none';
            });
        } else {
          // Jika data transaksi tidak ditemukan
          const errorElement = document.getElementById('invoice-error');
          errorElement.textContent = 'Data transaksi tidak ditemukan.';
          errorElement.style.display = 'block';
          document.getElementById('invoice-details').style.display = 'none';
        }
      })
      .catch(error => {
        console.error('Error fetching transaction data:', error);
        const errorElement = document.getElementById('invoice-error');
        errorElement.textContent = 'Terjadi kesalahan saat mengambil data transaksi.';
        errorElement.style.display = 'block';
        document.getElementById('invoice-details').style.display = 'none';
      });
  } else {
    // Jika transaction_id tidak ditemukan dalam URL
    const errorElement = document.getElementById('invoice-error');
    errorElement.textContent = 'ID transaksi tidak ditemukan.';
    errorElement.style.display = 'block';
    document.getElementById('invoice-details').style.display = 'none';
  }

  // Event listener untuk tombol kembali
  const backButton = document.getElementById('back-to-transaction');
  backButton.addEventListener('click', () => {
    window.location.href = '../transaction/transaction.html';
  });
});
