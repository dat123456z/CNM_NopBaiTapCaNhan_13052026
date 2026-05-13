import React from "react";

const ProductCard = ({ product }) => {
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 relative">
            <div className="h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden relative">
                <img src={product.image} alt={product.title} className="object-cover w-full h-full" />

                {hasDiscount && (
                    <div className="absolute top-3 right-3">
                        <span className="text-sm font-semibold bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg">Giảm {discountPercent}%</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{product.title}</h3>
                    <span className="text-xs text-gray-500">{product.category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.desc}</p>
                <div className="flex items-center justify-between">
                    <div>
                        {hasDiscount ? (
                            <div className="flex items-baseline gap-2">
                                <div className="text-sm text-gray-400 line-through">{product.originalPrice.toLocaleString()}₫</div>
                                <div className="text-lg font-bold text-primary">{product.price.toLocaleString()}₫</div>
                            </div>
                        ) : (
                            <div className="text-lg font-bold text-primary">{product.price.toLocaleString()}₫</div>
                        )}
                        <div className="text-xs text-gray-400">{product.sold} đã bán</div>
                    </div>
                    <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm">Mua</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
