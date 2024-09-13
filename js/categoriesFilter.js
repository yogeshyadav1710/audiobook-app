document.addEventListener('DOMContentLoaded', () => {
    const genreDropdown = document.getElementById('genreDropdown');
    const audiobookContainer = document.getElementById('audiobook-container');
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const userId = localStorage.getItem('userId');

    // Fetch genres and populate the dropdown
    axios.get('http://localhost:5000/audiobooks')
        .then(response => {
            const books = response.data;
            const genres = [...new Set(books.map(book => book.genre))]; // Extract unique genres

            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching genres:', error);
        });

    // Event listener for genre selection
    genreDropdown.addEventListener('change', (event) => {
        const selectedGenre = event.target.value;
        filterAudiobooksByGenre(selectedGenre);
    });

    function filterAudiobooksByGenre(genre) {
        axios.get('http://localhost:5000/audiobooks')
            .then(response => {
                const books = response.data;
                const filteredBooks = genre ? books.filter(book => book.genre === genre) : books;

                audiobookContainer.innerHTML = ''; // Clear previous results

                filteredBooks.forEach(book => {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';
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
                    audiobookContainer.appendChild(card); // Append the card to the container
                });

                if (isLoggedIn) {
                    // Attach event listeners to "Add to Favorites" buttons
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
    }

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
