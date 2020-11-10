// UI Selectors
let products = document.querySelector('#products');
let cartTable = document.querySelector('#cart_table');


// Classess
// For UI Changing
class UI{
    static showCart(productId,productName,productPrice){
        let row = document.createElement('tr');

        let proName = document.createElement('td');
        proName.appendChild(document.createTextNode(productName));

        let proPrice = document.createElement('td');
        proPrice.appendChild(document.createTextNode(productPrice));

        let proRemove = document.createElement('td');
        let removeLink = document.createElement('a');
        removeLink.setAttribute('href','#');
        removeLink.id = productId;
        removeLink.appendChild(document.createTextNode("Remove"));
        removeLink.className = "btn btn-danger";
        proRemove.appendChild(removeLink);

        row.appendChild(proName);
        row.appendChild(proPrice);
        row.appendChild(proRemove);
        
        cartTable.appendChild(row);
    }
}

// Local storage handler class
class LS{
    constructor(id,name,price){
        this.id = id;
        this.name = name;
        this.price = price;
    }
    static storeToLS(cart){
        let carts;
        if(localStorage.getItem('carts') == null){
            carts = [];
        }else{
            carts = JSON.parse(localStorage.getItem('carts'));
        }
        carts.push(cart);
        localStorage.setItem('carts',JSON.stringify(carts))
    }
    static cartsFromLS(){
        let carts;
        let row = '';
        if(localStorage.getItem('carts') == null){
            carts = [];
        }else{
            carts = JSON.parse(localStorage.getItem('carts'));
        }
        carts.forEach(data=>{
            row += 
            `<tr>
                <td>${data.name}</td>
                <td>${data.price}</td>
                <td><a href="#" id="${data.id}" class="btn btn-danger">Remove</a></td>
            </tr>`

        })
        cartTable.innerHTML = row;
    }
    static removeCartFromLS(productId){
        let carts;
        let row = '';
        if(localStorage.getItem('carts') == null){
            carts = [];
        }else{
            carts = JSON.parse(localStorage.getItem('carts'));
        }
        carts.forEach((data,index) =>{
            if(data.id === productId){
                carts.splice(index,1)
            }
        });
        localStorage.setItem('carts',JSON.stringify(carts))
    }
}

// Add Event Listener
document.addEventListener('DOMContentLoaded',showProducts);
products.addEventListener('click',addToCart);
cartTable.addEventListener('click',removeFromCart);


// Functions
function showProducts(){
    let product = '';
    fetch('json/data.json')
    .then(result => result.json())
    .then(data=>{
        data.forEach(getProduct => {
            product += 
            `<div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card m-1">
                    <div class="product_img_wrap">
                        <img src="img/${getProduct.product_img}" alt="" class="card-img-top">
                    </div>
                    <hr>
                    <div class="card-body text-center">
                        <p class="card-text"><b>${getProduct.name}</b></p>
                        <p class="card-text"><b>Price: </b>TK. ${getProduct.price}</p>
                        <a href="#" class="btn btn-primary btn-block" id="${getProduct.id}">Add To Cart</a>
                    </div>
                </div>
            </div>`;
        });
        document.querySelector('#products').innerHTML = product;
    })
    LS.cartsFromLS();
}

// Add To Cart Function
function addToCart(e){
    if(e.target.hasAttribute('href')){
        let productName = e.target.previousElementSibling.previousElementSibling.textContent;
        let productPrice = e.target.previousElementSibling.lastChild.textContent;
        let productId = e.target.id;
        UI.showCart(productId,productName,productPrice);
        let cart = new LS(productId,productName,productPrice);
        LS.storeToLS(cart);
        
    };
    
}

// Remove from cart
function removeFromCart(e){
    if(e.target.hasAttribute('href')){
        let removeCartBtn = e.target;
        removeCartBtn.parentElement.parentElement.remove();
        LS.removeCartFromLS(removeCartBtn.id);
    }
}