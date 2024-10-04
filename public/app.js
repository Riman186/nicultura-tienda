document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    const modal = document.getElementById('modal-detalles');
    const closeModal = document.querySelector('.close');
    const modalNombre = document.getElementById('detalle-nombre');
    const modalPrecio = document.getElementById('detalle-precio');
    const modalTallas = document.getElementById('detalle-tallas');
    const modalColores = document.getElementById('detalle-colores');
    const modalImagenes = document.createElement('div'); // Contenedor para las imágenes
    modalImagenes.classList.add('detalle-imagenes'); // Clase para dar estilo a las imágenes en el modal

    function verificarColorSeleccionado(producto) {
        const colores = producto.querySelectorAll('.color');
        let colorSeleccionado = false;
    
        colores.forEach(color => {
            if (color.classList.contains('seleccionado')) {
                colorSeleccionado = true;
            }
        });
    
        return colorSeleccionado;
    }

   // Seleccionar todos los botones de "Ver Detalles"
document.querySelectorAll('.ver-detalles').forEach(button => {
    button.addEventListener('click', function() {
        // Obtener el producto más cercano al botón
        const producto = this.closest('.producto');
        

        // Extraer el nombre del producto
        const nombre = producto.querySelector('h3').textContent; 
        
        // Extraer el precio del producto
        const precio = producto.querySelector('.precio').textContent;
        
        // Extraer la imagen del producto
        const imagenSrc = producto.querySelector('img').src;
        const tallas = producto.querySelector('.talla').textContent; // Obtener tallas
        const colores = producto.querySelector('.colores').textContent; // Obtener colores
        const descripcion = "Aquí puedes poner una descripción del producto.";
        
        // Colocar los datos extraídos en el modal
        document.getElementById('detalle-nombre').textContent = nombre;
        document.getElementById('detalle-precio').textContent = precio;
        document.getElementById('detalle-imagen').src = imagenSrc;
        document.getElementById('detalle-tallas-info').textContent = tallas; // Mostrar tallas
        document.getElementById('detalle-colores-info').textContent = colores; // Mostrar colores
        document.getElementById('detalle-descripcion-info')

        // Mostrar el modal
        document.getElementById('modal').style.display = 'block';
    });
});

// Cerrar el modal al hacer clic en la "X"
document.getElementById('close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
};

// Cerrar el modal al hacer clic fuera de él
window.onclick = function(event) {
    if (event.target === document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
};

    // Carrito de compras
    const carrito = [];
    const carritoDOM = document.getElementById('lista-carrito');
    const totalCarritoDOM = document.getElementById('total-carrito');
    const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');

    // Función para actualizar el carrito
    function actualizarCarrito() {
        // Limpiar el contenido del carrito
        carritoDOM.innerHTML = '';

        // Recalcular total
        let total = 0;
        carrito.forEach(producto => {
            total += producto.precio;

            // Crear elementos para cada producto en el carrito
            const itemCarrito = document.createElement('div');
            itemCarrito.classList.add('item-carrito');
            itemCarrito.innerHTML = `
                <p>${producto.nombre}</p>
                <p>C$${producto.precio.toFixed(2)}</p>
                <button class="eliminar-producto" data-index="${carrito.indexOf(producto)}">Eliminar</button>
            `;
            carritoDOM.appendChild(itemCarrito);
        });

        // Mostrar el total en el DOM
        totalCarritoDOM.innerText = total.toFixed(2);

        // Añadir funcionalidad para eliminar productos del carrito
        document.querySelectorAll('.eliminar-producto').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                carrito.splice(index, 1); // Elimina el producto del carrito
                actualizarCarrito(); // Actualiza la vista del carrito
            });
        });
    }

    // Función para agregar productos al carrito
    agregarCarritoBtns.forEach(button => {
        button.addEventListener('click', function () {
            const productoElement = this.closest('.producto');
            const nombre = productoElement.querySelector('h3').innerText;
            const precio = parseFloat(productoElement.querySelector('.precio').innerText.replace('Precio: C$', ''));
             // Validar si se seleccionó un color

            // Añadir el producto al carrito
            carrito.push({
                nombre: nombre,
                precio: precio
            });

            actualizarCarrito(); // Actualiza la vista del carrito
        });
    });

    // Configuración de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalCarritoDOM.innerText // Total del carrito
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Transacción completada por ' + details.payer.name.given_name);
                carrito.length = 0; // Vaciar carrito después de la compra
                actualizarCarrito();
            });
        }
    }).render('#paypal-button-container');
});
const colores = document.querySelectorAll('.color');

colores.forEach(color => {
    color.addEventListener('click', () => {
        // Eliminar la clase 'selected' de todos los colores
        colores.forEach(c => c.classList.remove('selected'));
        // Añadir la clase 'selected' al color que se ha clicado
        color.classList.add('selected');
    });
});

