import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCollection } from '../services/api';
import { getProductImage } from '../utils/productImages';

export default function Categories() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('id');
    const keyword = searchParams.get('keyword');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await getCollection('categories');
                setCategories(categoriesData);

                const productsData = await getCollection('products', {
                    ...(categoryId ? { categoryId } : {}),
                    ...(keyword ? { name_like: keyword } : {}),
                });
                setProducts(productsData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [categoryId, keyword]);

    return (
        <main className="page-shell">
            <aside className="sidebar">
                <h2>DANH MỤC SẢN PHẨM</h2>
                <ul className="category-list">
                    <li><Link to="/categories">Tất cả sản phẩm</Link></li>
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <Link to={`/categories?id=${cat.id}`}>{cat.name}</Link>
                        </li>
                    ))}
                </ul>
            </aside>
            <section className="content">
                <h2>{keyword ? `Kết quả tìm kiếm cho "${keyword}"` : (categoryId ? "Sản phẩm theo danh mục" : "Tất cả sản phẩm")}</h2>
                <section className="product-grid" style={{ marginTop: '20px' }}>
                    {products.length > 0 ? products.map(product => (
                        <article className="product-card" key={product.id}>
                            <figure>
                                <img src={getProductImage(product.image)} alt={product.name} onError={(e) => e.target.src='https://via.placeholder.com/200'} />
                            </figure>
                            <h3>{product.name}</h3>
                            <strong>{product.price.toLocaleString('vi-VN')}đ</strong>
                            <p className={`product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                                {product.stock > 0 ? `Còn hàng: ${product.stock}` : "Hết hàng"}
                            </p>
                            <div className="product-actions">
                                <Link className="detail-btn" to={`/product-detail/${product.id}`}>Xem chi tiết</Link>
                            </div>
                        </article>
                    )) : (
                        <p className="home-empty-message">Không tìm thấy sản phẩm nào phù hợp.</p>
                    )}
                </section>
            </section>
        </main>
    );
}
