export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
};

export const truncate = (text, length) => {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
};

export const getInitials = (name) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map((namePart) => namePart[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
