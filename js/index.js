// ************** EVENTO **************
let btnFiltrar = document.getElementById("btnFiltrar");
btnFiltrar.addEventListener("click", filtrarBusqueda);

// Ejecución del código
// --- Invocación de funciones ---
productosFetch();

let carrito = chequearCarritoEnStorage();
