// Navbar mobile toggle
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
if (menuToggle) {
  menuToggle.addEventListener("click", () => menu.classList.toggle("show"));
}

// Navbar scroll tint
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 60) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// Cart logic
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// Function to show the item added notification
function showNotification(itemName) {
  const notification = document.getElementById("cart-notification");
  if (!notification) return;

  notification.textContent = `✅ Added ${itemName} to cart!`;
  
  // Show notification with fade-in effect
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.remove('opacity-0');
    notification.classList.add('opacity-100');
  }, 10);
  

  // Hide after 3 seconds with fade-out effect
  setTimeout(() => {
    notification.classList.remove('opacity-100');
    notification.classList.add('opacity-0');
    
    // Completely hide after fade-out completes
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 300); 
    
  }, 3000);
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price: parseFloat(price), qty: 1 });
  saveCart();
  // Call the notification function
  showNotification(name); 
}

// Function to handle quantity change
function changeQuantity(itemName, delta) {
  const index = cart.findIndex(item => item.name === itemName);
  if (index === -1) return;
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    removeItem(itemName);
  } else {
    saveCart();
  }
}

// Function to remove an item completely
function removeItem(itemName) {
  cart = cart.filter(item => item.name !== itemName);
  saveCart();
}

// Function to update the cart modal display with quantity controls
function updateCartDisplay() {
  const container = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  if (!container) return;
  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-4">Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      total += item.price * item.qty;
      const subtotal = (item.price * item.qty).toFixed(2);
      const safeName = item.name.replace(/'/g, "\\'"); 

      const div = document.createElement("div");
      // Flex layout for the cart item row with quantity/delete buttons
      div.classList.add("flex", "justify-between", "items-center", "mb-4", "border-b", "pb-2", "text-sm");
      div.innerHTML = `
        <span class="font-medium text-left w-2/5 truncate">${item.name}</span>
        
        <div class="flex items-center space-x-2 w-1/4 justify-center">
          <button onclick="changeQuantity('${safeName}', -1)" 
                  class="text-white bg-[#c98a00] hover:bg-[#e6a600] rounded-full w-5 h-5 leading-none transition duration-150 text-base font-bold flex items-center justify-center p-0 m-0">
            −
          </button>
          <span class="w-6 text-center text-sm">${item.qty}</span>
          <button onclick="changeQuantity('${safeName}', 1)" 
                  class="text-white bg-[#c98a00] hover:bg-[#e6a600] rounded-full w-5 h-5 leading-none transition duration-150 text-base font-bold flex items-center justify-center p-0 m-0">
            +
          </button>
        </div>
        
        <div class="flex items-center justify-end w-2/5 space-x-2">
            <span class="font-semibold text-right">₱${subtotal}</span>
            <button onclick="removeItem('${safeName}')" 
                    class="text-red-500 hover:text-red-700 transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  // Update total in local storage and display
  totalElement.textContent = `Total: ₱${total.toFixed(2)}`;
  localStorage.setItem("cartTotal", total);

  // Disable checkout if cart is empty
  const goCheckout = document.getElementById("go-checkout");
  if (goCheckout) {
      if (cart.length === 0) {
          goCheckout.disabled = true;
          goCheckout.classList.add('opacity-50', 'cursor-not-allowed');
          goCheckout.classList.remove('hover:bg-[#e6a600]');
      } else {
          goCheckout.disabled = false;
          goCheckout.classList.remove('opacity-50', 'cursor-not-allowed');
          goCheckout.classList.add('hover:bg-[#e6a600]');
      }
  }
}

document.querySelectorAll(".add-to-cart").forEach(btn=>{
  btn.addEventListener("click",()=>addToCart(btn.dataset.name,btn.dataset.price));
});

const cartBtn=document.getElementById("cart-btn");
const cartModal=document.getElementById("cart-modal");
const closeCart=document.getElementById("close-cart");
const goCheckout=document.getElementById("go-checkout");

if(cartBtn)cartBtn.onclick=()=>cartModal.classList.remove("hidden");
if(closeCart)closeCart.onclick=()=>cartModal.classList.add("hidden");
if(goCheckout)goCheckout.onclick=()=>window.location.href="checkout.html";

updateCartDisplay();