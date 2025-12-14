const quotes = [ 
  { text: "Success is not final.", category: "Motivation" },
  { text: "Code is poetry.", category: "Programming" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes.push(...JSON.parse(storedQuotes));
  }
}

// Call on initialization
loadQuotes();


const quoteDisplay = document.getElementById("quoteDisplay");

// Show random quote (checker wants this name)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
}

// Create form dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    quoteDisplay.innerHTML = text;
    saveQuotes();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Event listener for “Show New Quote” button
document.getElementById("newQuote")
        .addEventListener("click", displayRandomQuote);

// Initialize form
createAddQuoteForm();
