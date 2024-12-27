import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import editIcon from '../../../assets/editIcon.svg';
import deleteicon from '../../../assets/deleteicon.svg';

import { FaEdit, FaTrash } from 'react-icons/fa';
import {
    fetchMainCategories,
    fetchCategoriesByParent,
    fetchSubcategories,
    addMainCategory,
    addCategory,
  
    updateMainCategory,
    updateCategory,
    
    deleteMainCategory,
    deleteCategory,
 
    selectMainCategory,
    selectCategory,

} from '../../../Redux/Slicer/Admin/CarBrand/Categoryslicer'
import AddDialog from './AddDialog';

const Container = styled.div`
  justify-content: space-between;
  padding-top: 70px;

  @media (min-width: 900px) {
    display: flex;
  }
`;


const Column = styled.div`
  

  padding: 10px;
  
`;

const Icon = styled.div`
  margin-left: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;


const Title = styled.p`
  color: ${({ theme }) => theme.text};
  min-width: 120px;
  font-weight: 600;
  font-size: 18px;
`;

const Row = styled.div`
  width: 70%;

  padding: 10px;
 
   display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Row1 = styled.div`
  width: 60%;
   gap:10%;
   padding: 10px;
 
   display: flex;
  justify-content: center;
  align-items: center;
`;


const ItemBox = styled.div`
  background: ${props => (props.selected ? 'red' : 'white')};
  padding: 10px;
  margin: 5px 0;
  width:300px;
  color:${props => (props.selected ? 'white' : '#000000')};
  font-size:16px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid black;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PlusIcon = styled.div`
  background: #0F224C;
  color: white;
  min-width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 35px;
  margin-top:10px;
`;


const CategoryManager = () => {
    const dispatch = useDispatch();
    const {
        mainCategories,
        categories,
        subcategories,
        selectedMainCategory,
        selectedCategory,
    } = useSelector(state => state.categories);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const [currentItem, setCurrentItem] = useState(null); // State to store the current item being edited

    useEffect(() => {
        dispatch(fetchMainCategories());
    }, [dispatch]);

    useEffect(() => {
        if (selectedMainCategory) {
            dispatch(fetchCategoriesByParent(selectedMainCategory));
        }
    }, [dispatch, selectedMainCategory]);

    useEffect(() => {
        if (selectedCategory) {
            dispatch(
                fetchSubcategories({
                    parentCategory: selectedMainCategory,
                    Category: selectedCategory
                })
            );
        }
    }, [dispatch, selectedMainCategory, selectedCategory]);

    const handleAddMainCategory = () => {
        setDialogType('Car Brand Name');
        setCurrentItem(null);
        setOpenDialog(true);
    };

    const handleAddCategory = () => {
        setDialogType('Car Model Name');
        setCurrentItem(null);
        setOpenDialog(true);
    };


    const handleEditItem = (type, item) => {
        setDialogType(type);
        setCurrentItem(item);
        setOpenDialog(true);
    };

    const handleSelectMainCategory = id => {
        dispatch(selectMainCategory(id));
    };

    const handleSelectparentCategory = id => {
        dispatch(selectMainCategory(id));
    };

    const handleSelectCategory = id => {
        dispatch(selectCategory(id));
    };


    const handleDeleteItem = (type, id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            if (type === 'Car Brand Name') {
                dispatch(deleteMainCategory(id));
            } else if (type === 'Car Model Name') {
                dispatch(deleteCategory(id));
            } 
           
        }
    };

    const handleDialogSubmit = async (name) => {
        setOpenDialog(false);
        if (dialogType === 'Car Brand Name') {
            if (currentItem) {
                await dispatch(updateMainCategory({ ...currentItem, name, id: selectedMainCategory })); // Update main category
            } else {
                await dispatch(addMainCategory(name));
            }
            dispatch(fetchMainCategories()); // Fetch updated main categories after adding
        } else if (dialogType === 'Car Model Name') {
            if (currentItem) {
                await dispatch(updateCategory({ ...currentItem, name, id: selectedCategory })); // Update category
            } else {
                await dispatch(addCategory({ name, parentCategory: selectedMainCategory }));
            }
            dispatch(fetchCategoriesByParent(selectedMainCategory)); // Fetch updated categories after adding
        }
    };

    return (
        <Container>
         
            <Column>
                <Row1>
                    <Title>Car Brand</Title>
                    <PlusIcon onClick={handleAddMainCategory}>+</PlusIcon>
                </Row1>
                {mainCategories.map(mainCat => (

                    <Row>
                        <ItemBox
                            key={mainCat._id} // Unique key for main categories
                            selected={mainCat._id === selectedMainCategory}
                            onClick={() => {
                                handleSelectMainCategory(mainCat._id)
                                handleSelectCategory(null); // Clear selected category when switching main category
                            }}
                        >
                            {mainCat.name}

                        </ItemBox>
                        <IconContainer onClick={() => handleSelectMainCategory(mainCat._id)}>
                            <Icon onClick={() => handleEditItem('Car Brand Name', mainCat)} ><FaEdit /></Icon>
                            <Icon onClick={() => handleDeleteItem('Car Brand Name', mainCat._id, mainCat.name)} > <FaTrash /></Icon>
                        </IconContainer>


                    </Row>
                ))}
            </Column>
            <Column>
                {selectedMainCategory && (
                    <>
                     <Row1>
                     <Title>Brand Model</Title>
                     <PlusIcon onClick={handleAddCategory}>+</PlusIcon>
                     </Row1>
                        
                        {categories.map(cat => (
                            <Row>
                                <ItemBox
                                    key={cat._id} // Unique key for categories
                                    selected={cat._id === selectedCategory}
                                    onClick={() =>{handleSelectCategory(cat._id)
                                      
                                    }}

                                >
                                    {cat.name}
                                </ItemBox>
                                <IconContainer onClick={() => handleSelectCategory(cat._id)}>
                                    <Icon onClick={() => handleEditItem('Car Model Name', cat)} ><FaEdit /></Icon>
                                    <Icon onClick={() => handleDeleteItem('Car Model Name', cat._id, cat.name)} ><FaTrash /></Icon>
                                </IconContainer>
                            </Row>
                        ))}
                    </>
                )}
            </Column>

            {openDialog && (
                <AddDialog
                    type={dialogType}
                    currentItem={currentItem} // Pass current item to dialog
                    onClose={() => setOpenDialog(false)}
                    onSubmit={handleDialogSubmit}
                />
            )}
        </Container>
    );
};

export default CategoryManager;
