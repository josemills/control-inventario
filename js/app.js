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

const inputBuscar = document.getElementById("buscarProducto");

inputBuscar.addEventListener("input", filtrarProductos);

// Agregar productos
function agregarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = Number(document.getElementById("cantidad").value);
  const precio = Number(document.getElementById("precio").value);

  if (!nombre || cantidad <= 0 || precio <= 0) {
    alert("Datos inválidos");
    return;
  }

  const existe = appData.inventario.find(p => p.nombre === nombre);

  if (existe) {
    existe.cantidad += cantidad;
  } else {
    appData.inventario.push({ nombre, cantidad, precio });
  }

  guardarDatos();
  mostrarInventario();
}

// Mostrar en pantalla
function mostrarInventario() {
  const lista = document.getElementById("listaInventario");
  lista.innerHTML = "";

  appData.inventario.forEach((p, index) => {
    const li = document.createElement("li");


     li.innerHTML = `
      ${p.nombre} - ${p.cantidad} - $${p.precio}
      <button onclick="eliminarProducto(${index})">❌</button>
    `;

    lista.appendChild(li);
  });
}

// Eliminar Producto
function eliminarProducto(index) {
  appData.inventario.splice(index, 1);

  guardarDatos();
  mostrarInventario();
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
mostrarVentas();

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
    total,
    fecha: new Date().toLocaleString("es-CL")
  });

  // actualizar caja
  appData.caja.final += total;

  guardarDatos();
  mostrarInventario();
  mostrarVentas();
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

// Mostrar ventas (Historial)
function mostrarVentas() {
  const lista = document.getElementById("listaVentas");
  lista.innerHTML = "";

  appData.ventas.forEach(v => {
    const li = document.createElement("li");
    li.textContent = `${v.producto} - ${v.cantidad} - $${v.total} | ${v.fecha}`;
    lista.appendChild(li);
  });
}

// Cerrar Día
function cerrarDia() {
  appData.ventas = [];
  appData.caja.inicial = appData.caja.final;

  guardarDatos();
  mostrarVentas();
}

// Filtrar productos 
function filtrarProductos() {
  const texto = inputBuscar.value.toLowerCase();

  const lista = document.getElementById("listaInventario");
  lista.innerHTML = "";

  appData.inventario
    .filter(p => p.nombre.toLowerCase().includes(texto))
    .forEach((p, index) => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${p.nombre} - ${p.cantidad} - $${p.precio}
        <button onclick="eliminarProducto(${index})">❌</button>
      `;

      lista.appendChild(li);
    });
}