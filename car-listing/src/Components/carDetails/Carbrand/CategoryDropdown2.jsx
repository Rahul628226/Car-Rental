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
  width: 100%; /* Adjust width as needed */
  padding-top: 30px;
`;

const DropdownsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
`;

const DropdownContainer = styled.div`
  flex: 1;
  display: flex;
  width: 100%; /* Adjust width to distribute evenly */
`;

const Label = styled.label`
  display: flex;
 padding-top:10px;
  font-weight: 500;
  width:55%;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid black;
  font-size: 16px;
  width: 100%; 
  height:40px;
  background-color: white;
   
`;

const UpdateButton = styled.button`
  padding: 10px 20px;
  background-color: #D31818;
  color: white;
  height:40px;
  border: none;
 
 
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const CategoryDropdowns2 = ({ onMainCategoryChange, onCategoryChange, onSubcategoryChange }) => {
    const dispatch = useDispatch();
    const {
        mainCategories,
        categories,
        subcategories,
    } = useSelector(state => state.categories);

    const [selectedMainCat, setSelectedMainCat] = useState('');
    const [selectedCat, setSelectedCat] = useState('');
    const [selectedSubCat, setSelectedSubCat] = useState('');

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
            dispatch(
                fetchSubcategories({
                    parentCategory: selectedMainCat._id,
                    Category: selectedCat._id
                })
            );
        }
    }, [dispatch, selectedMainCat, selectedCat]);

    const handleMainCategoryChange = (e) => {
        const mainCat = mainCategories.find(cat => cat?._id === e.target.value);
        if (mainCat) {
            setSelectedMainCat(mainCat);

            dispatch(selectMainCategory(mainCat._id));

        }
    };

    const handleCategoryChange = (e) => {
        const cate = categories.find(cat => cat?._id === e.target.value);
        if (cate) {
            setSelectedCat(cate);
            dispatch(selectCategory(cate._id));

        }
    };

    const handleSubcategoryChange = (e) => {
        const subCat = subcategories.find(subCat => subCat?._id === e.target.value);
        if (subCat) {
            setSelectedSubCat(subCat);
            dispatch(selectsubCategory(subCat._id));

        }
    };

    const updateCategory = () => {
        if (selectedCat) {
            onCategoryChange(selectedCat.name);
        }
        if (selectedMainCat) {
            onMainCategoryChange(selectedMainCat.name);
        }
        if (selectedSubCat) {
            onSubcategoryChange(selectedSubCat.name);
        }
        setSelectedMainCat('');
        setSelectedCat('');

        setSelectedSubCat('');
    };

    return (
        <Container>
          
            <DropdownsRow>
                <DropdownContainer>
                    <Label>Category 1:</Label>
                    <Select id="mainCategory" value={selectedMainCat._id || ''} onChange={handleMainCategoryChange}>
                        <option value="">Select Main Category</option>
                        {mainCategories.map(mainCat => (
                            <option key={mainCat._id} value={mainCat._id}>{mainCat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer>
                <DropdownContainer>
                    <Label>Category 2:</Label>
                    <Select id="category" value={selectedCat._id || ''} onChange={handleCategoryChange} disabled={!selectedMainCat}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer>
                <DropdownContainer>
                    <Label>Category 3:</Label>
                    <Select id="subcategory" value={selectedSubCat._id || ''} onChange={handleSubcategoryChange} disabled={!selectedCat}>
                        <option value="">Select Subcategory</option>
                        {subcategories.map(subCat => (
                            <option key={subCat._id} value={subCat._id}>{subCat.name}</option>
                        ))}
                    </Select>
                </DropdownContainer>
                <DropdownContainer>

                    <UpdateButton onClick={updateCategory}>Select</UpdateButton>

                </DropdownContainer>
            </DropdownsRow>
        </Container>
    );
};

export default CategoryDropdowns2;
