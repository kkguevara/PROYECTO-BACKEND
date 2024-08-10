//instancia de Socket.io desde el lado del cliente.

const socket = io();

socket.emit("Bienvenid@!!");

socket.on("products", (data) => {
  renderProducts(data);
});

// modifica el dom, para agregar los productos

const renderProducts = (products) => {
  const containerProducts = document.getElementById("containerAddProducts");
  if (containerProducts) {
    containerProducts.innerHTML = "";

    products.forEach((item) => {
      const card = document.createElement("div");
      card.innerHTML = `<p>${item.id}</p>
                            <p>${item.title}</p>
                            <p>${item.price}</p>
                            <button> Eliminar </button>`;

      containerProducts.appendChild(card);

      card.querySelector("button").addEventListener("click", () => {
        deleteProduct(item.id);
      });
    });
  }
};
const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

const addProductForm = document.getElementById("productForm");

if (addProductForm) {
  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (
      !data ||
      data.title === "" ||
      data.code === "" ||
      data.stock === "" ||
      data.price === "" ||
      data.category === "" ||
      data.description === ""
    ) {
      console.error("Faltan campos");
    }
    data.stock = parseInt(data.stock);
    data.price = parseInt(data.price);
    socket.emit("product", data);
  });
}
