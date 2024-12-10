// comments.js

document.addEventListener('DOMContentLoaded', () => {
    fetchComments();

    function fetchComments() {
        fetch('http://localhost:8000/api/comments.php')
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    const tbody = document.querySelector('#comments-table tbody');
                    tbody.innerHTML = '';
                    data.data.forEach(comment => {
                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td>${comment.comments_id}</td>
                            <td>${comment.user_id}</td>
                            <td>${comment.offered_id}</td>
                            <td>${comment.stars}</td>
                            <td>${comment.user_comment}</td>
                            <td><button class="action-btn" onclick="deleteComment(${comment.comments_id})">Hapus</button></td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    alert(data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.deleteComment = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
            fetch(`http://localhost:8000/api/comments.php?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    fetchComments();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
});
