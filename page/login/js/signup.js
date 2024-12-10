document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signupForm");
    const loadingElement = document.getElementById("loading");
    const errorElement = document.getElementById("error");
  
    function showLoading() {
      if (loadingElement) loadingElement.style.display = "block";
      if (errorElement) errorElement.style.display = "none";
    }
  
    function hideLoading() {
      if (loadingElement) loadingElement.style.display = "none";
    }
  
    function showError(message) {
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
      }
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        showLoading();
  
        const formData = {
          profile_image: document.getElementById("profile_image")?.value || "",
          name: document.getElementById("name")?.value || "",
          username: document.getElementById("username")?.value || "",
          email: document.getElementById("email")?.value || "",
          password: document.getElementById("password")?.value || "",
          terms: document.getElementById("terms")?.checked || false,
        };
  
        if (!formData.terms) {
          showError("You must agree to the terms and conditions.");
          hideLoading();
          return;
        }
  
        fetch("http://localhost/TEORI_WEB/page/signup/signup.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to sign up");
            return response.json();
          })
          .then((data) => {
            hideLoading();
            if (data.error) {
              showError(data.error);
            } else {
              alert(data.message || "Account created successfully");
              signupForm.reset();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            hideLoading();
            showError("An error occurred. Please try again.");
          });
      });
    }
  });