// ==========================
// FUNCIONES GLOBALES (CLAVE)
// ==========================
window.cambiarTab = function(tabId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(s => s.classList.remove("active"));

  const target = document.getElementById(tabId);
  if (target) target.classList.add("active");
};

// ==========================
// APP
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  let appData = {
    inventario: [],
    ventas: [],
    caja: {
      inicial: 0,
      final: 0
    }
  };

  const btnAgregar = document.getElementById("btnAgregar");
  const btnVender = document.getElementById("btnVender");
  const btnCaja = document.getElementById("btnCaja");
  const inputBuscar = document.getElementById("buscarProducto");

  if (btnAgregar) btnAgregar.addEventListener("click", agregarProducto);
  if (btnVender) btnVender.addEventListener("click", registrarVenta);
  if (btnCaja) btnCaja.addEventListener("click", iniciarCaja);
  if (inputBuscar) inputBuscar.addEventListener("input", filtrarProductos);

  cargarDatos();
  mostrarInventario();
  mostrarCaja();
  mostrarVentas();
  calcularTotalVentas();

  // ==========================

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

    limpiarInputsProducto();
    guardarDatos();
    mostrarInventario();
  }

  function mostrarInventario() {
    const lista = document.getElementById("listaInventario");
    if (!lista) return;

    lista.innerHTML = "";

    appData.inventario.forEach((p, index) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${p.nombre}</strong>
        <p>Cantidad: ${p.cantidad}</p>
        <p>Precio: $${p.precio}</p>
        <button onclick="eliminarProducto(${index})">❌</button>
      `;

      lista.appendChild(li);
    });
  }

  window.eliminarProducto = function(index) {
    appData.inventario.splice(index, 1);
    guardarDatos();
    mostrarInventario();
  };

  function registrarVenta() {
    const nombre = document.getElementById("productoVenta").value.trim();
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

    producto.cantidad -= cantidad;

    const total = cantidad * producto.precio;

    appData.ventas.push({
      producto: nombre,
      cantidad,
      total,
      fecha: new Date().toLocaleString("es-CL")
    });

    appData.caja.final += total;

    limpiarInputsVenta();
    guardarDatos();
    mostrarInventario();
    mostrarVentas();
    mostrarCaja();
    calcularTotalVentas();
  }

  function iniciarCaja() {
    const inicial = Number(document.getElementById("cajaInicial").value);

    appData.caja.inicial = inicial;
    appData.caja.final = inicial;

    guardarDatos();
    mostrarCaja();
  }

  function mostrarCaja() {
    const caja = document.getElementById("cajaFinal");
    if (!caja) return;

    caja.textContent = `Caja final: $${appData.caja.final}`;
  }

  function mostrarVentas() {
    const lista = document.getElementById("listaVentas");
    if (!lista) return;

    lista.innerHTML = "";

    appData.ventas.forEach(v => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${v.producto}</strong>
        <p>${v.cantidad} unidades</p>
        <p>Total: $${v.total}</p>
        <small>${v.fecha}</small>
      `;

      lista.appendChild(li);
    });
  }

  window.cerrarDia = function() {
    appData.ventas = [];
    appData.caja.inicial = appData.caja.final;

    guardarDatos();
    mostrarVentas();
    calcularTotalVentas();
  };

  function filtrarProductos() {
    const texto = inputBuscar.value.toLowerCase();
    const lista = document.getElementById("listaInventario");
    if (!lista) return;

    lista.innerHTML = "";

    appData.inventario
      .filter(p => p.nombre.toLowerCase().includes(texto))
      .forEach((p, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
          <strong>${p.nombre}</strong>
          <p>Cantidad: ${p.cantidad}</p>
          <p>Precio: $${p.precio}</p>
          <button onclick="eliminarProducto(${index})">❌</button>
        `;

        lista.appendChild(li);
      });
  }

  function calcularTotalVentas() {
    const total = appData.ventas.reduce((acc, v) => acc + v.total, 0);

    const el = document.getElementById("totalVentas");
    if (!el) return;

    el.textContent = `Total vendido: $${total}`;
  }

  function guardarDatos() {
    localStorage.setItem("appData", JSON.stringify(appData));
  }

  function cargarDatos() {
    const data = localStorage.getItem("appData");
    if (data) appData = JSON.parse(data);
  }

  function limpiarInputsProducto() {
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
  }

  function limpiarInputsVenta() {
    document.getElementById("productoVenta").value = "";
    document.getElementById("cantidadVenta").value = "";
  }

});