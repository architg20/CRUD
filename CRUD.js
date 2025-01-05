const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiUrl = "https://crudcrud.com/api/your-api-id/candies";

document.getElementById("candy-form").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const candyDetails = {
    name: event.target.elements['candy-name'].value,
    description: event.target.elements['candy-description'].value,
    price: event.target.elements['candy-price'].value,
    quantity: event.target.elements['candy-quantity'].value
  };

  axios.post(proxyUrl + apiUrl, candyDetails)
    .then(response => {
      displayCandyOnScreen(response.data);
      event.target.reset(); 
    })
    .catch(error => console.log("Error saving candy:", error));
});

function displayCandyOnScreen(candy) {
  const candyList = document.getElementById("candy-list");

  const candyItem = document.createElement("li");
  candyItem.innerHTML = `${candy.name} - ${candy.description} - $${candy.price} - Quantity: ${candy.quantity}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    axios.delete(proxyUrl + apiUrl + `/${candy._id}`)
      .then(() => {
        candyItem.remove();
      })
      .catch(error => console.log("Error deleting candy:", error));
  };

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.onclick = () => {
    document.getElementById("candy-name").value = candy.name;
    document.getElementById("candy-description").value = candy.description;
    document.getElementById("candy-price").value = candy.price;
    document.getElementById("candy-quantity").value = candy.quantity;

    // Handle form submission for updating candy
    document.getElementById("candy-form").onsubmit = function(event) {
      event.preventDefault();

      const updatedCandy = {
        name: event.target.elements['candy-name'].value,
        description: event.target.elements['candy-description'].value,
        price: event.target.elements['candy-price'].value,
        quantity: event.target.elements['candy-quantity'].value,
      };

      axios.put(proxyUrl + apiUrl + `/${candy._id}`, updatedCandy)
        .then(response => {
          candyItem.innerHTML = `${response.data.name} - ${response.data.description} - $${response.data.price} - Quantity: ${response.data.quantity}`;
          event.target.reset();
        })
        .catch(error => console.log("Error updating candy:", error));
    };
  };

  candyItem.appendChild(deleteBtn);
  candyItem.appendChild(editBtn);
  candyList.appendChild(candyItem);
}

window.onload = function() {
  axios.get(proxyUrl + apiUrl)
    .then(response => {
      response.data.forEach(candy => displayCandyOnScreen(candy));
    })
    .catch(error => console.log("Error fetching candies:", error));
};
