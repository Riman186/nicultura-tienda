document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const modalNombre = document.getElementById('detalle-nombre');
    const modalPrecio = document.getElementById('detalle-precio');
    const modalTallas = document.getElementById('detalle-tallas-info');
    const modalColores = document.getElementById('detalle-colores-info');

    // Variables para carrito
    const carrito = [];
    const carritoDOM = document.getElementById('lista-carrito');
    const totalCarritoDOM = document.getElementById('total-carrito');
    
    // Función para actualizar el carrito
    function actualizarCarrito() {
        carritoDOM.innerHTML = '';
        let total = 0;
        carrito.forEach(producto => {
            total += producto.precio;
            const itemCarrito = document.createElement('div');
            itemCarrito.classList.add('item-carrito');
            itemCarrito.innerHTML = `
                <p>${producto.nombre}</p>
                <p>C$${producto.precio.toFixed(2)}</p>
                <button class="eliminar-producto" data-index="${carrito.indexOf(producto)}">Eliminar</button>
            `;
            carritoDOM.appendChild(itemCarrito);
        });
        totalCarritoDOM.innerText = total.toFixed(2);

        document.querySelectorAll('.eliminar-producto').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                carrito.splice(index, 1);
                actualizarCarrito();
            });
        });
    }

    // Función para manejar el botón "Agregar al carrito"
    function agregarProductoAlCarrito(button) {
        button.addEventListener('click', function () {
            const productoElement = this.closest('.producto');
            const nombre = productoElement.querySelector('h3').innerText;
            const precio = parseFloat(productoElement.querySelector('.precio').innerText.replace('Precio: C$', ''));
            
            // Agregar el producto al carrito
            carrito.push({ nombre, precio });
            actualizarCarrito(); // Actualiza la vista del carrito
        });
    }

    // Seleccionar todos los botones de "Agregar al carrito"
    const agregarCarritoBtns = document.querySelectorAll('.agregar-carrito');
    agregarCarritoBtns.forEach(agregarProductoAlCarrito);

    // Función para mostrar modal con detalles del producto
    document.querySelectorAll('.ver-detalles').forEach(button => {
        button.addEventListener('click', function () {
            const producto = this.closest('.producto');
            const nombre = producto.querySelector('h3').textContent;
            const precio = producto.querySelector('.precio').textContent;
            const imagenSrc = producto.querySelector('img').src;
            
            // Extraer correctamente las tallas seleccionadas
            const tallas = Array.from(producto.querySelectorAll('.talla option')).map(option => option.textContent).join(', ');

            // Extraer correctamente los colores
            const colores = Array.from(producto.querySelectorAll('.color')).map(button => button.textContent).join(', ');

            // Rellenar el modal con la información del producto
            modalNombre.textContent = nombre;
            modalPrecio.textContent = precio;
            document.getElementById('detalle-imagen').src = imagenSrc;
            modalTallas.textContent = tallas; // Mostrar tallas como texto
            modalColores.textContent = colores; // Mostrar colores como texto

            // Mostrar el modal
            modal.style.display = 'block';
        });
    });

    // Cerrar el modal al hacer clic en la "X"
    closeModal.onclick = function () {
        modal.style.display = 'none';
    };

    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Configuración de PayPal
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: totalCarritoDOM.innerText }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Transacción completada por ' + details.payer.name.given_name);
                carrito.length = 0;
                actualizarCarrito();
            });
        }
    }).render('#paypal-button-container');

    // Colores seleccionables
    const colores = document.querySelectorAll('.color');
    colores.forEach(color => {
        color.addEventListener('click', () => {
            colores.forEach(c => c.classList.remove('selected'));
            color.classList.add('selected');
        });
    });

    // Desplazamiento suave para el menú de navegación
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        });
    });
});
