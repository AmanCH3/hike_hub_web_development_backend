import React from 'react';
const NavigationContext = React.createContext();

const FeaturedProducts = () => {
    const products = [
        {
            id: 1,
            name: 'Himalayan Apples',
            price: 'Rs. 250 / kg',
            image: 'https://img.lb.wbmdstatic.com/vim/live/webmd/consumer_assets/site_images/articles/health_tools/healing_foods_slideshow/1800ss_getty_rf_apples.jpg?resize=750px:*&output-quality=75' // apples
        },
        {
            id: 2,
            name: 'Organic Spinach',
            price: 'Rs. 80 / bunch',
            image: 'https://static-01.daraz.pk/p/db2ce9f418b55832e2321736d18674e7.jpg' // spinach
        },
        {
            id: 3,
            name: 'Artisan Sourdough',
            price: 'Rs. 220 / loaf',
            image: 'https://homegrownhappiness.com/wp-content/uploads/2018/10/sourdough-croissants-laminted-2-720x720.jpg' // sourdough bread
        },
        {
            id: 4,
            name: 'Fresh Cow Milk',
            price: 'Rs. 90 / liter',
            image: 'https://static.toiimg.com/photo/69464837.cms' // milk
        },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Bestsellers</h2>
                    <p className="text-lg text-gray-600 mt-2">Loved by our customers, picked for you.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                <p className="text-gray-700 font-bold mt-2">{product.price}</p>
                                <button className="mt-4 w-full bg-green-100 text-green-700 font-bold py-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
export { NavigationContext, FeaturedProducts };