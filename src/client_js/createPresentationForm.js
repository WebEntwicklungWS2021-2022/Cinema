let movieData = null
let roomData = null;
let presentationData = null;

const timeSlots = ['10:00', '12:30', '15:00', '18:30', '21:30', '23:00']

let today = new Date();

window.addEventListener('load', onLoad());

async function fetchAsync(url) {
    const response = await window.fetch(url);
    const data = await response.json();
    return data;
}

async function onLoad() {

    movieData = await fetchAsync('/api/movies');
    roomData = await fetchAsync('/api/rooms');
    presentationData = await fetchAsync('/api/presentations')
    displayForm();
    console.log(today);
    console.log(movieData.data);
    console.log(roomData.data);
    console.log(presentationData.data);
}

function displayForm() {

    if (document.getElementById('newPresentationForm') == null) {
        return;
    }

    const formContainer = document.getElementById('newPresentationForm');
    formContainer.appendChild(createH2('create new presentation'));

    //room

    formContainer.appendChild(createLabel('select a room:'));

    const dropdownRoom = document.createElement('select');
    dropdownRoom.name = 'roomId';
    roomData.data.forEach(element => {
        const optionRoom = document.createElement('option');
        optionRoom.value = element.roomId;
        optionRoom.text = element.name;
        dropdownRoom.appendChild(optionRoom);
    });
    formContainer.appendChild(dropdownRoom);

    //movie

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

    //date

    formContainer.appendChild(createLabel('select a date:'));

    const date = document.createElement('input');
    date.type = 'date';
    date.setAttribute('min', today);
    date.value = today.toISOString().slice(0, 10);
    formContainer.appendChild(date);

    //time

    formContainer.appendChild(createLabel('select a timeslot:'));

    const time = document.createElement('select');
    timeSlots.forEach(element => {
        const optionTime = document.createElement('option');
        optionTime.value = element;
        optionTime.text = element;
        time.appendChild(optionTime);
    });
    formContainer.appendChild(time);

    //submit

    const submit = document.createElement('button');
    submit.innerText = 'create presentation';
    submit.type = 'button'
    submit.addEventListener('click', function () {

        const currentDate = today.toISOString().slice(0, 10);
        const currentTime = today.getHours() + ':' + today.getMinutes()

        //YYYY-MM-DD format
        if (date.value < currentDate) {
            window.alert('invalid date');
        }
        else if (date.value == currentDate && time.value < currentTime) {
            window.alert('invalid time');
        }
        else if(!checkIfFree(time, date, dropdownRoom)) {
            window.alert('room is already occupied');

        }else{
            console.log("wants to send")
            sendData(time, date, dropdownMovie.value, dropdownRoom.value);
        }     
    });

    formContainer.appendChild(submit);
}


function checkIfFree(time, date, dropdownRoom){
    
    let isValid = true;

    if(presentationData.data.length == 0){
        isValid = true;
    }
    else{
        presentationData.data.forEach(pres => {
            console.log(pres.roomId);
            console.log(dropdownRoom.value);
            console.log(pres.timestamp.slice(0,10));
            console.log(date.value);
            console.log(pres.timestamp.slice(11,16));
            console.log(time.value);
    
    
            if(pres.roomId == dropdownRoom.value){
                if(pres.timestamp.slice(0,10) == date.value){
                    if(pres.timestamp.slice(11,16) == time.value){
                        isValid = false;
                        console.log("isValid set to false");
                    }
                }
            }
        });
    }

    console.log(isValid);
    return isValid;
}

function createH2(string) {
    const h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(string));
    return h2;
}

function createLabel(string) {
    const label = document.createElement('label');
    label.appendChild(document.createTextNode(string));
    return label;
}

function createTimestamp(date, time) {
    const timestamp = date.value + ' ' + time.value;
    return timestamp;
}


async function sendData(time, date, movieId, roomId) {
    const timestamp = createTimestamp(date, time);

    const data = {
        timestamp: timestamp,
        movieId: movieId,
        roomId: roomId
    };

    fetch('/api/presentations', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            location.replace('/index_admin');
        })
        .catch((error) => {
            console.error(error);
        });
}


