/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Не указано';

    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Некорректная дата';
    }

    // Format: "DD.MM.YYYY, HH:MM"
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};