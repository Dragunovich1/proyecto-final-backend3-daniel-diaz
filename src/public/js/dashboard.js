document.addEventListener('DOMContentLoaded', () => {
  // Lógica para mostrar el modal de agregar productos
  document.querySelector('#add-product-btn').addEventListener('click', () => {
    document.querySelector('#add-product-modal').style.display = 'block';
  });

  // Lógica para cerrar los modales
  document.querySelectorAll('.close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      closeBtn.parentElement.parentElement.style.display = 'none';
    });
  });

  // Lógica para enviar el formulario de agregar producto
  document.querySelector('#add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {};
    formData.forEach((value, key) => (productData[key] = value));

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Producto creado') {
          // Cerrar modal de agregar producto
          document.querySelector('#add-product-modal').style.display = 'none';
          showAlert('Producto creado exitosamente', 'success');

          // Añadir el nuevo producto a la tabla
          const productTable = document.querySelector('#product-list');
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td>${productData.title}</td>
            <td>${productData.description}</td>
            <td>${productData.code}</td>
            <td>$${productData.price}</td>
            <td>${productData.category}</td>
            <td>${productData.stock}</td>
            <td>
              <button class="edit-btn btn-action" data-id="${data.product._id}" data-title="${productData.title}" data-description="${productData.description}" data-code="${productData.code}" data-price="${productData.price}" data-category="${productData.category}" data-stock="${productData.stock}">Editar</button>
              <button class="add-cart-btn btn-action" data-id="${data.product._id}">Agregar al Carrito</button>
              <button class="delete-btn btn-action delete-btn-red" data-id="${data.product._id}">Eliminar</button>
            </td>
          `;
          productTable.appendChild(newRow);

          // Actualizar la lógica de botones (editar, agregar al carrito, eliminar)
          attachEventListenersToButtons(newRow);
        }
      });
  });

  // Lógica para abrir el modal de edición con datos precargados
  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const productTitle = button.getAttribute('data-title');
      const productDescription = button.getAttribute('data-description');
      const productCode = button.getAttribute('data-code');
      const productPrice = button.getAttribute('data-price');
      const productCategory = button.getAttribute('data-category');
      const productStock = button.getAttribute('data-stock');

      // Precargar valores en el formulario de edición
      document.querySelector('#edit-id').value = productId;
      document.querySelector('#edit-title').value = productTitle;
      document.querySelector('#edit-description').value = productDescription;
      document.querySelector('#edit-code').value = productCode;
      document.querySelector('#edit-price').value = productPrice;
      document.querySelector('#edit-category').value = productCategory;
      document.querySelector('#edit-stock').value = productStock;

      // Mostrar el modal de edición
      document.querySelector('#edit-product-modal').style.display = 'block';
    });
  });

  // Lógica para enviar el formulario de editar producto
  document.querySelector('#edit-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const productId = document.querySelector('#edit-id').value;
    const formData = new FormData(e.target);
    const productData = {};
    formData.forEach((value, key) => (productData[key] = value));

    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Producto actualizado') {
          // Cerrar modal de edición
          document.querySelector('#edit-product-modal').style.display = 'none';
          showAlert('Producto actualizado correctamente', 'success');

          // Actualizar el producto en la tabla
          const updatedRow = document.querySelector(`button[data-id="${productId}"]`).closest('tr');
          updatedRow.innerHTML = `
            <td>${productData.title}</td>
            <td>${productData.description}</td>
            <td>${productData.code}</td>
            <td>$${productData.price}</td>
            <td>${productData.category}</td>
            <td>${productData.stock}</td>
            <td>
              <button class="edit-btn btn-action" data-id="${productId}" data-title="${productData.title}" data-description="${productData.description}" data-code="${productData.code}" data-price="${productData.price}" data-category="${productData.category}" data-stock="${productData.stock}">Editar</button>
              <button class="add-cart-btn btn-action" data-id="${productId}">Agregar al Carrito</button>
              <button class="delete-btn btn-action delete-btn-red" data-id="${productId}">Eliminar</button>
            </td>
          `;

          // Actualizar la lógica de botones (editar, agregar al carrito, eliminar)
          attachEventListenersToButtons(updatedRow);
        }
      });
  });

  // Lógica para eliminar productos
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');

      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Producto eliminado') {
            showAlert('Producto eliminado exitosamente', 'warning');

            // Eliminar la fila correspondiente en la tabla
            const rowToDelete = document.querySelector(`button[data-id="${productId}"]`).closest('tr');
            rowToDelete.remove();
          }
        });
    });
  });

  // Lógica para agregar al carrito
  document.querySelectorAll('.add-cart-btn').forEach((button) => {
    button.addEventListener('click', handleAddToCart);
  });

  // Función para mostrar alertas de CSS
  function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alertElement = document.createElement('div');

    alertElement.className = `alert alert-${type}`;
    alertElement.innerText = message;

    alertContainer.appendChild(alertElement);

    setTimeout(() => {
      alertElement.remove();
    }, 5000);
  }

  // Función para manejar agregar al carrito
  function handleAddToCart() {
    const productId = this.getAttribute('data-id');

    fetch(`/api/carts/add/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 1 }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Producto agregado al carrito') {
          showAlert('Producto agregado al carrito correctamente', 'success');
        } else {
          showAlert('Error al agregar el producto al carrito', 'error');
        }
      })
      .catch((error) => {
        console.error('Error al agregar al carrito:', error);
        showAlert('Ocurrió un error al intentar agregar el producto al carrito', 'error');
      });
  }

  // Función para agregar event listeners a los nuevos botones dinámicos (editar, agregar al carrito, eliminar)
  function attachEventListenersToButtons(row) {
    row.querySelector('.edit-btn').addEventListener('click', () => {
      const button = row.querySelector('.edit-btn');
      const productId = button.getAttribute('data-id');
      const productTitle = button.getAttribute('data-title');
      const productDescription = button.getAttribute('data-description');
      const productCode = button.getAttribute('data-code');
      const productPrice = button.getAttribute('data-price');
      const productCategory = button.getAttribute('data-category');
      const productStock = button.getAttribute('data-stock');

      document.querySelector('#edit-id').value = productId;
      document.querySelector('#edit-title').value = productTitle;
      document.querySelector('#edit-description').value = productDescription;
      document.querySelector('#edit-code').value = productCode;
      document.querySelector('#edit-price').value = productPrice;
      document.querySelector('#edit-category').value = productCategory;
      document.querySelector('#edit-stock').value = productStock;

      document.querySelector('#edit-product-modal').style.display = 'block';
    });

    row.querySelector('.delete-btn').addEventListener('click', () => {
      const button = row.querySelector('.delete-btn');
      const productId = button.getAttribute('data-id');

      fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Producto eliminado') {
            showAlert('Producto eliminado exitosamente', 'success');
            row.remove();
          }
        });
    });

    row.querySelector('.add-cart-btn').addEventListener('click', handleAddToCart);
  }
});
