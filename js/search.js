// Function to check if the user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('userLoggedIn') === 'true'; // Check login status from localStorage
}


// search.js
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim().toLowerCase(); // Convert query to lowercase
        if (query) {
            searchAudiobooks(query);
            searchPodcasts(query);
        }
    });
});

function searchAudiobooks(query) {
    axios.get('http://localhost:5000/audiobooks')
        .then(response => {
            const books = response.data;
            const container = document.getElementById('audiobook-container');
            container.innerHTML = ''; // Clear previous results

            const results = books.filter(book => {
                const titleMatch = book.title.toLowerCase().includes(query);
                const authorMatch = book.author.toLowerCase().includes(query);
                const genreMatch = book.genre.toLowerCase().includes(query);

                return titleMatch || authorMatch || genreMatch;
            });

            if (results.length > 0) {
                results.forEach(book => {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';
                    
                    const isLoggedIn = isUserLoggedIn();
                    const button = isLoggedIn 
                        ? `<a href="${book.link}" class="btn btn-primary">Listen</a>` 
                        : `<p class="text-danger">Please <a href="login.html">log in</a> to listen.</p>`;
                    
                    card.innerHTML = `
                        <div class="card">
                            <img src="${book.cover}" class="card-img-top" alt="${book.title} Cover">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.summary}</p>
                                ${button} <!-- Conditional button based on login status -->
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            
            } else {
                container.innerHTML = `
        <div class="col-md-12">
            <div class="card no-results-card animate__animated animate__fadeIn">
                <div class="card-body text-center">
                    <h5 class="card-title text-danger">Oops! No Podcasts Found</h5>
                    <p class="card-text">
                        We couldn't find any audiobooks that match your search criteria.
                    </p>
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <p class="card-text">
                        Try adjusting your search terms, or explore other categories.
                    </p>
                    <a href="categories.html" class="btn btn-outline-info">Explore Categories</a>
                </div>
            </div>
        </div>
    `;
            }
        })
        .catch(error => {
            console.error('Error fetching audiobooks:', error);
        });
}

function searchPodcasts(query) {
    axios.get('http://localhost:5000/podcasts')
        .then(response => {
            const podcasts = response.data;
            const container = document.getElementById('podcast-container');
            container.innerHTML = ''; // Clear previous results

            const results = podcasts.filter(podcast => {
                const titleMatch = podcast.title.toLowerCase().includes(query.toLowerCase());
                const authorMatch = podcast.author.toLowerCase().includes(query.toLowerCase());
                const genreMatch = podcast.genre.toLowerCase().includes(query.toLowerCase());

                return titleMatch || authorMatch || genreMatch;
            });

            if (results.length > 0) {
                results.forEach(podcast => {
                    const card = document.createElement('div');
                    card.className = 'col-md-4 mb-4';
                    card.innerHTML = `
                        <div class="card">
                            <img src="${podcast.cover}" class="card-img-top" alt="${podcast.title} Cover">
                            <div class="card-body">
                                <h5 class="card-title">${podcast.title}</h5>
                                <p class="card-text">${podcast.summary}</p>
                                <a href="${podcast.link}" class="btn btn-primary">Listen</a>
                            </div>
                        </div>
                    `;
                    container.appendChild(card);
                });
            } else {
                container.innerHTML = `
                    <div class="col-md-12 mb-5">
                        <div class="card no-results-card">
                            <div class="card-body text-center">
                                <h5 class="card-title text-danger">Oops! No Podcasts Found</h5>
                                <p class="card-text">
                                    We couldn't find any podcasts that match your search criteria.
                                </p>
                                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                                <p class="card-text">
                                    Try adjusting your search terms, or explore other categories.
                                </p>
                                <a href="categories.html" class="btn btn-outline-info">Explore Categories</a>
                            </div>
                        </div>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching podcasts:', error);
        });
}
