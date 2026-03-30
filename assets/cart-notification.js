document.addEventListener('DOMContentLoaded', function() {
  const notification = document.getElementById('CartNotification');
  const closeNotifBtn = document.getElementById('CloseNotification');

  // Récupération des traductions dynamiques passées par Liquid
  const textAdding = window.themeStrings ? window.themeStrings.adding : 'Ajout en cours...';
  const textAdded = window.themeStrings ? window.themeStrings.addedToCart : 'Ajouté au panier';
  const textError = window.themeStrings ? window.themeStrings.errorAdding : 'Erreur lors de l\'ajout';

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

      // Utilisation de la variable au lieu du tag Liquid
      if (btnTextElement) btnTextElement.innerText = textAdding;
      else submitBtn.innerText = textAdding;
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
            // Utilisation de la variable au lieu du tag Liquid
            throw new Error(errorData.description || textError);
          });
        }
        return response.json();
      })
      .then(data => {
        // Utilisation de la variable au lieu du tag Liquid
        showNotification(textAdded);
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
