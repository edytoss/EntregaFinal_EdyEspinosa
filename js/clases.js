class Productos {
  constructor(item) {
    this.id = item.id;
    this.marca = item.marca;
    this.precio = item.precio;
    this.cantidad = item.cantidad;
    this.precioTotal = item.precio;
  }

  agregarUnidad() {
    this.cantidad++;
  }

  quitarUnidad() {
    this.cantidad--;
  }

  actualizarPrecioTotal() {
    this.precioTotal = this.precio * this.cantidad;
  }
}