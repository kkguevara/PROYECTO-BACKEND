//instancia de Socket.io desde el lado del cliente. 

const socket = io();

socket.on("productos", (data) => {
    renderProducts(data);
})

// modifica el dom, para agregar los productos 

const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.innerHTML = ""

    products.forEach(item => {
        const card = document.createElement("div")
        card.innerHTML = `<p>${item.id}</p>
                            <p>${item.title}</p>
                            <p>${item.price}</p>
                            <button> Eliminar </button>`

        containerProducts.appendChild(card);

        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id)
        })
    })
}
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}















