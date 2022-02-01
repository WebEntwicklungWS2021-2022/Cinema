let movieData = null;
window.addEventListener('load', onLoad());
var urlLink = null;
/* Joud's code */
var container;
var seats;
var count = null;
var total = null;
var timeSelect = null;
var reserverdSeat = null;
var ticketPrice = null;
let timer = null;

// get data from localstorage and populate ui
function populateUI() {
  timeSelect = document.getElementById('time');
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add('selected');
      }
    });
  }

  const selectedMovieTimeIndex = localStorage.getItem('selectedMovieTimeIndex');

  if (selectedMovieTimeIndex !== null) {
    timeSelect.selectedIndex = selectedMovieTimeIndex;
  }
}

function getParam(url) {
  var string = url
  return string.split("/")[4];
}

function displayMovieReservation(items) {
  const posterDiv = document.getElementById('poster-img');
  const img = document.createElement('img');
  const title = document.getElementById('title');
  timeSelect = document.getElementById('time');
  var posterName = null;
  var MovieName = null;
  var timestamp = [];

  for (var item in items) {
    let i = 0;
    var innerItems = items[item]
    for (var inner in innerItems) {
      MovieName = innerItems[inner].name;
      posterName = innerItems[inner].posterName;
    }
  }
  img.src = `../pictures/` + posterName;
  posterDiv.appendChild(img);
  populateSelect(timeSelect, items);
  const h2 = document.createElement('h2');
  const textNode = document.createTextNode(MovieName);
  h2.appendChild(textNode);
  title.appendChild(h2);
  populateUI();
}

// Save selected movie index and price
function setMovieData(movieTimeIndex, moviePrice) {
  localStorage.setItem('selectedMovieTimeIndex', movieTimeIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}

// update total and count
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));

  //copy selected seats into arr
  // map through array
  //return new array of indexes

  const selectedSeatsCount = selectedSeats.length;
  const anchor = document.getElementById('kaufen');
  if (selectedSeatsCount > 0) {
    anchor.style.pointerEvents="auto";
    anchor.style.cursor="pointer";
  }else{
    anchor.style.pointerEvents="none";
    anchor.style.cursor="default";
  }
  urlLink = document.URL;
  if (urlLink.includes('reservation')) {
    count = document.getElementById('count');
    total = document.getElementById('total');
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
  }
}

function populateSelect(target, items) {
  if (!target) {
    return false;
  } else {
    var posterName = null;
    var MovieName = null;
    var timestamp = [];
    var timePrice = [];
    for (var item in items) {
      var innerItems = items[item]
      for (var inner in innerItems) {
        posterName = innerItems[inner].posterName;
        timestamp.push(innerItems[inner].timestamp);
        timePrice.push(innerItems[inner].price)
      }
    }
    for (let i = 0; i < timestamp.length; i++) {
      var opt = document.createElement('option');
      opt.value = timePrice[i];
      opt.innerHTML = timestamp[i];
      target.appendChild(opt);
    }
  }
}

// intial count and total
urlLink = document.URL;
  if (urlLink.includes('reservation')){
    updateSelectedCount();
  }

/********************************************************************************************************/

/* Christopher's Code */
var currentPage = 0;
const cardWidth = 250;
const cardHeigth = 400;


function calcMaxCards() {
  const maxCardsPerRow = Math.floor((window.innerWidth - 30) / (cardWidth));
  const maxCardsPerCol = Math.floor(((window.innerHeight - 160) / cardHeigth));
  const maxCardsPerPage = maxCardsPerCol * maxCardsPerRow;
  return Math.max(maxCardsPerPage, 1);
}

function displayCards(items, wrapper, cardsPerPage) { 
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
      a.setAttribute('href', `reservation/${element.movieId}`);
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


function pagination(items, wrapper, cardsPerPage) {
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

function paginationButtonBack() {
  const cardContainer = document.getElementById('card-container');
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

function paginationButtonForward() {
  const buttonForward = document.createElement('button');
  buttonForward.classList.add('button-forward');
  buttonForward.innerText = 'Next';

  buttonForward.addEventListener('click', function () {
    const cardContainer = document.getElementById('card-container');
    if (currentPage !== Math.ceil(movieData.data.length / calcMaxCards()) - 1) {
      currentPage++;
      displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);
      refreshActiveButton();
    }
  });
  return buttonForward;
}

function paginationButton(page) {
  const paginationButton = document.createElement('button');
  paginationButton.innerText = page;

  if (currentPage == page - 1) {
    paginationButton.classList.add('active');
  }

  paginationButton.addEventListener('click', function () {
    const cardContainer = document.getElementById('card-container');
    currentPage = page - 1;
    displayCards(movieData.data, cardContainer, calcMaxCards(), currentPage);

    let currentBtn = document.querySelector('.button.active')
    currentBtn.classList.remove('active');

    paginationButton.classList.add('active');
  });
  return paginationButton;
}


function refreshActiveButton() {
  const paginationElement = document.getElementById('pagination');
  let currentBtn = document.querySelector('.button.active')
  currentBtn.classList.remove('active');
  let newActiveButton = paginationElement.childNodes[currentPage + 1];
  newActiveButton.classList.add('active');
}

/********************************************************************************************************/

/* shared functions */

async function fetchAsync(url) {
  const response = await window.fetch(url);
  const data = await response.json();
  return data;
}

async function onLoad() {
  urlLink = document.URL;
  if (urlLink.includes('reservation')) {
    document.getElementById('kaufen').style.pointerEvents="none";
    document.getElementById('kaufen').style.cursor="default";
    container = document.querySelector('.container');
    seats = document.querySelectorAll('.row .seat:not(.occupied');
    count = document.getElementById('count');
    total = document.getElementById('total');
    timeSelect = document.getElementById('time');
    var param = getParam(urlLink);
    movieReservationData = await fetchAsync('/api/movieDetails/' + param);
    displayMovieReservation(movieReservationData);
    ticketPrice = +timeSelect.value;
    // Movie select event
    timeSelect.addEventListener('change', (e) => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});
console.log(container);

// Seat click event
  container.addEventListener('click', (e) => {
  if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
    e.target.classList.toggle('selected');
    const thisId = e.target.id;
    const thisClass = e.target.classList;
    console.log(thisClass[1] + thisId);
    updateSelectedCount();
  }
});
  } else if (urlLink.includes('index_user')) {
    const paginationElement = document.getElementById('pagination');
    const cardContainer = document.getElementById('card-container');
    movieData = await fetchAsync('/api/movies');
    displayCards(movieData.data, cardContainer, calcMaxCards());
    pagination(movieData.data, paginationElement, calcMaxCards());
  }
}

function refreshWindow() {
  const paginationElement = document.getElementById('pagination');
  const cardContainer = document.getElementById('card-container');
  urlLink = document.URL;
  if (urlLink.includes('index_user')) {
  if (currentPage > Math.ceil(movieData.data.length / calcMaxCards()) - 1) {
    currentPage = Math.ceil(movieData.data.length / calcMaxCards() - 1);
  }
  console.log('ceil: ' + Math.ceil(movieData.data.length / calcMaxCards()));
  console.log('current Page: ' + currentPage);
  displayCards(movieData.data, cardContainer, calcMaxCards());
  pagination(movieData.data, paginationElement, calcMaxCards());
}
}


window.addEventListener('resize', function (event) {
  if (timer != null) {
    this.clearTimeout(timer)
    timer = null;
  }
  timer = this.setTimeout(refreshWindow, 500)
});


