// messages.js

document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();

    function fetchMessages() {
        fetch('http://localhost:8000/api/messages.php')
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    const tbody = document.querySelector('#messages-table tbody');
                    tbody.innerHTML = '';
                    data.data.forEach(message => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${message.send_id}</td>
                            <td>${message.contact_id || 'N/A'}</td>
                            <td>${message.contact_name}</td>
                            <td>${message.contact_email}</td>
                            <td>${message.contact_message}</td>
                            <td><button class="action-btn" onclick="deleteMessage(${message.send_id})">Hapus</button></td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.deleteMessage = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
            fetch(`http://localhost:8000/api/messages.php?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchMessages();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
});
