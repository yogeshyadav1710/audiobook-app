

const isLoggedIn = localStorage.getItem('userLoggedIn');
const userId = localStorage.getItem('userId');
// card.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('audiobook-container');
    // const isLoggedIn = localStorage.getItem('userLoggedIn');
    // const userId = localStorage.getItem('userId');

    axios.get('http://localhost:5000/audiobooks')
        .then(response => {
            const books = response.data;
            books.forEach(book => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4';  // Use Bootstrap's grid classes
                card.innerHTML = `
                    <div class="card">
                      <img src="${book.cover}" class="card-img-top" alt="${book.title} Cover">
                      <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.summary}</p>
                        ${isLoggedIn ?
                            `<audio controls>
                                <source src="${book.audiobook}" type="audio/mp3">
                             </audio>
                             <a href="${book.link}" class="btn btn-primary">Listen</a>
                             <button class="btn btn-secondary btn-favorite" data-book-id="${book.id}" data-type="audiobook">Add to Favorites</button>`
                            :
                            `<p><a href="./login.html" class="btn btn-secondary">Login to Listen</a></p>`
                        }
                      </div>
                    </div>
                `;
                container.appendChild(card); // Append the card to the container
            });

            if (isLoggedIn) {
                // Make sure the buttons are properly selected and event listeners are attached
                document.querySelectorAll('.btn-favorite').forEach(button => {
                    button.addEventListener('click', event => {
                        const bookId = event.target.getAttribute('data-book-id');
                        const type = event.target.getAttribute('data-type');
                        addToFavorites(userId, bookId, type);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching audiobooks:', error);
        });

    function addToFavorites(userId, itemId, type) {
        axios.get(`http://localhost:5000/favorites?userId=${userId}`)
            .then(response => {
                let userFavorites = response.data[0]; // Assuming one entry per user
                if (userFavorites) {
                    if (type === 'audiobook' && !userFavorites.audiobooks.includes(itemId)) {
                        userFavorites.audiobooks.push(itemId);
                    } else if (type === 'podcast' && !userFavorites.podcasts.includes(itemId)) {
                        userFavorites.podcasts.push(itemId);
                    }
                    axios.put(`http://localhost:5000/favorites/${userFavorites.id}`, userFavorites)
                        .then(() => {
                            alert('Added to favorites!');
                        })
                        .catch(error => {
                            console.error('Error updating favorites:', error);
                        });
                } else {
                    // Create a new favorites entry if it doesn't exist
                    const newFavorites = {
                        userId,
                        audiobooks: type === 'audiobook' ? [itemId] : [],
                        podcasts: type === 'podcast' ? [itemId] : []
                    };
                    axios.post('http://localhost:5000/favorites', newFavorites)
                        .then(() => {
                            alert('Added to favorites!');
                        })
                        .catch(error => {
                            console.error('Error creating favorites:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('podcast-container'); // Change to the new container ID


    axios.get('http://localhost:5000/podcasts')
        .then(response => {
            const podcasts = response.data;
            podcasts.forEach(podcast => {
                const card = document.createElement('div');
                card.className = 'col-md-4 mb-4'; // Ensure consistent column size
                card.innerHTML = `
                    <div class="card">
                        <img src="${podcast.cover}" class="card-img-top" alt="${podcast.title} Cover">
                        <div class="card-body">
                            <h5 class="card-title">${podcast.title}</h5>
                            <p class="card-text">${podcast.summary}</p>
                            ${isLoggedIn ?
                        `<audio controls>
                                    <source src="${podcast.audiobook}" type="audio/mp3">
                                </audio>
                                <a href="${podcast.link}" class="btn btn-primary">Listen</a>`
                        :
                        `<p><a href="./login.html" class="btn btn-secondary">Login to Listen</a></p>`
                    }
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

