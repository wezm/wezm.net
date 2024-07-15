document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('forex');
    select.addEventListener('change', updatePrices);
    // Trigger initial conversion (Firefox preserves selected option across refresh
    updatePrices.call(select);
})

/**
 * @this {HTMLSelectElement}
 */
function updatePrices() {
    const select = this;
    const option = select.options[select.selectedIndex];
    const ccy = option.value;
    const rate = parseFloat(option.dataset.price);
    const formatter = new Intl.NumberFormat(navigator.languages, { style: 'currency', currency: ccy });

    const prices = document.querySelectorAll('.money');
    for (let i = 0; i < prices.length; i++) {
        const el = prices[i];
        let converted = parseFloat(el.dataset.amount) * rate;
        if (!isNaN(converted)) {
            el.innerText = formatter.format(converted);
        }
    }
}
