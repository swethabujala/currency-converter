document.addEventListener('DOMContentLoaded', () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const amount = document.getElementById('amount');
    const result = document.getElementById('result');
    const convertButton = document.getElementById('convert-button');
    const swapButton = document.getElementById('swap-button');

    // Extended list of currencies
    const currencies = {
        USD: "US Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        JPY: "Japanese Yen",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        HKD: "Hong Kong Dollar",
        NZD: "New Zealand Dollar",
        SEK: "Swedish Krona",
        KRW: "South Korean Won",
        SGD: "Singapore Dollar",
        NOK: "Norwegian Krone",
        MXN: "Mexican Peso",
        INR: "Indian Rupee",
        RUB: "Russian Ruble",
        ZAR: "South African Rand",
        TRY: "Turkish Lira",
        BRL: "Brazilian Real",
        TWD: "Taiwan Dollar",
        DKK: "Danish Krone",
        PLN: "Polish Zloty",
        THB: "Thai Baht",
        IDR: "Indonesian Rupiah",
        HUF: "Hungarian Forint",
        CZK: "Czech Koruna",
        ILS: "Israeli Shekel",
        CLP: "Chilean Peso",
        PHP: "Philippine Peso",
        AED: "UAE Dirham",
        COP: "Colombian Peso",
        SAR: "Saudi Riyal",
        MYR: "Malaysian Ringgit",
        RON: "Romanian Leu"
    };

    // Sort currencies alphabetically by their full names
    const sortedCurrencies = Object.entries(currencies)
        .sort((a, b) => a[1].localeCompare(b[1]));

    // Populate currency dropdowns
    sortedCurrencies.forEach(([code, name]) => {
        const option1 = new Option(`${code} - ${name}`, code);
        const option2 = new Option(`${code} - ${name}`, code);
        fromCurrency.add(option1);
        toCurrency.add(option2);
    });

    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';

    // Format number with proper separators
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    // Convert currency function
    async function convertCurrency() {
        const amount_val = amount.value;
        if (!amount_val) {
            alert('Please enter an amount');
            return;
        }

        try {
            convertButton.disabled = true;
            convertButton.textContent = 'Converting...';
            
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
            const data = await response.json();
            const rate = data.rates[toCurrency.value];
            const convertedAmount = amount_val * rate;
            result.value = formatNumber(convertedAmount);

            // Show the exchange rate
            const rateInfo = document.createElement('div');
            rateInfo.textContent = `1 ${fromCurrency.value} = ${formatNumber(rate)} ${toCurrency.value}`;
            rateInfo.style.textAlign = 'center';
            rateInfo.style.marginTop = '10px';
            rateInfo.style.color = '#666';
            
            const existingRateInfo = document.querySelector('.rate-info');
            if (existingRateInfo) {
                existingRateInfo.remove();
            }
            rateInfo.className = 'rate-info';
            convertButton.parentNode.insertBefore(rateInfo, convertButton.nextSibling);
        } catch (error) {
            alert('Error fetching exchange rates. Please try again later.');
            console.error('Error:', error);
        } finally {
            convertButton.disabled = false;
            convertButton.textContent = 'Convert';
        }
    }

    // Swap currencies function
    function swapCurrencies() {
        const temp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        if (amount.value) convertCurrency();
    }

    // Event listeners
    convertButton.addEventListener('click', convertCurrency);
    swapButton.addEventListener('click', swapCurrencies);
    amount.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') convertCurrency();
    });

    // Add input validation for amount
    amount.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Remove any non-numeric characters except decimal point
        value = value.replace(/[^\d.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        e.target.value = value;
    });
});
