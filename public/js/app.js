function formatDate(date) {
  return Intl.DateTimeFormat('en-EN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date));
}


document.querySelectorAll('.date').forEach((node) => {
  node.textContent = formatDate(node.textContent);
});


const $cart = document.querySelector('#cart');


if ($cart) {
  $cart.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-remove')) {
      const id = e.target.dataset.id;
      const csrf = e.target.dataset.csrf;

      fetch(`cart/remove/${id}`, {
        method: 'delete',
        headers: { 'X-XSRF-TOKEN': csrf }
      })
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


M.Tabs.init(document.querySelectorAll('.tabs'));
