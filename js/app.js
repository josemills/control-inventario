// Estructura inicial
let inventario = [];

const btnAgregar = document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", agregarProducto);

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

  inventario.push(producto);

  mostrarInventario();
  guardarDatos();
}

// Mostrar en pantalla
function mostrarInventario() {
  const lista = document.getElementById("listaInventario");
  lista.innerHTML = "";

  inventario.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - ${p.cantidad} - $${p.precio}`;
    lista.appendChild(li);
  });
}

// Guardar en localStorage
function guardarDatos() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

// Carga de datos al iniciar

function cargarDatos() {
  const data = localStorage.getItem("inventario");

  if (data) {
    inventario = JSON.parse(data);
    mostrarInventario();
  }
}

cargarDatos();
