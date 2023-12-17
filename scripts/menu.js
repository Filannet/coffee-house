window.addEventListener("load", async () => {

    window.products = await (await fetch('./scripts/products.json')).json();
    window.productType = 'coffee';

    const burgerMenu = document.querySelector('a.burger-menu');
    burgerMenu.addEventListener('click', (event) => {
        event.preventDefault();
        const mobileMenu = document.querySelector('ul.mobile-menu');
        const body = document.querySelector('body');
        const burgerIcon = document.querySelector('.burger-icon');
        mobileMenu.classList.toggle('hidden');
        burgerIcon.classList.toggle('--close');
        body.classList.toggle('no-scroll');
    });

    document.querySelectorAll('.mobile-menu__link').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('ul.mobile-menu').classList.add('hidden');
            document.querySelector('.burger-icon').classList.remove('--close');
            document.querySelector('body').classList.remove('no-scroll');
        });
    })

    document.querySelectorAll('div.switcher__button').forEach(function (el) {
        el.addEventListener('click', (event) => {
            event.stopPropagation();

            document.querySelectorAll('div.switcher__button').forEach(function (el) {
                el.classList.remove('--active');
            });

            const type = event.currentTarget.dataset.type ?? '';

            if (type) {
                document.querySelector(`div[data-type=${type}].switcher__button`).classList.add('--active');
                selectMenu(type);
            }
        });
    });

    document.querySelector('.load-more').addEventListener('click', () => loadMore());

    document.querySelector('.modal__close').addEventListener('click', () => hideModal());

    function debounce(func){
        let timer;
        return function(event){
            if(timer) clearTimeout(timer);
            timer = setTimeout(func,100,event);
        };
    }

    window.addEventListener('resize',debounce(function(event) {
        console.log('resize')
        selectMenu(window.productType);
    }), true);

    selectMenu(window.productType);

});

window.addEventListener("resize", () => {
    document.querySelector('ul.mobile-menu').classList.add('hidden');
});

window.onclick = function (event) {
    const modal = document.querySelector('#modalMenu');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

async function selectMenu(type = 'coffee') {
    window.productType = type;
    const filtered = window.products.filter(item => item.category === type);
    const sliced = filtered.slice(0, getLimit());

    prepareCards(sliced, true);

    if (filtered.length <= getLimit()) {
        document.querySelector('.load-more').classList.add('--hidden');
    } else {
        document.querySelector('.load-more').classList.remove('--hidden');
    }
}

function loadMore() {
    let filtered = window.products.filter(item => item.category === window.productType);
    filtered = filtered.slice(getLimit());
    document.querySelector('.load-more').classList.add('--hidden');
    prepareCards(filtered);
}

function prepareCards(products, toClear = false) {
    let cards = [];
    const template = document.querySelector('div.menu__template');
    const menu = document.querySelector('div.coffee-menu');

    if (toClear) menu.innerHTML = '';

    products.forEach(item => {
        let card = template.cloneNode(true);
        card.classList.remove('menu__template');
        card.querySelector('.item__img').src = `images/menu/${item.image}`;
        card.querySelector('.menu__title').innerHTML = item.name;
        card.querySelector('.menu__text').innerHTML = item.description;
        card.querySelector('.menu__price').innerHTML = `$${item.price}`;
        card.dataset.id = item.name;
        card.addEventListener('click', (e) => showModal(e), true);
        cards.push(card);
    })

    cards.forEach(card => menu.appendChild(card));
}

function getLimit() {
    return window.innerWidth > 768 ? 8 : 4;
}

function showModal(e) {
    document.querySelector('#modalMenu').style.display = "block";
    const body = document.querySelector('body');
    body.classList.add('no-scroll');
    const modal = document.querySelector('#modalMenu');
    const name = e.target.dataset.id ?? '';

    if (modal && name) {

        const product = window.products.find(item => item.name === name);

        if (product) {
            modal.querySelector('.modal-wrapper > img').src = `images/menu/${product.image}`;
            modal.querySelector('.modal__content-wrapper-small > h3').innerHTML = product.name;
            modal.querySelector('.modal__content-wrapper-small > h4').innerHTML = product.description;
            modal.querySelector('.total-price').innerHTML = `$${product.price}`;

            const sizes = document.querySelector('div.sizes');
            const template = document.querySelector('div.switcher-template');
            const additives = document.querySelector('div.additives');

            sizes.innerHTML = '';
            additives.innerHTML = '';

            !!product.sizes && Object.keys(product.sizes).forEach((item, index) => {
                let size = template.cloneNode(true);
                const sizeItem = product.sizes[item];
                size.classList.add('size')
                size.classList.remove('switcher-template');
                size.querySelector('.modal-switcher__image').innerHTML = item;
                size.querySelector('.switcher__size').innerHTML = sizeItem.size;
                size.dataset.price = sizeItem['add-price'];
                size.addEventListener('click', (e) => {
                    e.stopPropagation();
                    document.querySelectorAll('.modal-switcher__button.size').forEach(item => {
                        item.classList.remove('--active');
                    });
                    e.currentTarget.classList.toggle('--active');
                    //TODO Calc Price
                });
                if (index === 0) size.classList.add('--active');
                sizes.appendChild(size);
            })

            !!product.additives && product.additives.forEach((item, index) => {
                let additive = template.cloneNode(true);
                additive.classList.remove('switcher-template');
                additive.querySelector('.modal-switcher__image').innerHTML = `${index + 1}`;
                additive.querySelector('.switcher__size').innerHTML = item.name;
                additive.dataset.price = item['add-price'];
                additive.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.currentTarget.classList.toggle('--active');
                    //TODO Calc Price
                });

               additives.appendChild(additive);
            })
        }
    }
}

function calcPrice() {
    return 0;
}

function hideModal() {
    document.querySelector('#modalMenu').style.display = "none";
    document.querySelector('body').classList.remove('no-scroll');
}
