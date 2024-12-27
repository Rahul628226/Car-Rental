import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    fetchMainCategories,
    fetchCategoriesByParent,
    fetchSubcategories,
    selectMainCategory,
    selectCategory,
    selectsubCategory
} from '../../../Store/Slicer/Dashboard/Category/Categoryslicer'


const Container = styled.div`
  display: flex;
  flex-direction: column;
//   padding-top: 70px;
`;

const DropdownsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const DropdownContainer = styled.div`
  flex: 1;
  width: 60%;
`;

const Select = styled.select`
  padding: 10px;
  
  border: 1px solid black;
  font-size: 16px;
  width: 235px;
  background-color: white;
`;

const CategoryDropdowns = ({ onMainCategoryChange, onCategoryChange, onSubcategoryChange }) => {
    const dispatch = useDispatch();
    const { mainCategories, categories, subcategories } = useSelector(state => state.categories);

    const [selectedMainCat, setSelectedMainCat] = useState('');
    const [selectedCat, setSelectedCat] = useState('');

    useEffect(() => {
        dispatch(fetchMainCategories());
    }, [dispatch]);

    useEffect(() => {
        if (selectedMainCat) {
            dispatch(fetchCategoriesByParent(selectedMainCat._id));
            setSelectedCat('');
        }
    }, [dispatch, selectedMainCat]);

    useEffect(() => {
        if (selectedCat) {
            dispatch(fetchSubcategories({
                parentCategory: selectedMainCat._id,
                Category: selectedCat._id
            }));
        }
    }, [dispatch, selectedMainCat, selectedCat]);

    const handleMainCategoryChange = (e) => {
        const mainCatId = e.target.value;
        if (mainCatId) {
            const mainCat = mainCategories.find(cat => cat._id === mainCatId);
            setSelectedMainCat(mainCat);
            dispatch(selectMainCategory(mainCat._id));
            onMainCategoryChange(mainCat._id); // Call the callback function with name
        } else {
            setSelectedMainCat('');
            setSelectedCat('');
            dispatch(selectMainCategory(null));
            onMainCategoryChange(''); // Reset callback function
        }
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        if (catId) {
            const cat = categories.find(cat => cat._id === catId);
            setSelectedCat(cat);
            dispatch(selectCategory(cat._id));
            onCategoryChange(cat._id); // Call the callback function with name
        } else {
            setSelectedCat('');
            dispatch(selectCategory(null));
            onCategoryChange(''); // Reset callback function
        }
    };

    const handleSubcategoryChange = (e) => {
        const subCatId = e.target.value;
        if (subCatId) {
            const subCat = subcategories.find(subCat => subCat._id === subCatId);
            dispatch(selectsubCategory(subCat._id));
            onSubcategoryChange(subCat.name); // Call the callback function with name
        } else {
            dispatch(selectsubCategory(null));
            onSubcategoryChange(''); // Reset callback function
        }
    };

    return (
        <Container>
            {/* <ToastContainer /> */}
            <DropdownsRow>
                <DropdownContainer>
                    <Select id="mainCategory" value={selectedMainCat._id || ''} onChange={handleMainCategoryChange}>
                        <option value="">Category1</option>
                        {mainCategories.map(mainCat => (
                            <option key={mainCat._id} value={mainCat._id}>{mainCat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer>
                <DropdownContainer>
                    <Select id="category" value={selectedCat._id || ''} onChange={handleCategoryChange} disabled={!selectedMainCat}>
                        <option value="">Category1</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer>
                {/* <DropdownContainer>
                    <Select id="subcategory" onChange={handleSubcategoryChange} disabled={!selectedCat}>
                        <option value="">Select Subcategory</option>
                        {subcategories.map(subCat => (
                            <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer> */}
            </DropdownsRow>
        </Container>
    );
};

export default CategoryDropdowns;
