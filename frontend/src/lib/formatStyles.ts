export const setStatusColor = (status: string):string=>{
    return status === 'RECEIVED'
    ? 'text-green-500'
    : status ==='DELIVERING'
            ? 'text-orange-500'
            : status === 'CANCELLED'
                ?'text-red-500'
                : '';
}