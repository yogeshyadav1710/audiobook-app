document.addEventListener("DOMContentLoaded", function () {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("userLoggedIn");
  
    if (userLoggedIn) {
      // User is logged in, show Logout and hide Login/Register
      document.getElementById("loginNav").style.display = "none";
      document.getElementById("registerNav").style.display = "none";
      document.getElementById("logoutNav").style.display = "block";
    } else {
      // User is not logged in, show Login/Register and hide Logout
      document.getElementById("logoutNav").style.display = "none";
      document.getElementById("loginNav").style.display = "block";
      document.getElementById("registerNav").style.display = "block";
    }
  
    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("userLoggedIn"); // Remove login status
      window.location.href = "./index.html"; // Redirect to homepage
    });
  
    // get audiobooks
    document
      .getElementById("audiobookBtn")
      .addEventListener("click", async function (event) {
        try {
          const response = await axios.get("http://localhost:5000/audiobooks" )
  
        } catch (error) {
          console.error("Error logging in:", error);
        }
      });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const logoutNav = document.getElementById('logoutNav');
    const profileNav = document.getElementById('profileNav');
    const usernameElement = document.getElementById('username');
    const profilePicElement = document.getElementById('profilePic');
  
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userId = localStorage.getItem('userId');
  
    if (isLoggedIn && userId) {
      // Hide Login and Register links
      loginNav.style.display = 'none';
      registerNav.style.display = 'none';
  
      // Show Logout and Profile dropdown
      logoutNav.style.display = 'block';
      profileNav.style.display = 'block';
  
      // Fetch the user's data from db.json
      fetch(`http://localhost:5000/users/${userId}`)
        .then(response => response.json())
        .then(user => {
          if (user) {
            // Update username and profile picture
            usernameElement.textContent = user.username || 'User';
            if (user.profilePic) {
              profilePicElement.src = user.profilePic;
            }
          }
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      // Hide Logout and Profile dropdown
      logoutNav.style.display = 'none';
      profileNav.style.display = 'none';
  
      // Show Login and Register links
      loginNav.style.display = 'block';
      registerNav.style.display = 'block';
    }
  
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function () {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userId');
      window.location.href = 'login.html'; // Redirect to login page after logout
    });
  });
  