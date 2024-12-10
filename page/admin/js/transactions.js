// transactions.js

document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions();

    function fetchTransactions() {
        fetch('http://localhost:8000/api/transaction.php')
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    const tbody = document.querySelector('#transaction-table tbody');
                    tbody.innerHTML = '';
                    data.data.forEach(transaction => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${transaction.transaction_id}</td>
                            <td>${transaction.user_id}</td>
                            <td>${transaction.laundry_location}</td>
                            <td><button class="action-btn" onclick="viewDetails(${transaction.transaction_id})">Detail</button></td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.viewDetails = function(id) {
        fetch(`http://localhost:8000/api/transaction.php?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    const details = data.data;
                    const detailDiv = document.getElementById('transaction-details');
                    
                    // Hitung Total Keseluruhan Harga
                    let totalKeseluruhan = 0;

                    // Buat HTML untuk detail transaksi menggunakan tabel yang lebih rapi
                    let detailHTML = `
                        <p><strong>ID Transaksi:</strong> ${details.transaction_id}</p>
                        <p><strong>User ID:</strong> ${details.user_id}</p>
                        <p><strong>Lokasi Laundry:</strong> ${details.laundry_location}</p>
                        <h3>Detail Layanan</h3>
                        <table class="detail-table">
                            <thead>
                                <tr>
                                    <th>Offered ID</th>
                                    <th>Jumlah</th>
                                    <th>Harga Satuan</th>
                                    <th>Total Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;
                    
                    details.transaction_details.forEach(detail => {
                        const totalHarga = detail.sum_offered_price * detail.value_count;
                        totalKeseluruhan += totalHarga;
                        detailHTML += `
                            <tr>
                                <td>${detail.offered_id}</td>
                                <td>${detail.value_count}</td>
                                <td>Rp ${formatNumber(detail.sum_offered_price)}</td>
                                <td>Rp ${formatNumber(totalHarga)}</td>
                            </tr>
                        `;
                    });

                    // Tambahkan baris Total Keseluruhan
                    detailHTML += `
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="3" style="text-align: right;"><strong>Total Keseluruhan:</strong></td>
                                    <td><strong>Rp ${formatNumber(totalKeseluruhan)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    `;
                    
                    detailDiv.innerHTML = detailHTML;
                    openModal();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    // Fungsi untuk memformat angka dengan titik sebagai pemisah ribuan
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Modal functionality
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.onclick = function() {
        closeModal();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    function openModal(){
        modal.style.display = "block";
    }

    function closeModal(){
        modal.style.display = "none";
        document.getElementById('transaction-details').innerHTML = '';
    }
});
