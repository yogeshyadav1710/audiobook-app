document.addEventListener('DOMContentLoaded', function() {
    const carouselInner = document.querySelector('#audiobookCarousel .carousel-inner');
  
    function createCarouselItem(item) {
      return `
        <div class="carousel-item">
          <img src="${item.cover}" alt="${item.title}">
        </div>
      `;
    }
  
    function fetchData() {
      axios.get('http://localhost:5000/audiobooks')
        .then(response => {
          const audiobooks = response.data;
          // Duplicate the array to create a seamless scroll effect
          const items = audiobooks.concat(audiobooks).map(createCarouselItem).join('');
          carouselInner.innerHTML = items;
          $('#audiobookCarousel').carousel({
            interval: 2000, // Adjust the speed of the scrolling here
            wrap: true
          });
        })
        .catch(error => console.error('Error fetching audiobooks:', error));
    }
  
    fetchData();
  });
  