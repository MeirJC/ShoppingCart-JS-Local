// Page Elements
const itemsForm = document.getElementById("items-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemsFilter = document.getElementById("filter");
const formBtn = itemsForm.querySelector("button");
let isEditMode = false;

// === Main Functions ===

// (Create)

// -- Adding an item
function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  // Validate Input
  if (!newItem) {
    alert("No item names to add");
    return;
  }
  // Check for Edit Mode and if item already exist
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExist(newItem)) {
      alert("Item already exist");
      return;
    }
  }

  addItemToDOM(newItem); // Create item Element in the DOM
  addItemToLocalStorage(newItem); // Set new item to localStorage
  checkUI();
  itemInput.value = ""; // Reset input after submit
}

function addItemToDOM(item) {
  const button = createButton("remove-item btn-link text-red");
  const icon = createIcon("fa-solid fa-xmark");
  const li = document.createElement("li");

  li.appendChild(document.createTextNode(item));
  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToLocalStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);
  localStorage.setItem("items", JSON.stringify(itemsFromStorage)); // Convert to JSON and set into localStorage
}

// (Read)

// Adding all stord localStorage items and adding the to the DOM
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

// --- Getting the items from localStorage or initializing an empty array for the list items
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsFromStorage;
}

// --- Check if item already exist
function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

// (Upadte / Edit)

function setItemToEdit(item) {
  isEditMode = true;

  itemList.querySelectorAll("li").forEach((li) => {
    li.classList.remove("edit-mode"); // Removing the 'edit-mode' class from all other items
  });
  // Addind the 'edit-mode' class to the current item and change the button
  item.classList.add("edit-mode");
  formBtn.innerHTML = "";
  const icon = createIcon("fa-solid fa-pen");
  const updateText = document.createTextNode("Update Item");
  formBtn.replaceChildren(...[icon, updateText]);
  formBtn.style.backgroundColor = "#008000";
  itemInput.value = item.textContent;
}
// (Delete)

// -- Deleting a single Item
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.nodeName === "LI") {
    setItemToEdit(e.target);
  }
}

function removeItem(item) {
  if (confirm(`Are you sure you want to remove ${item.textContent}?`)) {
    item.remove(); // Remove item from the DOM
    removeItemFromStorage(item.textContent); // Remove item from localStorage
    checkUI();
  }
}

function removeItemFromStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  const filterdItems = itemsFromStorage.filter((listItem) => listItem !== item); //  Filter out the item from localStorage
  localStorage.setItem("items", JSON.stringify(filterdItems)); // Setting the new (current) array back to localStorage
}

// --- Deleting all itemes
function clearAllItems() {
  if (confirm("Are you sure you want to remove all items?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild); // While there are child items to the 'ul', remove the first child
    }
  }
  // Clear from localStorage
  localStorage.removeItem("items");
  checkUI();
}

// ==== Utility Functions ===
// --- Create new Button
function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  return button;
}

// --- Create Icon for the button
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

// --- Filter list items
function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// --- Check UI to hide 'Clear All' button if there are no items in the list
function checkUI() {
  const items = itemList.querySelectorAll("li");
  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemsFilter.style.display = "none";
  } else {
    clearBtn.style.display = "inline-block";
    itemsFilter.style.display = "inline-block";
  }
  formBtn.innerHTML = ""; // Reset the 'Edit Item'
  const icon = createIcon("fa-solid fa-plus");
  const updateText = document.createTextNode("Add Item");
  formBtn.replaceChildren(...[icon, updateText]);

  formBtn.style.backgroundColor = "#222";
  isEditMode = false;
}

function initializeApp() {
  // Event Listeners
  itemsForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtn.addEventListener("click", clearAllItems);
  itemsFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems); // Load items from localStorage when page loads
  checkUI();
}

initializeApp();
