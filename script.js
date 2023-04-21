const itemForm = document.querySelector("#item-form")
const itemInput = document.querySelector("#item-input")
const itemList = document.querySelector("#item-list")
const clearBtn = document.querySelector("#clear")
const itemFilter = document.querySelector("#filter")
const formBtn = itemForm.querySelector("button")
let isEditMode = false

init()


function init() {
    itemForm.addEventListener("submit",onAddItemSubmit)
    itemList.addEventListener("click",onClickItem)
    clearBtn.addEventListener("click",clearItems)
    itemFilter.addEventListener("input",filterItems)
    document.addEventListener("DOMContentLoaded",displayItems)
    
    checkUI()
}

function displayItems() {
    const itemsFromStorage = getItemsFromStorage()

    itemsFromStorage.forEach(addItemToDOM)

    checkUI()
}

function onAddItemSubmit(e) {
    e.preventDefault()
    const newItem = itemInput.value
    if (newItem === "") {
        alert("Please add an item")
        return
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode")
        
        removeItemFromStorage(itemToEdit.textContent)
        
        itemToEdit.classList.remove("edit-mode")
        itemToEdit.remove()
        isEditMode = false
    } else {
        if (checkIfItemExists(newItem)) {
            alert("That Item Already Exists!")
            return
        }
    }

    addItemToDOM(newItem)
    
    addItemToStorage(newItem)
    
    checkUI()

    itemInput.value = ""
}

function addItemToDOM(item) {
    const li = document.createElement("li")
    li.appendChild(document.createTextNode(item))

    const button = createButton("remove-item btn-link text-red")

    li.appendChild(button)

    itemList.appendChild(li)
}

function setStorageValue(arr) {
    localStorage.setItem("shoppingList:items",JSON.stringify(arr))
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage()

    itemsFromStorage.push(item)

    setStorageValue(itemsFromStorage)
}

function getItemsFromStorage() {
    let itemsFromStorage

    if (!localStorage.getItem("shoppingList:items")) {
        itemsFromStorage = []
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("shoppingList:items"))
    }

    return itemsFromStorage
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        console.log("eee")
        removeItem(e.target.parentElement.parentElement)
    } else if (e.target.tagName === "LI") {
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage()
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item) {
    isEditMode = true
    itemList.querySelectorAll("li").forEach(e=>e.classList.remove("edit-mode"))
    item.classList.add("edit-mode")
    formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item"
    formBtn.style.backgroundColor = "#228b22"
    itemInput.value = item.textContent
}

function removeItem(item) {
    if (confirm("Are You Sure?")) {
        item.remove()
        removeItemFromStorage(item.textContent)
        checkUI()
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage()

    itemsFromStorage = itemsFromStorage.filter(a=>a!=item)

    setStorageValue(itemsFromStorage)
}

function clearItems() {
    if (confirm("Are You Sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild)
        }
        checkUI()
    }

    setStorageValue([])
}

function filterItems(e) {
    const items = itemList.querySelectorAll("li")
    const text = e.target.value.toLowerCase()

    items.forEach(a=>{
        const itemName = a.firstChild.textContent.trim().toLowerCase()
        console.log(itemName.indexOf(text))
        if (itemName.indexOf(text) !== -1) {
            a.style.display = "flex"
        } else {
            a.style.display = "none"
        }
    })
}

function createButton(classes) {
    const button = document.createElement("button")
    button.classList = classes
    const icon = createIcon("fa-solid fa-xmark")
    button.appendChild(icon)
    return button
}

function createIcon(classes) {
    const icon = document.createElement("i")
    icon.classList = classes
    return icon
}

function checkUI() {
    itemInput.value = ""

    const items = itemList.querySelectorAll("li")

    if (items.length === 0) {
        clearBtn.style.display = "none"
        itemFilter.style.display = "none"
    } else {
        clearBtn.style.display = "block"
        itemFilter.style.display = "block"
    }

    formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item"
    formBtn.style.backgroundColor = "#333"

    isEditMode = false
}

