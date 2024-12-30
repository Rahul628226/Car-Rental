import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedCategories } from '../../../Store/Slicer/Dashboard/FeatureTag/FeatureTag';

const FeaturedCategoriesDropdown = ({ onfeatureTagChange }) => {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(state => state.featuredCategories);

    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        dispatch(fetchFeaturedCategories());
    }, [dispatch]);

    const handleCategoryChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedCategory(selectedValue);
        const selectedCat = categories.find(cat => cat._id === selectedValue);
        if (selectedCat) {
            onfeatureTagChange(selectedCat.name);
        }
    };

    return (
        <div className="flex flex-col absolute pt-[30px]">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className="flex items-center gap-2.5">
                    <div className="flex flex-1 items-center gap-2.5">
                        <label className="flex font-medium">
                            Featured Categories:
                        </label>
                        <select 
                            value={selectedCategory} 
                            onChange={handleCategoryChange}
                            className="p-2.5 border border-black text-base w-[220px] h-[40px] bg-white mr-5 ml-[15px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="">Select a Category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturedCategoriesDropdown;
