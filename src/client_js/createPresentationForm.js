let movieData = null
let roomData = null;

let today = new Date();

window.addEventListener('load', onLoad());

async function fetchAsync(url) {
    const response = await window.fetch(url);
    const data = await response.json();
    return data;
}

async function onLoad(){

    movieData = await fetchAsync('/api/movies');
    roomData = await fetchAsync('/api/rooms');
    displayForm();
    console.log(today);
    console.log(movieData.data);
    console.log(roomData.data);
}

function displayForm(){

    if(document.getElementById('newPresentationForm') == null){
        return;
    }

    const formContainer = document.getElementById('newPresentationForm');

    formContainer.appendChild(createH2('create new presentation'));

    formContainer.appendChild(createLabel('select a room:'))

    const dropdownRoom = document.createElement('select');
    dropdownRoom.name = 'roomId';
    roomData.data.forEach(element => {
        const optionRoom = document.createElement('option');
        optionRoom.value = element.roomId;
        optionRoom.text = element.name;
        dropdownRoom.appendChild(optionRoom);
    });
    dropdownRoom.selectedIndex = 0;
    formContainer.appendChild(dropdownRoom);

    formContainer.appendChild(createLabel('select a movie:'))

    const dropdownMovie = document.createElement('select');
    dropdownMovie.name = 'movieId';
    movieData.data.forEach(element => {
        const optionMovie = document.createElement('option');
        optionMovie.value = element.movieId;
        optionMovie.text = element.name;
        dropdownMovie.appendChild(optionMovie);
    });
    formContainer.appendChild(dropdownMovie);

    formContainer.appendChild(createLabel('select time and date:'))

    const date = document.createElement('input');
    date.type = 'date';
    date.setAttribute('min', today);
    formContainer.appendChild(date);

    const time = document.createElement('input');
    time.type = 'time';
    time.setAttribute('min', today.time)
    formContainer.appendChild(time);

    const submit = document.createElement('button');
    submit.innerText = 'create presentation';
    submit.type = 'button'
    submit.addEventListener('click', function(){

        const currentDate = today.toISOString().slice(0,10);
        const currentTime = today.getHours() + ':' + today.getMinutes()

        //YYYY-MM-DD format
        if(date.value < currentDate){
            alert('invalid date');
        }
        else if(date.value == currentDate && time.value < currentTime){
            alert('invalid time');
        }
        else{

            sendData(time, date, dropdownMovie.value, dropdownRoom.value);  
        }
    });

    formContainer.appendChild(submit);
}

function createH2(string){
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(string));
    return h2;
}

function createLabel(string){
    const label = document.createElement('label');
    label.appendChild(document.createTextNode(string));
    return label;
}

function createTimestamp(date, time){
    const timestamp = date.value + ' ' + time.value;
    return timestamp;
}


async function sendData(time, date, movieId, roomId){
    const timestamp = createTimestamp(date, time);

    const response = await fetch("/api/presentations", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: `{
           "timestamp": ${timestamp} ,
           "movieId": ,
           "Quantity": 1,
          }`,
        });
}
