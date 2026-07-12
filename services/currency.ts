
export type SupportedCurrency = 'USD' | 'SAR' | 'AED' | 'KWD' | 'EGP' | 'EUR' | 'GBP';

const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
    USD: 1,
    SAR: 3.75,
    AED: 3.67,
    KWD: 0.31,
    EGP: 48.5, // Approx fluctuating rate
    EUR: 0.92,
    GBP: 0.79
};

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
    USD: '$',
    SAR: 'ر.س',
    AED: 'د.إ',
    KWD: 'د.ك',
    EGP: 'ج.م',
    EUR: '€',
    GBP: '£'
};

export const CurrencyService = {
    // Detect currency based on user's timezone (Browser API)
    detectLocalCurrency: (): SupportedCurrency => {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            if (timeZone.startsWith('Asia/Riyadh')) return 'SAR';
            if (timeZone.startsWith('Asia/Dubai')) return 'AED';
            if (timeZone.startsWith('Asia/Kuwait')) return 'KWD';
            if (timeZone.startsWith('Africa/Cairo')) return 'EGP';
            if (timeZone.startsWith('Europe/London')) return 'GBP';
            if (timeZone.startsWith('Europe/')) return 'EUR';
            
            return 'USD'; // Default fallback
        } catch {
            return 'USD';
        }
    },

    convertPrice: (priceInUSD: number, currency: SupportedCurrency): string => {
        const rate = EXCHANGE_RATES[currency] || 1;
        const converted = priceInUSD * rate;
        
        // Format nicely
        const formatted = converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return `${formatted} ${CURRENCY_SYMBOLS[currency]}`;
    },

    formatPrice: (priceInUSD: number, currency?: SupportedCurrency): string => {
        const targetCurrency = currency || 'USD';
        return CurrencyService.convertPrice(priceInUSD, targetCurrency);
    }
};
