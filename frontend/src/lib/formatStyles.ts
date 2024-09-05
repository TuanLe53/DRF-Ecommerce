export const setStatusColor = (status: string): string => {
    return status === 'RECEIVED'
        ? 'text-green-500'
        : status === 'DELIVERING'
            ? 'text-orange-500'
            : status === 'CANCELLED'
                ? 'text-red-500'
                : '';
};

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};