let allProducts = []; //for the all product

const spinner = document.getElementById("loadingSpinner");
const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

const fetchProducts = async () => {
 spinner.classList.remove("hidden");
 grid.classList.add("hidden");

 try {
 let response = await fetch("https://fakestoreapi.com/products")
 if(!response.ok) throw new Error('Server error: ' + response.status);
 allProducts = await response.json();

 populateCategories(allProducts);
 renderProducts(allProducts)

 } catch(error) {
 showError('❌ Could not load products. Please check your intenet connection.');
 console.log(error);

 } finally {
 spinner.classList.add('hidden');
 grid.classList.remove('hidden');
 }
};

const renderProducts = (products) => {
 if(products.length === 0) {
 grid.innerHTML = '';
 emptyState.classList.remove('hidden');
 emptyState.innerHTML = '🥺 No produts found, Try a different search';
 return;
 }

 emptyState.classList.add('hidden');

 grid.innerHTML = products.map(product =>
 ` <div class="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
 onClick="showProductModel(${product.id})">
 <img src="${product.image}" alt="${product.title}" class="h-40 mx-auto object-contain mb-3"/>
 <h3 class="text-sm font-semibold line-clamp-2">${product.title}</h3>
 <p class="text-indigo-600 font-bold mt-2">${product.price}</p>
 </div>
 `).join('');
};

// category dropdown
const populateCategories = (products) => {
 let categories = [...new Set(products.map(p => p.category))]; 
 let select = document.getElementById('categorySelect');
 categories.forEach(cat => {
 let option = document.createElement('option');
 option.value = cat;
 option.textContent = cat;
 select.appendChild(option);
 });
}

const filterAndRender = () => {
 let searchTerm = document.getElementById('searchInput').value.toLowerCase();
 let selectCategory = document.getElementById('categorySelect').value;

 let filtered = allProducts.filter(product => {
 let matchesSearch = product.title.toLowerCase().includes(searchTerm);
 let matchesCategory = selectCategory === "all" || product.category === selectCategory;

 return matchesSearch && matchesCategory;
 });

 renderProducts(filtered);
}

document.getElementById('searchInput').addEventListener('input',filterAndRender);
document.getElementById('categorySelect').addEventListener('change',filterAndRender)

const showProductModel = (id) => {
 let product = allProducts.find(p => p.id === id);
 if(!product) return;

 document.getElementById('modelContent').innerHTML =
 `
 <img src="${product.image}" alt="${product.title}" class="h-48 mx-auto object-contain mb-4"/>

 <h2 class="text-lg font-bold">${product.title}</h2>
 <p class="text-gray-500 text-sm mt-2">${product.description}</p>
 <p class="text-indigo-500 text-sm mt-2">${product.price}</p>
 <p class="text-yellow-500 text-sm mt-2">✨${product.rating.rate} ${product.rating.count} reviews</p>
 `;

 document.getElementById('productModel').classList.remove('hidden');
};

const closeModel = () => {
 document.getElementById('productModel').classList.add('hidden');
};

document.getElementById('closeModelBtn').addEventListener('click',closeModel);

fetchProducts();

// Error handling (Network error, ) (network error + validation)

const showError = (message) => {
 grid.innerHTML = '';
 emptyState.classList.remove('hidden');
 emptyState.innerHTML = message;
};
