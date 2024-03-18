let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');

let listProducts = [];
let carts = [];


iconCart.addEventListener('click', () =>{
    body.classList.toggle('showCart');
}) 
closeCart.addEventListener('click', () =>{
   body.classList.toggle('showCart'); 
})

const addDataToHTML = () => { 
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add to Cart</button>
                `;
                listProductHTML.appendChild(newProduct);
        })
    }
}
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
         alert(product_id);
    }
})


const initApp = () => {
    //get data from JSON
    fetch('shoppingCart.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();
    })
}
initApp();