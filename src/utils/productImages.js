const productImages = import.meta.glob('../assets/images/products/*', {
    eager: true,
    query: '?url',
    import: 'default',
});

export function getProductImage(imageName) {
    return productImages[`../assets/images/products/${imageName}`] || '';
}
