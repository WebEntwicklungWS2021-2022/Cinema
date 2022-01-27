// const currentCards = 10;

let movieData = null;

const cardContainer = document.getElementById('card-container');
const pagnationElement = document.getElementById('pagination');

const currentPage = 1;
const rows = 0;

const cardWidth = 250;
const cardHeigth = 400;

window.addEventListener('resize', reportWindowSize);
window.addEventListener('load', onLoad());

async function fetchAsync (url) {
  const response = await window.fetch(url);
  const data = await response.json();
  return data;
}

async function onLoad () {
  movieData = await fetchAsync('/api/movies');
  displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);
}

function reportWindowSize () {
  calcMaxCards(window.innerWidth, window.innerHeight);
}

function calcMaxCards () {
  const maxCardsPerRow = Math.floor((window.innerWidth - 30) / (cardWidth));
  const maxCardsPerCol = Math.floor(((window.innerHeight - 70) / cardHeigth));
  const maxCardsPerPage = maxCardsPerCol * maxCardsPerRow;
  console.log('Max Cards Per Page: ' + maxCardsPerPage);
  return maxCardsPerPage;
}

function displayCards (items, wrapper, cardsPerPage, page) {
  wrapper.innerHTML = '';

  console.log(items);

  items.forEach(element => {

      const card = document.createElement('div')
      card.classList.add('card');

      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      cardImage.style.background = `url(pictures/${element.posterName})`
      cardImage.style.backgroundSize = 'cover' 
      card.appendChild(cardImage);

      const cardTitle = document.createElement('div');
      cardTitle.classList.add('card-title');
      const cardH2 = document.createElement('h2');
      cardH2.appendChild(document.createTextNode(element.name));
      cardTitle.appendChild(cardH2);

      card.appendChild(cardTitle);


      const a = document.createElement('a');
      a.setAttribute("href", "#");
      card.appendChild(a);

      const overlay = document.createElement('div');
      overlay.classList.add('card-overlay');
      a.appendChild(overlay);

      const overlayText = document.createElement('div');
      overlayText.classList.add('card-overlay-text');
      overlayText.appendChild(document.createTextNode("Reservieren"));
      overlay.appendChild(overlayText);
      

      
    wrapper.appendChild(card);
  });
}

/*
function insertCards () {
  document.getElementById('card-container').innerHTML += `

  <div class="card">
  <div class="card-image"></div>
  <div class="card-title"> <h2> The Room </h2> </div>

  <a href="#reservation">
    <div class="card-overlay">

      <div class="card-overlay-text">
        Reservieren
      </div>
    </div>
  </a>
</div>

  `;
}
*/
