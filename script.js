document.addEventListener('DOMContentLoaded', () => {
    const carrito = document.getElementById('carrito');
    const elementos1 = document.getElementById('lista-1');
    const lista = document.querySelector('#lista-carrito tbody') || document.querySelector('#lista-carrito');
    const vaciarCarritoBtn = document.getElementById('vaciar_carrito');

    // --- añadido: configura aquí la ruta/nombre del archivo QR ---
    const qrFileName = "qr pago.png"; // ejemplo: 'imagenes de polos/qr.png'

    // Crear botón "Pagar la compra" y contenedor de QR junto al botón "vaciar_carrito"
    if (vaciarCarritoBtn) {
        const pagarBtn = document.createElement('a');
        pagarBtn.href = '#';
        pagarBtn.id = 'pagar_compra';
        pagarBtn.className = 'btn-2';
        pagarBtn.textContent = 'Pagar la compra';
        pagarBtn.style.marginLeft = '10px';
        vaciarCarritoBtn.insertAdjacentElement('afterend', pagarBtn);

        const qrContainer = document.createElement('div');
        qrContainer.id = 'qr_container';
        qrContainer.style.display = 'none';
        qrContainer.style.marginTop = '10px';

        const qrImg = document.createElement('img');
        qrImg.id = 'qr_img';
        qrImg.alt = 'Código QR de pago';
        qrImg.style.maxWidth = '220px';
        qrImg.style.display = 'block';
        qrImg.style.border = '1px solid #ccc';
        qrImg.style.background = '#fff';
        qrImg.style.padding = '6px';
        qrImg.style.borderRadius = '6px';
        qrImg.style.margin = '0 auto';

        if (qrFileName) {
            qrImg.src = qrFileName;
            qrContainer.appendChild(qrImg);
        } else {
            const aviso = document.createElement('div');
            aviso.textContent = 'Archivo QR no definido. Edita qrFileName en script.js';
            aviso.style.color = '#fff';
            qrContainer.appendChild(aviso);
        }

        // Agregar texto descriptivo debajo del QR
        const qrText = document.createElement('p');
        qrText.textContent = 'Escanea y envia la captura del yape a este numero 123456789.';
        qrText.style.marginTop = '15px';
        qrText.style.fontSize = '14px';
        qrText.style.color =  'blanco' ;
        qrText.style.textAlign = 'center';
        qrText.style.lineHeight = '1.5';
        qrContainer.appendChild(qrText);

        // Insertar el contenedor después del botón (mismo padre que vaciarCarritoBtn)
        vaciarCarritoBtn.parentElement.appendChild(qrContainer);

        pagarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!qrFileName) {
                alert('Archivo QR no definido. Coloca la ruta en la variable qrFileName dentro de script.js.');
                return;
            }
            qrContainer.style.display = qrContainer.style.display === 'none' ? 'block' : 'none';
        });
    }
    // --- fin añadido ---

    function cargarEventListeners() {
        if (elementos1) elementos1.addEventListener('click', comprarElemento);
        if (carrito) carrito.addEventListener('click', eliminarElemento);
        if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }

    // ...existing code...
    function comprarElemento(e) {
        const boton = e.target.closest ? e.target.closest('.agregar-carrito') : null;
        if (!boton) return;
        e.preventDefault();
        const producto = boton.closest('.product');
        if (producto) leerDatosElemento(producto, boton);
    }

    function leerDatosElemento(elemento, boton) {
        if (!elemento) return;
        const imgEl = elemento.querySelector('img');
        const tituloEl = elemento.querySelector('h3');
        const precioEl = elemento.querySelector('.precio') || (() => {
            const ps = elemento.querySelectorAll('p');
            return ps.length ? ps[ps.length - 1] : null;
        })();
        const id = boton ? boton.getAttribute('data-id') : (elemento.querySelector('a[data-id]') || {}).getAttribute?.('data-id') || '';

        const infoElemento = {
            imagen: imgEl ? imgEl.src : '',
            titulo: tituloEl ? tituloEl.textContent.trim() : '',
            precio: precioEl ? precioEl.textContent.trim() : '',
            id: id || ''
        };
        insertarCarrito(infoElemento);
    }

    function insertarCarrito(elemento) {
        if (!lista) return;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${elemento.imagen}" width="100" alt="${elemento.titulo}"></td>
            <td>${elemento.titulo}</td>
            <td>${elemento.precio}</td>
            <td><a href="#" class="borrar-elemento" data-id="${elemento.id}">X</a></td>
        `;
        lista.appendChild(row);
    }

    function eliminarElemento(e) {
        if (!e.target.classList.contains('borrar-elemento')) return;
        e.preventDefault();
        const row = e.target.closest('tr');
        const elementoId = e.target.getAttribute('data-id');
        if (row) row.remove();
    }

    function vaciarCarrito(e) {
        if (e) e.preventDefault();
        if (!lista) return false;
        lista.innerHTML = '';
        return false;
    }

    cargarEventListeners();
});
