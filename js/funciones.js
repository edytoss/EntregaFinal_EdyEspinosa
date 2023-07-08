// ************** DECLARACIÓN DE FUNCIONES ************** //
function productosFetch() {
  fetch(URLFetch)
    .then((response) => response.json())
    .then((data) => items.push(...data))
    .then(() => imprimirProductosEnHTML(items));
}

function chequearCarritoEnStorage() {
  let contenidoEnStorage = JSON.parse(localStorage.getItem("carritoEnStorage"));

  if (contenidoEnStorage) {
    let array = [];

    for (const objeto of contenidoEnStorage) {
      let item = new Productos(objeto);
      item.actualizarPrecioTotal();

      array.push(item);
    }

    imprimirTabla(array);

    return array;
  }

  return [];
}

function agregarAlCarrito(producto) {
  let index = carrito.findIndex((elemento) => elemento.id === producto.id);
  console.log({ index });

  if (index != -1) {
    carrito[index].agregarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    let item = new Productos(producto);
    item.cantidad = 1;
    carrito.push(item);
  }

  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);
}

function imprimirProductosEnHTML(array) {
  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = "";

  for (const item of array) {
    let card = document.createElement("div");
    card.innerHTML = `
          <div class="card text-center" style="width: 18rem;">
              <div class="card-img-top tarjetas">
                  <img src="${item.img}" id="" class="card-img-top img-fluid pt-2" alt="">
                  <h2 class="card-title">${item.marca}</h2>
                  <h5 class="card-subtitle mb-2 text-muted">${item.descripcion}</h5>
                  <p class="card-text fs-3 fw-bolder">$${item.precio}</p>
  
                  <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                      <button id="agregar${item.marca}${item.id}" type="button" class="btn btn-primary mb-2 fs-3 "> Agregar </button>
                  </div>
              </div>
          </div>      
          `;

    contenedor.appendChild(card);

    let boton = document.getElementById(`agregar${item.marca}${item.id}`);
    boton.addEventListener("click", () => agregarAlCarrito(item));
  }
}

function eliminarDelCarrito(id) {
  let index = carrito.findIndex((element) => element.id === id);

  if (carrito[index].cantidad > 1) {
    carrito[index].quitarUnidad();
    carrito[index].actualizarPrecioTotal();
  } else {
    carrito.splice(index, 1);
  }

  localStorage.setItem("carritoEnStorage", JSON.stringify(carrito));
  imprimirTabla(carrito);

  Toastify({
    text: "Se elimino una unidad!!",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "red",
      color: "white",
    },
  }).showToast();
}

function eliminarCarrito() {
  //sweet alert
  Swal.fire({
    title: "Eliminar compra",
    text: "Esta seguro que desea eliminar la compra",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = [];
      localStorage.removeItem("carritoEnStorage");
      document.getElementById("tabla-carrito").innerHTML = "";
      document.getElementById("acciones-carrito").innerHTML = "";
      Swal.fire("Compra eliminada", " ", "success");
    }
  });
}

function obtenerPrecioTotal(array) {
  return array.reduce((total, elemento) => total + elemento.precioTotal, 0);
}

function compraRealizada() {
  let precioCompra = "";

  Swal.fire({
    icon: "success",
    title: "Compra realizada!",
    text: "Vuelva pronto!",
  });
  carrito = [];
  localStorage.removeItem("carritoEnStorage");
  document.getElementById("tabla-carrito").innerHTML = "";
  document.getElementById("acciones-carrito").innerHTML = "";
}

function imprimirTabla(array) {
  let contenedor = document.getElementById("tabla-carrito");
  contenedor.innerHTML = "";

  let tabla = document.createElement("div");

  tabla.innerHTML = `
            <table id="tablaCarrito" class="table table-striped fs-4 m-5">
                <thead>         
                    <tr>
                        <th>Item</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Accion</th>
                    </tr>
                </thead>
    
                <tbody id="bodyTabla">
    
                </tbody>
            </table>
        `;

  contenedor.appendChild(tabla);

  let bodyTabla = document.getElementById("bodyTabla");

  for (let item of array) {
    let datos = document.createElement("tr");
    datos.innerHTML = `
      <td>${item.marca}</td>
      <td>${item.cantidad}</td>
      <td>$${item.precioTotal}</td>
      <td><button id="eliminar${item.id}" class="btn btn-danger fs-3">Eliminar</button></td>
      `;

    bodyTabla.appendChild(datos);

    let botonEliminar = document.getElementById(`eliminar${item.id}`);
    botonEliminar.addEventListener("click", () => eliminarDelCarrito(item.id));
  }

  let precioTotal = obtenerPrecioTotal(array);
  let accionesCarrito = document.getElementById("acciones-carrito");
  accionesCarrito.innerHTML = `
  <h5 id="costoTotal" class="fs-1 fw-bold">PrecioTotal: $${precioTotal}</h5></br>
  <button id="compraCarrito" class="btn btn-outline-success fs-3 p-2 m-1 ">Realizar compra Carrito</button>
  <button id="vaciarCarrito" class="btn btn-outline-danger fs-3 p-2 m-1 ">Vaciar Carrito</button>
  `;

  let botonCompra = document.getElementById(`compraCarrito`);
  botonCompra.addEventListener("click", () => compraRealizada());

  let botonVaciar = document.getElementById(`vaciarCarrito`);
  botonVaciar.addEventListener("click", () => eliminarCarrito());
}

function filtrarBusqueda(e) {
  e.preventDefault();

  let ingreso = document.getElementById("busqueda").value.toLowerCase();
  let arrayFiltrado = items.filter((elemento) =>
    elemento.marca.toLowerCase().includes(ingreso)
  );

  imprimirProductosEnHTML(arrayFiltrado);
}
