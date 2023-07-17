document.querySelector('.all').addEventListener('click', () => {
    let products = document.querySelectorAll('.product');
    products.forEach((product) => {
        product.style.display = 'block';
    })
})

document.querySelector('.milk').addEventListener('click', () => {
    let products = document.querySelectorAll('.product');
    products.forEach((product) => {
        if (product.getAttribute('data-type') === 'milk') {
            product.style.display = 'block';
        }else {
            product.style.display = 'none';
        }
    })
})


document.querySelector('.cheese').addEventListener('click', () => {
    let products = document.querySelectorAll('.product');
    products.forEach((product) => {
        if (product.getAttribute('data-type') === 'cheese') {
            product.style.display = 'block';
        }else {
            product.style.display = 'none';
        }
    })
})

document.querySelector('.salad').addEventListener('click', () => {
    let products = document.querySelectorAll('.product');
    products.forEach((product) => {
        if (product.getAttribute('data-type') === 'salad') {
            product.style.display = 'block';
        }else {
            product.style.display = 'none';
        }
    })
})

