document.getElementById('pay-btn').addEventListener('click', () => {
    fetch('/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: 'premium_upgrade'
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = data.checkoutUrl;
        } else {
          alert('Không thể tạo link thanh toán.');
        }
      })
      .catch((error) => console.error('Error:', error));
  });
  