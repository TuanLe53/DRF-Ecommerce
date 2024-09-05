export function formatDateString(dateStr: string | Date): string {
    // Create a Date object from the date string
    const date = new Date(dateStr);
  
    // Extract day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();
  
    // Format the date to dd/MM/yyyy
    return `${day}/${month}/${year}`;
}

export function formatDate(dateStr: string | Date): string{
    const date = new Date(dateStr);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getUTCFullYear();

    return `${year}-${month}-${day}`
}