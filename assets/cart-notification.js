document.addEventListener('DOMContentLoaded', function() {
  const notification = document.getElementById('CartNotification');
  const closeNotifBtn = document.getElementById('CloseNotification');

  function showNotification(message, isError = false) {
    if (!notification) return;

    const notifText = notification.querySelector('p');
    const notifIcon = notification.querySelector('.success-icon');

    notifText.textContent = message;
  
    if (isError) {
      notifIcon.textContent = '✕';
    } else {
      notifIcon.textContent = '✓';
    }

    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 5000);
  }

  function updateCartCount() {
    fetch(window.Shopify.routes.root + 'cart.js')
      .then(res => res.json())
      .then(cart => {
        const cartCounters = document.querySelectorAll('.cart-count-bubble, .cart-count, [data-cart-count], .cart-icon-count, .mainNav__cart-count');
        cartCounters.forEach(counter => {
          counter.textContent = cart.item_count;
          if (cart.item_count > 0) {
            counter.classList.remove('hidden', 'd-none');
          }
        });
      })
      .catch(e => console.error(e));
  }

  const addToCartForms = document.querySelectorAll('form[action$="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (!submitBtn) return;

      const btnTextElement = submitBtn.querySelector('span');
      const originalText = btnTextElement ? btnTextElement.innerText : (submitBtn.innerText || submitBtn.textContent);

      if (btnTextElement) btnTextElement.innerText = '{{ "cart.general.adding" | t }}';
      else submitBtn.innerText = '{{ "cart.general.adding" | t }}';
      submitBtn.disabled = true;

      const formData = new FormData(form);

      fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.description || '{{ "cart.general.error_adding" | t }}');
          });
        }
        return response.json();
      })
      .then(data => {
        showNotification('{{ "cart.general.added_to_cart" | t }}');
        updateCartCount();
      })
      .catch((error) => {
        showNotification(error.message, true);
      })
      .finally(() => {
        if (btnTextElement) {
          btnTextElement.innerText = originalText;
        } else {
          submitBtn.innerText = originalText;
        }
        submitBtn.disabled = false;
      });
    });
  });

  if (closeNotifBtn) {
    closeNotifBtn.addEventListener('click', () => notification.classList.remove('show'));
  }
});
