class ProductForm {
  constructor() {
    this.inputName = document.querySelector("#exampleInputText1");
    this.inputDescription = document.querySelector("#exampleInputText2");
    this.inputBrand = document.querySelector("#exampleInputText3");
    this.inputUrl = document.querySelector("#exampleInputText4");
    this.inputPrezzo = document.querySelector("#exampleInputText5");
    this.inputID = document.querySelector("#exampleInputText6");
    this.inputUserID = document.querySelector("#exampleInputText7");
    this.inputCreazione = document.querySelector("#exampleInputText8");
    this.inputModifica = document.querySelector("#exampleInputText9");
    this.inputVersione = document.querySelector("#exampleInputText10");

    this.inputID.value = this.randomNumbers();
    this.inputUserID.value = this.randomNumbers();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setCurrentDate();
  }

  setupEventListeners() {
    const invia = document.querySelector(".btn-primary");
    invia.addEventListener('click', this.invioParametri.bind(this));

    const reset = document.querySelector(".btn-danger");
    reset.addEventListener('click', this.resetParametri.bind(this));

    const homePage = document.querySelectorAll(".tornaHomepage");
    homePage.forEach(home => {
      home.addEventListener('click', this.tornaAllaHP.bind(this));
    });
  }

  invioParametri() {
    const div = document.querySelector(".inviato");
    const successMessage = document.createElement("p");
    successMessage.classList.add("text-primary");
    successMessage.innerText = "Prodotto salvato con successo!";
  
    const errorMessage = document.querySelector(".text-danger");
  
    if (
      errorMessage &&
      errorMessage.innerText === "Si prega di inserire almeno 4 caratteri per Nome, Descrizione e Brand, un URL valido e un prezzo maggiore di zero."
    ) {
      div.removeChild(errorMessage);
    }
  
    if (
      this.inputName.value.trim().length < 4 ||
      this.inputDescription.value.trim().length < 4 ||
      this.inputBrand.value.trim().length < 4 ||
      !this.isValidUrl(this.inputUrl.value.trim()) ||
      parseFloat(this.inputPrezzo.value.trim()) <= 0
    ) {
      const p2 = document.createElement("p");
      p2.classList.add("text-danger");
      p2.innerText = "Si prega di inserire almeno 4 caratteri per Nome, Descrizione e Brand, un URL valido e un prezzo maggiore di zero.";
      div.appendChild(p2);
      return;
    }
  
    if (div.contains(successMessage)) {
      setTimeout(() => {
        div.removeChild(successMessage);
      }, 3000);
    }
  
    div.appendChild(successMessage);
  
    this.clearInputFields();

    const apiKey = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4MTZmOGMwNTgzNTAwMTg1MjJjOTIiLCJpYXQiOjE3MDIzODk5MzMsImV4cCI6MTcwMzU5OTUzM30.xu0FWxvnIenqCmHYySJqmk6WFD3r8y9A-sXauNQ8KKU'; 
    const url = "https://striveschool-api.herokuapp.com/api/product/";

    const obj = {
      name: this.inputName.value,
      description: this.inputDescription.value,
      brand: this.inputBrand.value,
      imageUrl: this.inputUrl.value,
      price: this.inputPrezzo.value,
      _id: this.inputID.value,
      userID: this.inputUserID.value,
      createdAt: this.inputCreazione.value,
      updatedAt: this.inputModifica.value,
      __v: this.inputVersione.value,
    };

    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        Authorization: apiKey
      },
    });

    sessionStorage.setItem('productData', JSON.stringify(obj));
  }

  resetParametri() {
    this.clearInputFields();
  }

  clearInputFields() {
    this.inputName.value = '';
    this.inputDescription.value = '';
    this.inputBrand.value = '';
    this.inputUrl.value = '';
    this.inputPrezzo.value = '';
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  randomNumbers() {
    return Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
  }

  getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${day}-${month}-${year}`;
  }

  setCurrentDate() {
    const currentDate = this.getCurrentDate();
    this.inputCreazione.value = currentDate;
    this.inputModifica.value = currentDate;
  }

  tornaAllaHP() {
    location.href = "../../homepage.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ProductForm();
});

document.addEventListener('DOMContentLoaded', () => {
  const productData = sessionStorage.getItem('productData');

  if (productData) {
    const data = JSON.parse(productData);
    createProductCard(data);
  }
});

function createProductCard(data) {
  const cardContainer = document.querySelector('.card');

  const cardHTML = `
    <div class="card mb-3">
      <img src="${data.imageUrl}" class="card-img-top" alt="Immagine prodotto">
      <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <p class="card-text">${data.description}</p>
        <p class="card-text">Brand: ${data.brand}</p>
        <h6 class="card-subtitle mb-2 text-muted">Prezzo: ${data.price} €</h6>
      </div>
    </div>
  `;

  cardContainer.innerHTML = cardHTML;
}


