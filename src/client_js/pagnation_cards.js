const currentCards = 10;

window.addEventListener('resize', reportWindowSize);

function reportWindowSize () {
  console.log(window.innerHeight);
  console.log(window.innerWidth);
}

// card container padding 30px

// card top margin 50px

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

for (let i = 0; i <= currentCards; i++) {
  insertCards();
}
