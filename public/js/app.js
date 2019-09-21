const $cart = document.querySelector('#cart');


if ($cart) {
  $cart.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-remove')) {
      const id = e.target.dataset.id;

      fetch(`cart/remove/${id}`, { method: 'delete' })
        .then((res) => res.json())
        .then(({ courses, price }) => {
          if (courses.length) {
            const itemsTemplate = courses.map((item) => {
              return `
                <tr>
                  <td>${item.title}</td>
                  <td>${item.count}</td>
                  <td>
                    <button class="btn btn-small cart-remove" data-id="${item.id}">Delete</button>
                  </td>
                </tr>
              `;
            }).join('');

            $cart.querySelector('tbody').innerHTML = itemsTemplate;
            $cart.querySelector('.price').textContent = `$ ${price}`;
          } else {
            $cart.innerHTML = '<p>Cart is empty!</p>'
          }
        });
    }
  });
}
