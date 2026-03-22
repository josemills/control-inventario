// Estructura inicial
let appData = {
  inventario: [],
  ventas: [],
  caja: {
    inicial: 0,
    final: 0
  }
};

const btnAgregar = document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", agregarProducto);

const btnVender = document.getElementById("btnVender");
btnVender.addEventListener("click", registrarVenta);

const btnCaja = document.getElementById("btnCaja");

btnCaja.addEventListener("click", iniciarCaja);

// Agregar productos
function agregarProducto() {
  const nombre = document.getElementById("nombre").value;
  const cantidad = document.getElementById("cantidad").value;
  const precio = document.getElementById("precio").value;

  const producto = {
    nombre,
    cantidad: Number(cantidad),
    precio: Number(precio)
  };

  appData.inventario.push(producto);

  mostrarInventario();
  guardarDatos();
}

// Mostrar en pantalla
function mostrarInventario() {
  const lista = document.getElementById("listaInventario");
  lista.innerHTML = "";

  appData.inventario.forEach((p, index) => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.cantidad} - $${p.precio}`;
    lista.appendChild(li);
  });
}

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem("appData", JSON.stringify(appData));
}

// Carga de datos al iniciar

function cargarDatos() {
  const data = localStorage.getItem("appData");

  if (data) {
    appData = JSON.parse(data);
    mostrarInventario();
  }
}

cargarDatos();
mostrarCaja();

// Registrar venta

function registrarVenta() {
  const nombre = document.getElementById("productoVenta").value;
  const cantidad = Number(document.getElementById("cantidadVenta").value);

  const producto = appData.inventario.find(p => p.nombre === nombre);

  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  if (producto.cantidad < cantidad) {
    alert("Stock insuficiente");
    return;
  }

  // descontar stock
  producto.cantidad -= cantidad;

  const total = cantidad * producto.precio;

  // registrar venta
  appData.ventas.push({
    producto: nombre,
    cantidad,
    total
  });

  // actualizar caja
  appData.caja.final += total;

  guardarDatos();
  mostrarInventario();
}

// Iniciar caja
function iniciarCaja() {
  const inicial = Number(document.getElementById("cajaInicial").value);

  appData.caja.inicial = inicial;
  appData.caja.final = inicial;

  guardarDatos();
  mostrarCaja();
}

// Mostrar Caja
function mostrarCaja() {
  const caja = document.getElementById("cajaFinal");

  caja.textContent = `Caja final: $${appData.caja.final}`;
}