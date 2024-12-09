document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loadingElement = document.getElementById("loading");
    const errorElement = document.getElementById("error");
  
    function showLoading() {
      loadingElement.style.display = "block";
      errorElement.style.display = "none";
    }
  
    function hideLoading() {
      loadingElement.style.display = "none";
    }
  
    function showError(message) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showLoading();
  
      // Ambil data dari form
      const formData = {
        profile_image: document.getElementById("profile_image").value, // Profile Image URL
        name: document.getElementById("name").value, // Nama lengkap
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        terms: document.getElementById("terms").checked, // Terms acceptance
      };
  
      // Validasi form (optional)
      if (!formData.terms) {
        showError("You must agree to the terms and conditions.");
        hideLoading();
        return;
      }
  
      // Kirim data ke server
      fetch("/page/signup/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal melakukan sign-up");
          }
          return response.json();
        })
        .then((data) => {
          hideLoading();
          if (data.error) {
            showError(data.error);
          } else {
            alert(data.message || "Akun berhasil dibuat");
            signupForm.reset();
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          hideLoading();
          showError("Terjadi kesalahan. Silakan coba lagi.");
        });
    });
  });
  