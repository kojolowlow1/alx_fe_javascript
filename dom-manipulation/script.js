// Initial quotes array
const quotes = [ 
  { text: "Success is not final.", category: "Motivation" },
  { text: "Code is poetry.", category: "Programming" }
];

// Simulated server data
let serverQuotes = [
  { text: "Server says: Keep learning!", category: "Motivation" },
  { text: "Server says: Practice makes perfect.", category: "Programming" }
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

// Populate categories dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");

  // Clear all options except 'All Categories'
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Populate dropdown
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter) categorySelect.value = lastFilter;
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Display a random quote from filtered set
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    document.getElementById("quoteDisplay").innerHTML = filteredQuotes[randomIndex].text;
  } else {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
  }
}

// Quote display div
const quoteDisplay = document.getElementById("quoteDisplay");

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
}

// Add quote form (dynamically created)
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
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Simulate fetching quotes from a server (using mock API)
async function fetchQuotesFromServer() {
  try {
    // Using JSONPlaceholder or any mock API for simulation
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Convert server data to quote objects (for demo purposes)
    // Only take first 5 items to simulate server quotes
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// Sync local quotes with server quotes
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server data takes precedence
  let newData = false;
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
    if (!exists) {
      quotes.push(serverQuote);
      newData = true;
    }
  });

  if (newData) {
    saveQuotes(); // Update localStorage
    populateCategories(); // Refresh category filter
    filterQuotes();      // Show initial filtered quote
    // Show notification
    const notif = document.getElementById("syncNotification");
    notif.style.display = "block";
    setTimeout(() => notif.style.display = "none", 3000);
  }
}

// Periodically sync with server every 30 seconds
setInterval(syncQuotes, 30000); // 30000ms = 30s

// Initial sync on page load
syncQuotes();

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate fetching server quotes
function fetchServerQuotes() {
  setTimeout(() => {
    console.log("Fetched quotes from server:", serverQuotes);
    syncWithServer();
  }, 1000);
}

// Sync local quotes with server and handle conflicts
function syncWithServer() {
  // Merge server quotes (server takes precedence)
  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote =>
      localQuote.text === serverQuote.text && localQuote.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
    }
  });

  saveQuotes();
  populateCategories();
  filterQuotes();

  // Notification for user
  const notification = document.getElementById("syncNotification");
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);

  console.log("Quotes synced with server.");
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

// Initialize form
createAddQuoteForm();

// Populate categories & show initial quote
populateCategories();
filterQuotes();

// Periodically fetch server quotes (simulate sync)
setInterval(fetchServerQuotes, 30000);
fetchServerQuotes();  // initial fetch
