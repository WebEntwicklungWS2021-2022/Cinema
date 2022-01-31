let movieData = null;

const cardContainer = document.getElementById('card-container');
const paginationElement = document.getElementById('pagination');

let currentPage = 0;

const cardWidth = 250;
const cardHeigth = 400;

window.addEventListener('load', onLoad());

async function fetchAsync (url) {
  const response = await window.fetch(url);
  const data = await response.json();
  return data;
}

async function onLoad () {
  movieData = await fetchAsync('/api/movies');
  displayCards(movieData.data, cardContainer, calcMaxCards());
  pagination(movieData.data, paginationElement, calcMaxCards());
}

window.addEventListener('resize', function (event) {

  if(currentPage > Math.ceil(movieData.data.length / calcMaxCards()) - 1){
    currentPage = Math.ceil(movieData.data.length / calcMaxCards() - 1);
    
  }
  console.log('ceil: ' + Math.ceil(movieData.data.length / calcMaxCards()));
  console.log('current Page: ' + currentPage);
  displayCards(movieData.data, cardContainer, calcMaxCards());
  pagination(movieData.data, paginationElement, calcMaxCards());
});

function calcMaxCards () {
  const maxCardsPerRow = Math.floor((window.innerWidth - 30) / (cardWidth));
  const maxCardsPerCol = Math.floor(((window.innerHeight - 160) / cardHeigth));
  const maxCardsPerPage = maxCardsPerCol * maxCardsPerRow;
  return maxCardsPerPage;
}

function displayCards (items, wrapper, cardsPerPage) {
  wrapper.innerHTML = '';

  const start = cardsPerPage * currentPage;
  const end = start + cardsPerPage;
  const paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    const element = paginatedItems[i];

    const card = document.createElement('div');
    card.classList.add('card');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardImage.style.background = `url(pictures/${element.posterName})`;
    cardImage.style.backgroundSize = 'cover';
    card.appendChild(cardImage);

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    const cardH2 = document.createElement('h2');
    cardH2.appendChild(document.createTextNode(element.name));
    cardTitle.appendChild(cardH2);

    card.appendChild(cardTitle);

    const a = document.createElement('a');
    a.setAttribute('href', 'reservation/'+ element.movieId);
    card.appendChild(a);

    const overlay = document.createElement('div');
    overlay.classList.add('card-overlay');
    a.appendChild(overlay);

    const overlayText = document.createElement('div');
    overlayText.classList.add('card-overlay-text');
    overlayText.appendChild(document.createTextNode('Reservieren'));
    overlay.appendChild(overlayText);

    wrapper.appendChild(card);
  }
}

function pagination (items, wrapper, cardsPerPage) {
  wrapper.innerHTML = '';

  const pageCount = Math.ceil(items.length / cardsPerPage);
  wrapper.appendChild(paginationButtonBack());
  for (let i = 0; i < pageCount; i++) {
    const button = paginationButton(i + 1);
    button.classList.add('button');
    button.innerText = i + 1;
    wrapper.appendChild(button);
  }
  wrapper.appendChild(paginationButtonForward());
}

function paginationButtonBack () {
  const buttonBack = document.createElement('button');
  buttonBack.classList.add('button-back');
  buttonBack.innerText = 'Previous';
  buttonBack.addEventListener('click', function () {
    if (currentPage !== 0) {
      currentPage--;
      displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);
      refreshActiveButton();
    }
  });
  return buttonBack;
}

function paginationButtonForward () {
  const buttonForward = document.createElement('button');
  buttonForward.classList.add('button-forward');
  buttonForward.innerText = 'Next';

  buttonForward.addEventListener('click', function () {
    if (currentPage !== Math.ceil(movieData.data.length / calcMaxCards()) - 1) {
      currentPage++;
      displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);
      refreshActiveButton();
    }
  });
  return buttonForward;
}

function paginationButton (page) {
  const paginationButton = document.createElement('button');
  paginationButton.innerText = page;

  if(currentPage == page - 1){
    paginationButton.classList.add('active');
  }

  paginationButton.addEventListener('click', function () {
    currentPage = page - 1;
    displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);

    let currentBtn = document.querySelector('.button.active')
    currentBtn.classList.remove('active');

    paginationButton.classList.add('active');
  });
  return paginationButton;
}


function refreshActiveButton(){
  let currentBtn = document.querySelector('.button.active')
  currentBtn.classList.remove('active');
  let newActiveButton = paginationElement.childNodes[currentPage + 1];
  newActiveButton.classList.add('active');
}
