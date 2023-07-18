// ---------------------------------------------------------------- variables
var productName = document.getElementById("product-name");
var productPrice = document.getElementById("product-price");
var productCategory = document.getElementById("product-category");
var productDesc = document.getElementById("product-desc");
var tbody = document.getElementById("tBody");
var tHead = document.getElementById("tHead");
var submitBtn = document.getElementById("submitBtn");
var searchInput = document.getElementById("searchInput");
var products = [];
var trs = "";
var IndexUpdate = -1;

checkProductInLocalStorage();

// ---------------------------------------------------------------- functions
function checkProductInLocalStorage() {
  let localStorageProduct = getFromLocalStorage("products");
  if (localStorageProduct != null && localStorageProduct.length > 0) {
    products = localStorageProduct;
  }
  display();
}

function checkBtnText() {
  if (submitBtn.innerText === "Add product") {
    addProduct();
  } else {
    updateProduct();
  }
}

function addProduct() {
  var product = {
    name: productName.value,
    price: productPrice.value,
    category: productCategory.value,
    desc: productDesc.value,
  };

  products.push(product);

  saveChange("products", products);
  clearInputs();
}

function display() {
  if (products.length <= 0) {
    hideEl(tHead);
    trs = "no products please add some products";
  } else {
    showEl(tHead);
    trs = "";
    for (var i = 0; i < products.length; i++) {
      trs += `
      <tr>
          <td>${i + 1}</td>
          <td>${products[i].name}</td>
          <td>${products[i].price}</td>
          <td>${products[i].category}</td>
          <td>${products[i].desc}</td>
          <td>
            <button type="button" onclick="patchInputs(${i})" class="btn btn-outline-warning">
              Update
            </button>
          </td>
          <td>
            <button type="button" onclick="deleteProduct(${i})" class="btn btn-outline-danger">
              Delete
            </button>
          </td>
      </tr>
      `;
    }
  }

  tbody.innerHTML = trs;
}

function deleteProduct(index) {
  products.splice(index, 1);
  saveChange("products", products);
}

function updateProduct() {
  if (IndexUpdate > -1) {
    var productAfterEdit = {
      name: productName.value,
      price: productPrice.value,
      category: productCategory.value,
      desc: productDesc.value,
    };

    products.splice(IndexUpdate, 1, productAfterEdit);

    saveChange("products", products);
  }

  submitBtn.innerText = "Add product";
  clearInputs();
}

function saveChange(key, value) {
  saveInLocalStorage(key, value);
  display();
}

function patchInputs(index) {
  let obj = products[index];
  IndexUpdate = index;

  productName.value = obj.name;
  productPrice.value = obj.price;
  productCategory.value = obj.category;
  productDesc.value = obj.desc;

  submitBtn.innerText = "Update";
}

function search() {
  let ui = "";
  for (let i = 0; i < products.length; i++) {
    // if we do search and clear all value in input of search will not return the old product
    // if (
    //   products[i].name.toLowerCase() === searchInput.value.toLowerCase() ||
    //   products[i].price.toLowerCase() === searchInput.value.toLowerCase() ||
    //   products[i].category.toLowerCase() === searchInput.value.toLowerCase() ||
    //   products[i].desc.toLowerCase() === searchInput.value.toLowerCase()
    // )

    // use includes in search because better because it re turn if string is include substring (if substring === string or substring part of string )
    // and (string include "") => true  so when clear value of search input will display all product
    // if (
    //   products[i].name
    //     .toLowerCase()
    //     .includes(searchInput.value.toLowerCase()) ||
    //   products[i].price
    //     .toLowerCase()
    //     .includes(searchInput.value.toLowerCase()) ||
    //   products[i].category
    //     .toLowerCase()
    //     .includes(searchInput.value.toLowerCase()) ||
    //   products[i].desc.toLowerCase().includes(searchInput.value.toLowerCase())
    // )

    // best solution
    if (
      (
        products[i].name +
        products[i].price +
        products[i].category +
        products[i].desc
      )
        .toLowerCase()
        .includes(searchInput.value.toLowerCase())
    ) {
      ui += `
        <tr>
          <td>${i + 1}</td>
          <td>${products[i].name}</td>
          <td>${products[i].price}</td>
          <td>${products[i].category}</td>
          <td>${products[i].desc}</td>
          <td>
            <button type="button" onclick="patchInputs(${i})" class="btn btn-outline-warning">
              Update
            </button>
          </td>
          <td>
            <button type="button" onclick="deleteProduct(${i})" class="btn btn-outline-danger">
              Delete
              </button>
              </td>
        </tr>
      `;
    }
  }

  tbody.innerHTML = ui;
}

function clearInputs() {
  productName.value = "";
  productPrice.value = "";
  productCategory.value = "";
  productDesc.value = "";
}

function saveInLocalStorage(key, value) {
  // convert value to string to store this value in local storage
  value = JSON.stringify(value);
  localStorage.setItem(key, value);
}

function getFromLocalStorage(key) {
  let value = localStorage.getItem(key);
  // convert string that came from local storage to its type
  return JSON.parse(value);
}

function hideEl(el, className = "d-none") {
  if (!el.classList.contains(className)) {
    el.classList.add(className);
  }
}

function showEl(el, className = "d-none") {
  if (el.classList.contains(className)) {
    el.classList.remove(className);
  }
}
