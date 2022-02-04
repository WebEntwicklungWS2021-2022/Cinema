const {
  async
} = require("jshint/src/prod-params");

let movieData = null;
window.addEventListener('load', onLoad());
/* Joud's code */
var container;
var seats;
var count;
var total;
var purchaseForm;
var timeSelect;
var ticketPrice;
var presentationId;

let timer;
/* Setters and Getters */
function getContainer() {
  return this.container;
}

function setContainer(container) {
  this.container = container;
}

function getSeats() {
  return this.seats;
}

function setSeats(seats) {
  this.seats = seats;
}

function getCount() {
  return this.count;
}

function setCount(count) {
  this.count = count;
}

function getTotal() {
  return this.total;
}

function setTotal(total) {
  this.total = total;
}

function getPurchaseForm() {
  return this.purchaseForm;
}

function setPurchaseForm(purchaseForm) {
  this.purchaseForm = purchaseForm;
}

function getTimeSelect() {
  return this.timeSelect;
}

function setTimeSelect(timeSelect) {
  this.timeSelect = timeSelect;
}

function getTicketPrice() {
  return this.ticketPrice;
}

function setTicketPrice(ticketPrice) {
  this.ticketPrice = ticketPrice;
}

function getPresentationId() {
  return this.presentationId;
}

function setPresentationId(presentationId) {
  this.presentationId = presentationId;
}

/******************************************************************************/
/* Rendering Function */
function renderReservationPage(items) {
  const posterDiv = document.getElementById('poster-img');
  const img = document.createElement('img');
  img.setAttribute('class', 'posterImage');
  const title = document.getElementById('title');
  var timeSelect = getTimeSelect();
  var posterName = null;
  var movieName;
  var timestamp = [];
  const selectedMovieTimeValue = localStorage.getItem('selectedMovieTimeValue');
  for (var item in items) {
    var innerItems = items[item];
    for (var inner in innerItems) {
      movieName = innerItems[inner].name;
      posterName = innerItems[inner].posterName;
      if (selectedMovieTimeValue != null) {
        if (selectedMovieTimeValue.length > 0) {
          if (innerItems[inner].roomId == selectedMovieTimeValue) {
            setPresentationId(innerItems[inner].presentationId);
            localStorage.setItem('presentationId', getPresentationId());
          }
        }
      }
    }
  }
  img.src = `../pictures/` + posterName;
  posterDiv.appendChild(img);
  populateSelect(timeSelect, items);
  const h2 = document.createElement('h2');
  const textNode = document.createTextNode(movieName);
  h2.appendChild(textNode);
  title.appendChild(h2);
  setSeats(document.querySelectorAll('.row .seat'));
  populateUI();
}

function populateSelect(target, items) {
  if (!target) {
    return false;
  } else {
    var roomId = [];
    var timestamp = [];
    for (var item in items) {
      var innerItems = items[item];
      for (var inner in innerItems) {
        posterName = innerItems[inner].posterName;
        timestamp.push(innerItems[inner].timestamp);
        roomId.push(innerItems[inner].roomId);
      }
    }
    for (let i = 0; i < timestamp.length; i++) {
      var opt = document.createElement('option');
      opt.value = roomId[i];
      opt.innerHTML = timestamp[i];
      target.appendChild(opt);
    }
  }
}

function updateData(items){
  const selectedMovieTimeValue = localStorage.getItem('selectedMovieTimeValue');
  for (var item in items) {
    var innerItems = items[item];
    for (var inner in innerItems) {
      if (innerItems[inner].roomId == selectedMovieTimeValue) {
        setPresentationId(innerItems[inner].presentationId);
        setTicketPrice(innerItems[inner].price);
        localStorage.setItem('moviePrice', getTicketPrice());
      }
    }
  }
}

  /*
  ** PARAMS**
  * reservationData: reservationData
  * roomsData: roomsData
  * room: roomId
  * presentationId: presentationId
  **/
  function refreshSeatsUI(reservationData, roomsData, room, presentationId){
    if ((roomsData != null)&&(roomsData.data.length > 0)) {
        createSeats(roomsData, room);
        if ((reservationData != null)&&(reservationData.data.length >0)) {
            populateOccupied(reservationData, presentationId);
        }
        populateUI();
    }
  }

//create seats
 /*
  ** PARAMS**
  * items: roomsData
  * room: roomId
  **/
  function createSeats(items, room){
    var tempDiv = document.querySelectorAll('.row');
        if (tempDiv != null) {
            Array.prototype.forEach.call(tempDiv, function (node) {
                node.parentNode.removeChild(node);
            });
        }
        if (room > 0) {
        var container = getContainer();
        var rows, seatsPerRow;
        for (var item in items) {
            var innerItems = items[item];
            for (var inner in innerItems) {
                if (innerItems[inner].roomId == room) {
                    rows = innerItems[inner].rows;
                    seatsPerRow = innerItems[inner].seatsPerRow;
                }
            }
        }
        let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    
        for (let i = 0; i < rows; i++) {
            if (i < alphabet.length - 1) {
                const rowDiv = document.createElement('div');
                rowDiv.setAttribute('class', 'row');
                rowDiv.setAttribute('id', alphabet[i]);
                container.appendChild(rowDiv);
            }
        }
        var tempRows = document.querySelectorAll('.row');
        tempRows.forEach((row, index) => {
            for (let i = 0; i < seatsPerRow; i++) {
                const seatDiv = document.createElement('div');
                seatDiv.setAttribute('class', 'seat');
                var z = i + 1;
                seatDiv.setAttribute('id', z + alphabet[index]);
                row.appendChild(seatDiv);
                }
            });
        }
        setSeats(document.querySelectorAll('.row .seat'));
  }

      /*
  ** PARAMS**
  * items: reservationData
  * presentationId: presentationId
  **/
  function populateOccupied(items, presentationId){
    var reservedArr = [];
    for(var item in items){
        var innerItems = items[item];
        for(var inner in innerItems){
            if(innerItems[inner].presentationId == presentationId){
                reservedArr.push(innerItems[inner].seats);
            }
        }
    }
    // Filter the array just in case the data was corrupted 
    var tempStr = reservedArr.toString();
    reservedArr = tempStr.split(',').filter(n => n);
  
    var seats = getSeats();
    /*the idea is we loop through seats and check the id of the seat
    * if it matches the reserved seat then we check the class
    * if it contains selected, we remove the class value "selected"
    * add "occupied" to the classList no matter what
    */
    seats.forEach((seat, index) =>{
        for(let i = 0; i < reservedArr.length; i++){
            if (seat.id == reservedArr[i]) {
                if (seat.classList.contains('selected')) {
                    seat.classList.remove('selected');
                    seat.classList.add('occupied');
                }else{
                    seat.classList.add('occupied');
                }
            }
        }
    });
    
  }

  function populateUI() {
    var seats = getSeats();
    var selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    if (selectedSeats != null) {
      seats.forEach((seat, index) => {
        for (let a = 0; a < selectedSeats.length; a++) {
          if (selectedSeats[a] == index) {
            if (!(seat.classList.contains('occupied'))) {
              seat.classList.add('selected');  
            }
          }
        }
      });
      var timeSelect = getTimeSelect();
      const selectedMovieTimeIndex = localStorage.getItem('selectedMovieTimeIndex');
  
      if (selectedMovieTimeIndex !== null) {
        timeSelect.selectedIndex = selectedMovieTimeIndex;
      }
    }
  }

  function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    var seats = getSeats();
    var seatsIndex = [...selectedSeats].map(function (seat) {
      return [...seats].indexOf(seat);
    });
    localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
    const selectedSeatsCount = selectedSeats.length;
    urlLink = document.URL;
    if (urlLink.includes('reservation')) {
      count = getCount();
      total = getTotal();
      count.innerText = selectedSeatsCount;
      var tPrice;
      if (localStorage.getItem('moviePrice') != null) {
        if (localStorage.getItem('moviePrice').length > 0) {
          setTicketPrice(localStorage.getItem('moviePrice'));
          tPrice = getTicketPrice();
        }
      } else {
        tPrice = getTicketPrice();
      }
      total.innerText = selectedSeatsCount * tPrice;
    }
  }

  function setMovieData(movieTimeValue, movieTimeIndex) {
    localStorage.setItem('selectedMovieTimeValue', movieTimeValue);
    localStorage.setItem('selectedMovieTimeIndex', movieTimeIndex);
  }

  async function purchase(presentationId, seats, reservationData, roomsData, room) {
    const form = getPurchaseForm();
    const formData = new FormData(form);
    const formDataSerialized = Object.fromEntries(formData);
  
    if (!validate(formDataSerialized.name)) {
      alert('Please choose a seat and enter your full name');
    } else {
      var valid = checkReservation(presentationId, reservationData, seats);
      if (valid) {
          const jsonObject = {
            presentationId: presentationId,
            seats: seats,
            name: formDataSerialized.name,
          };
          try {
            const response = await window.fetch('/api/reservation/' + presentationId, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(jsonObject),
            });
            const jsonData = await response.json();
            console.log(jsonData);
          } catch (error) {
            console.log(error);
          }
          updateReservationData(roomsData, room, presentationId);
          const baseUrl = window.location.origin;
          window.open(baseUrl+"/scan", "QRCode Booking Confirmation", "height=600,width=400");
        } else {
          alert('Oops Seat(s) just got booked, pick different Seat(s) please');
          updateReservationData(roomsData, room, presentationId);
      }
    }
  }

  //frontend input validation
function validate(str) {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
  if (!(/^[a-zA-Z ]+$/.test(str)) || (selectedSeats == null) || (selectedSeats.length < 1)) {
    return false;
  }
  return true;
}

function checkReservation(presentationId, items, reservation) {
  var reservedArr = [];
  for (var item in items) {
    var innerItems = items[item];
    for (var inner in innerItems) {
      if (innerItems[inner].presentationId == presentationId) {
        reservedArr.push(innerItems[inner].seats);
      }
    }
  }
  var tempStr = reservedArr.toString();
  var tempArr = tempStr.split(',').filter(n => n);
  var reservArr = reservation.split(',').filter(n => n);
  for (let i = 0; i < tempArr.length; i++) {
    for (let j = 0; j < reservArr.length; j++) {
      console.log('this arr: '+tempArr[i]+' this reservArr:'+reservArr[j]);
      if (tempArr[i] == reservArr[j]) {
        return false;
      }
    }
  }
  return true;
}


function getParam(url) {
  var string = url;
  return string.split("/")[4];
}


function resetLocalStorage() {
  localStorage.clear();
}



async function updateReservationData(roomsData, room, presentationId){
  reservationData = await fetchAsync('/api/reservations');
  refreshSeatsUI(reservationData, roomsData, room, presentationId);
}



/********************************************************************************************************/

/* Christoph's Code */
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

    let currentBtn = document.querySelector('.button.active');
    currentBtn.classList.remove('active');

    paginationButton.classList.add('active');
  });
  return paginationButton;
}


function refreshActiveButton() {
  const paginationElement = document.getElementById('pagination');
  let currentBtn = document.querySelector('.button.active');
  currentBtn.classList.remove('active');
  let newActiveButton = paginationElement.childNodes[currentPage + 1];
  newActiveButton.classList.add('active');
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
    this.clearTimeout(timer);
    timer = null;
  }
  timer = this.setTimeout(refreshWindow, 500);
});
/********************************************************************************************************/

/* shared functions */

async function fetchAsync(url) {
  const response = await window.fetch(url);
  const data = await response.json();
  return data;
}

async function onLoad() {
  var urlLink = document.URL;
  if (urlLink.includes('reservation')) {
    var urlP = getParam(urlLink);
    var storedUrlP = localStorage.getItem('urlParam');
    if (storedUrlP != null) {
      if (storedUrlP.length > 0) {
        if (urlP != storedUrlP) {
          resetLocalStorage();
        }
      }
    }
    setPurchaseForm(document.querySelector('form'));
    setSeats(document.querySelectorAll('.row .seat'));
    setTimeSelect(document.getElementById('time'));
    setCount(document.getElementById('count'));
    setTotal(document.getElementById('total'));
    setTimeSelect(document.getElementById('time'));
    setContainer(document.querySelector('.container'));
    localStorage.setItem('urlParam', urlP);
      //api calls
      roomsData = await fetchAsync('/api/rooms');
      reservationData = await fetchAsync('/api/reservations');
      movieReservationData = await fetchAsync('/api/movieDetails/' + urlP);
      // get values from local storage
      var selectedMovieTimeValue = JSON.parse(localStorage.getItem('selectedMovieTimeValue'));
      const moviePrice = JSON.parse(localStorage.getItem('moviePrice'));

    var timeSelect = getTimeSelect();
    //render the reservation page
    renderReservationPage(movieReservationData);
    if (moviePrice != null) {
      if (moviePrice.length > 0) {
        setTicketPrice(moviePrice);
      }
    }
    var presentationId = getPresentationId();
    //if selectedMovieTimeValue is already stored in the local storage then use it create seats
    if ((selectedMovieTimeValue!=null)&&(selectedMovieTimeValue>0)) {
      refreshSeatsUI(reservationData,roomsData, selectedMovieTimeValue, presentationId);
    }else{
      refreshSeatsUI(reservationData, roomsData, timeSelect.value, presentationId);
    }
    timeSelect.addEventListener('change', async(e) => {
      //make new API calls
      roomsDataOnChange = await fetchAsync('/api/rooms');
      reservationDataOnChange = await fetchAsync('/api/reservations');
      movieReservationDataOnChange = await fetchAsync('/api/movieDetails/' + urlP);
      //set data in local storage
      setMovieData(e.target.value, e.target.selectedIndex);
      updateData(movieReservationDataOnChange);
      var presentationIdOnChange = getPresentationId();
      refreshSeatsUI(reservationDataOnChange, roomsDataOnChange, e.target.value, presentationIdOnChange);
    });
    // Seat click event
    var container = getContainer();
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        setSeats(document.querySelectorAll('.row .seat'));
        updateSelectedCount();
      }
    });
    const form = getPurchaseForm();
    form.addEventListener('submit', async(e) => {
    e.preventDefault();
    //make new API calls
      roomsDataOnSubmit = await fetchAsync('/api/rooms');
      reservationDataOnSubmit = await fetchAsync('/api/reservations');
      movieReservationDataOnSubmit = await fetchAsync('/api/movieDetails/' + urlP);
    updateData(movieReservationDataOnSubmit);
    var presentationIdOnSubmit = getPresentationId();
    var roomIdOnSubmit = localStorage.getItem('selectedMovieTimeValue');
    var selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
    const seats = getSeats();
    var reservedSeatsString = '';
    seats.forEach((seat, index) => {
    for (let a = 0; a < selectedSeats.length; a++) {
      if (selectedSeats[a] == index) {
        reservedSeatsString += seat.id + ',';
        }
      }
    });
      var arr = reservedSeatsString.split(',').filter(n => n);
      reservedSeatsString = arr.toString();
      purchase(presentationIdOnSubmit, reservedSeatsString, reservationDataOnSubmit,roomsDataOnSubmit, roomIdOnSubmit);
     
    });
  } else if (urlLink.includes('index_user')) {
    const paginationElement = document.getElementById('pagination');
    const cardContainer = document.getElementById('card-container');
    movieData = await fetchAsync('/api/movies');
    displayCards(movieData.data, cardContainer, calcMaxCards());
    pagination(movieData.data, paginationElement, calcMaxCards());
  }
}