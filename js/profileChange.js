document.addEventListener('DOMContentLoaded', function () {
  const profilePicElement = document.getElementById('profilePic');
  const changeProfilePicLink = document.getElementById('changeProfilePic');
  const profilePicForm = document.getElementById('profilePicForm');
  const profilePicInput = document.getElementById('profilePicInput');
  const changeProfilePicModal = new bootstrap.Modal(document.getElementById('changeProfilePicModal'));

  // Import Axios
  const axios = window.axios;

  // Get the logged-in user's ID from localStorage
  const currentUserId = localStorage.getItem('userId');

  if (!currentUserId) {
    console.error('User not logged in')
    return;
  }

  // Show modal when 'Change Profile Picture' is clicked
  changeProfilePicLink.addEventListener('click', function () {
    changeProfilePicModal.show();
  });

  // Handle form submission
  profilePicForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const file = profilePicInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const profilePicDataUrl = reader.result;

        // Update the profile picture for the logged-in user in the db.json via API
        axios.patch(`http://localhost:5000/users/${currentUserId}`, { profilePic: profilePicDataUrl })
          .then(response => {
            profilePicElement.src = profilePicDataUrl; // Update the profile picture on the page
            changeProfilePicModal.hide(); // Hide the modal
          })
          .catch(error => {
            console.error('Error updating profile picture:', error);
          });
      };
      reader.readAsDataURL(file);
    }
  });

  // Fetch and display the current user's profile picture from db.json
  axios.get(`http://localhost:5000/users/${currentUserId}`)
    .then(response => {
      const user = response.data;
      if (user.profilePic) {
        profilePicElement.src = user.profilePic; // Set the profile picture from the db
      }
    })
    .catch(error => {
      console.error('Error fetching profile picture:', error);
    });
});
