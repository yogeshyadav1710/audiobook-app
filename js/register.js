document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorMessage = document.getElementById('error-message');

  // Basic Validation
  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match!";
    return;
  }

  if (phone.length < 10) {
    errorMessage.textContent = "Phone number must be at least 10 digits!";
    return;
  }

  // Clear any previous error messages
  errorMessage.textContent = "";

  try {
    // Make the API request using axios (adjust the URL and payload as needed)
    const response = await axios.post('http://localhost:5000/users', {
      name: name,
      email: email,
      phone: phone,
      password: password,
      profilePic: "assets\profileAvatar.svg"
    });
    // Handle successful registration
    if (response.status == 201) {
      window.location.href = './login.html'; // Redirect to login page
    }
  } catch (error) {
    // Handle errors (e.g., email already exists, server errors)
    if (error.response && error.response.data) {
      errorMessage.textContent = error.response.data.message;
    } else {
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  }
});
