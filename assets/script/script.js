//LOGICA CRUDAZON 

//classe prodotto (product form)
class ProductForm {
  constructor() { //preleviamo ogni elemento dal dom attraverso gli ID degli input
    this.inputName = document.querySelector("#exampleInputText1");
    this.inputDescription = document.querySelector("#exampleInputText2");
    this.inputBrand = document.querySelector("#exampleInputText3");
    this.inputUrl = document.querySelector("#exampleInputText4");
    this.inputPrezzo = document.querySelector("#exampleInputText5");
    this.inputID = document.querySelector("#exampleInputText6");
    this.inputUserID = document.querySelector("#exampleInputText7");
    this.inputCreazione = document.querySelector("#exampleInputText8");
    this.inputModifica = document.querySelector("#exampleInputText9");
    /* this.inputVersione = document.querySelector("#exampleInputText10"); */

    // qui viene fatto un controllo per far funzionare lo script anche in pagine in cui non sono presenti tali input
    if (this.inputID && this.inputUserID && this.inputCreazione && this.inputModifica) {
      this.inputID.value = this.randomNumbers();
      this.inputUserID.value = this.randomNumbers();
      this.init();
    }
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

    const visualizza = document.querySelector(".btn-info");
    visualizza.addEventListener('click', this.viewProducts.bind(this));
    
  }

  async getProducts() {
    const apiKey = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4MTZmOGMwNTgzNTAwMTg1MjJjOTIiLCJpYXQiOjE3MDI0NTY0OTUsImV4cCI6MTcwMzY2NjA5NX0.5BXYeXQyKRRTTuOjHFLvIr6w1U1nJlW1Z-B_qTFNaEg';
    const url = "https://striveschool-api.herokuapp.com/api/product/";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": apiKey
        },
      });

      if (response.ok) {
        const products = await response.json();
        sessionStorage.setItem('productData', JSON.stringify(products));
        // Puoi fare qualcosa con i dati recuperati, come visualizzarli a schermo
        this.viewProducts();
      } else {
        console.error('Errore durante il recupero dei prodotti:', response.status);
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
    }
  }

  invioParametri() {
    // Seleziona l'elemento div per mostrare i messaggi
    const div = document.querySelector(".inviato");
    // Crea un elemento paragrafo per il messaggio di successo
    const successMessage = document.createElement("p");
    successMessage.classList.add("text-primary");
    successMessage.innerText = "Prodotto salvato con successo!";
  
    // Seleziona l'eventuale messaggio di errore esistente
    const errorMessage = document.querySelector(".text-danger");
  
    // Rimuovi il messaggio di errore se esiste e corrisponde al testo specifico
    if (
      errorMessage &&
      errorMessage.innerText === "Si prega di inserire almeno 4 caratteri per Nome, Descrizione e Brand, un URL valido e un prezzo maggiore di zero."
    ) {
      div.removeChild(errorMessage);
    }
  
    // Controlla la validità dei campi del modulo
    if (
      this.inputName.value.trim().length < 4 ||
      this.inputDescription.value.trim().length < 4 ||
      this.inputBrand.value.trim().length < 4 ||
      !this.isValidUrl(this.inputUrl.value.trim()) ||
      parseFloat(this.inputPrezzo.value.trim()) <= 0
    ) {
      // Se i dati non sono validi, crea un nuovo paragrafo di errore
      const p2 = document.createElement("p");
      p2.classList.add("text-danger");
      p2.innerText = "Si prega di inserire almeno 4 caratteri per Nome, Descrizione e Brand, un URL valido e un prezzo maggiore di zero.";
      // Aggiungi il messaggio di errore al div
      div.appendChild(p2);
      return; // Esci dalla funzione se ci sono errori nei dati
    }
  
    // Rimuovi il messaggio di successo se già presente dopo 3 secondi
    if (div.contains(successMessage)) {
      setTimeout(() => {
        div.removeChild(successMessage);
      }, 3000);
    }
  
    // Aggiungi il messaggio di successo al div
    div.appendChild(successMessage);
  
    // Pulisci i campi del modulo
    this.clearInputFields();
  
    // Creazione delle variabili per la richiesta POST
    const apiKey = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc4MTZmOGMwNTgzNTAwMTg1MjJjOTIiLCJpYXQiOjE3MDI0NTY0OTUsImV4cCI6MTcwMzY2NjA5NX0.5BXYeXQyKRRTTuOjHFLvIr6w1U1nJlW1Z-B_qTFNaEg';
    const url = "https://striveschool-api.herokuapp.com/api/product/";
  
    // Creazione dell'oggetto dati per la richiesta POST
    const obj = {
      name: this.inputName.value,
      description: this.inputDescription.value,
      brand: this.inputBrand.value,
      imageURL: this.inputUrl.value.trim(),
      price: parseFloat(this.inputPrezzo.value),
      _id: this.randomNumbers().toString(),
      userId: this.randomNumbers().toString(),
      createdAt: this.getCurrentDate(),
      updatedAt: this.getCurrentDate(),
      __v: 0
    };

  
    // Effettua la richiesta POST al server per salvare il prodotto
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "content-type": "application/JSON",
        "Authorization": apiKey
      },
    });
  
    // Mostra i dati del prodotto salvato nella console
    console.log(obj);
    // Salva i dati del prodotto nella sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(obj));
  }  

  resetParametri() {
    this.clearInputFields();
  }

  clearInputFields() {
    //pulisce i campi di input
    this.inputName.value = '';
    this.inputDescription.value = '';
    this.inputBrand.value = '';
    this.inputUrl.value = '';
    this.inputPrezzo.value = '';

    this.inputID.value = this.randomNumbers();
    this.inputUserID.value = this.randomNumbers();
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

  viewProducts() {
    const productData = JSON.parse(sessionStorage.getItem('productData'));
    const modalBody = document.querySelector("#productModalBody");
  
    if (productData && Array.isArray(productData)) {
      let productListHTML = '';
  
      // Genera la lista dei prodotti in base ai dati memorizzati in sessionStorage
      productData.forEach(product => {
        const productInfo = `
          <div class="product-info d-flex">
            <p>Nome Prodotto: ${product.name}</p>
            <p>ID Prodotto: ${product._id}</p>
            <button class="btn btn-secondary edit-product" data-productid="${product._id}"> Modifica </button>
            <button class="btn btn-secondary delete-product" data-productid="${product._id}"> Elimina </button>
          </div>
          <hr>
        `;
        productListHTML += productInfo;
      });
  
      // Mostra la lista dei prodotti nella finestra modale
      modalBody.innerHTML = productListHTML;
  
      // Gestisce l'evento di click per il pulsante di modifica
      const editButtons = document.querySelectorAll('.edit-product');
      editButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productId = button.dataset.productid;
          // Recupera i dettagli del prodotto tramite l'ID dalla sessionStorage
          const products = JSON.parse(sessionStorage.getItem('productData'));
          const productToEdit = products.find(product => product._id === productId);
  
          // Esegue la logica di modifica (esempio: aggiornamento del nome del prodotto)
          if (productToEdit) {
            productToEdit.name = "Nuovo Nome Prodotto"; // Sostituisci con la tua logica di modifica
            // Aggiorna i dati del prodotto nella sessionStorage
            sessionStorage.setItem('productData', JSON.stringify(products));
            // Aggiorna la visualizzazione della lista dei prodotti richiamando viewProducts()
            this.viewProducts();
          }
        });
      });
  
      // Gestisce l'evento di click per il pulsante di eliminazione
      const deleteButtons = document.querySelectorAll('.delete-product');
      deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
          const productId = button.dataset.productid;
          // Recupera i dettagli del prodotto tramite l'ID dalla sessionStorage
          let products = JSON.parse(sessionStorage.getItem('productData'));
  
          // Rimuove il prodotto con l'ID corrispondente
          products = products.filter(product => product._id !== productId);
  
          // Aggiorna i dati del prodotto nella sessionStorage
          sessionStorage.setItem('productData', JSON.stringify(products));
          // Aggiorna la visualizzazione della lista dei prodotti richiamando viewProducts()
          this.viewProducts();
        });
      });
    }
  }
  
  
}

document.addEventListener('DOMContentLoaded', () => {
  const productForm = new ProductForm();
  productForm.getProducts();
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

  if (cardContainer) {
    const cardHTML = `
      <div class="card mb-3">
        <img src="${data.imageURL}" class="card-img-top" alt="Immagine prodotto" style="Width: 5em">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <p class="card-text">${data.description}</p>
          <p class="card-text">Brand: ${data.brand}</p>
          <div class="d-flex">
            <h6 class="card-subtitle mb-2 text-muted">Prezzo: ${data.price} €</h6>
            <button class="btn btn-dark ms-4">i</button>
          </div>
        </div>
      </div>
    `;

    cardContainer.innerHTML += cardHTML;
  }
}


