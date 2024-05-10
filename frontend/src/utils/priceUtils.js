export const VNDDong = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export const totalPrice = (items) => {
    let total = 0;

    for (let i = 0; i < items.length; i++){
        total += items[i].quantity * items[i].product.price
    }

    return VNDDong.format(total)
}