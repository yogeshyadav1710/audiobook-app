document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await axios.get('http://localhost:5000/users', {
      params: {
        email: email,
        password: password
      }
    });

    if (response.data.length > 0) {
      const user = response.data[0]; // Assuming first match is the correct user
      
      localStorage.setItem('userLoggedIn', true); // Set login status in localStorage
      localStorage.setItem('userId', user.id); // Store the user ID
      window.location.href = './index.html'; // Redirect to homepage
    } else {
      alert('Invalid email or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
});