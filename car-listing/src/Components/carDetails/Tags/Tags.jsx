import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeatureTags,
  createFeatureTag,
  updateFeatureTag,
  deleteFeatureTag
} from '../../../Redux/Slicer/Vendor/CarDetails/FeatureTag/FeatureTag';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Tags = () => {
  const dispatch = useDispatch();
  const featureTags = useSelector((state) => state.featureTag.featureTags);
  const status = useSelector((state) => state.featureTag.status);
  const error = useSelector((state) => state.featureTag.error);
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newLocation, setNewLocation] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFeatureTags());
    }
  }, [status, dispatch]);

  const handleDelete = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteFeatureTag(selectedItem._id)).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting feature tag', error);
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setNewFeatureName('');
    setNewLocation('');
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setNewFeatureName(item.featureName);
    setNewLocation(item.location);
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleStatusToggle = async (item) => {
    try {
      const updatedStatus = item.status === 'active' ? 'inactive' : 'active';
      await dispatch(updateFeatureTag({
        id: item._id,
        updatedFeatureTag: { ...item, status: updatedStatus },
      })).unwrap();
      dispatch(fetchFeatureTags());
    } catch (error) {
      console.error('Error updating feature tag status', error);
    }
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        const targetItem = featureTags.find(tag => tag.location === parseInt(newLocation, 10));

        if (targetItem && targetItem._id !== selectedItem._id) {
          await dispatch(updateFeatureTag({
            id: targetItem._id,
            updatedFeatureTag: { ...targetItem, location: selectedItem.location }
          })).unwrap();
        }

        await dispatch(updateFeatureTag({
          id: selectedItem._id,
          updatedFeatureTag: { featureName: newFeatureName, location: newLocation }
        })).unwrap();
      } else {
        await dispatch(createFeatureTag({ featureName: newFeatureName })).unwrap();
      }
      setOpenModal(false);
      setNewFeatureName('');
      dispatch(fetchFeatureTags());
      setNewLocation('');
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving feature tag', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewFeatureName('');
    setNewLocation('');
    setSelectedItem(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pt-[90px]"
    >
      <AnimatePresence>
        {featureTags.map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className="mb-2.5 flex items-center w-[550px] group hover:shadow-lg transition-shadow duration-300 p-2"
          >
            <input
              value={item.featureName}
              readOnly
              className="flex-1 mr-2.5 max-w-[271px] text-base font-medium h-[45px] p-2 border border-gray-300 bg-white cursor-pointer transition-all duration-300 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            <input
              value={item.location}
              readOnly
              className="flex-1 max-w-[45px] h-[45px] text-center border border-gray-300 bg-white text-base font-medium mr-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex items-center gap-2.5 mr-2.5">
              <label className="relative inline-block w-10 h-5">
                <input
                  type="checkbox"
                  checked={item.status === 'active'}
                  onChange={() => handleStatusToggle(item)}
                  className="opacity-0 w-0 h-0"
                />
                <span className={`absolute cursor-pointer inset-0 rounded-full ${item.status === 'active' ? 'bg-orange-500' : 'bg-gray-300'} transition-all duration-300 before:absolute before:content-[''] before:h-3.5 before:w-3.5 before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-300 before:rounded-full ${item.status === 'active' ? 'before:translate-x-5' : ''}`}></span>
              </label>
              <motion.span 
                animate={{ color: item.status === 'active' ? '#16a34a' : '#dc2626' }}
                className="text-sm font-bold capitalize"
              >
                {item.status}
              </motion.span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleEdit(item)}
              className="h-[45px] w-[45px] flex items-center justify-center mr-0.5 bg-transparent border border-gray-300 cursor-pointer text-[#0F224C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <FaEdit className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(item)}
              className="h-[45px] w-[45px] flex items-center justify-center mr-0.5 bg-transparent border border-gray-300 cursor-pointer text-[#D31818] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <FaTrashAlt className="h-5 w-5" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddNew}
        className="bg-orange-500 text-white px-4 py-2 ml-2 border-0 w-[270px] h-[45px] text-base font-medium cursor-pointer shadow-md hover:shadow-lg transition-all duration-300"
      >
        Add New
      </motion.button>

      <AnimatePresence>
        {openDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white pt-[30px] shadow-xl z-[1000] w-[600px] h-[300px]"
          >
            <h2 className="m-0 mb-5 text-center text-2xl font-bold">Confirm Delete</h2>
            <div className="mb-5 text-center pt-2.5">
              Are you sure you want to delete "{selectedItem?.featureName}"?
            </div>
            <div className="flex justify-center gap-2.5 pb-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseDialog}
                className="bg-white text-[#0F224C] border border-black w-[120px] font-semibold text-[15px] h-[45px] cursor-pointer hover:bg-gray-100 transition-colors duration-300"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmDelete}
                className="bg-[#D31818] text-[#F6F4F4] border-0 w-[120px] h-[45px] font-semibold text-[15px] cursor-pointer hover:bg-red-700 transition-colors duration-300"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white pt-[30px] shadow-xl z-[1000] w-[600px] h-[300px]"
          >
            <h2 className="m-0 mb-5 text-center text-2xl font-bold">{isEditing ? 'Update Tag' : 'Create Tag'}</h2>
            <div className="mb-5 text-center pt-2.5">
              <div className="mb-5 text-center pb-5 text-gray-600">
                {isEditing ? 'Update Tag Details' : 'Enter New Tag Details'}
              </div>
              <motion.input
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                placeholder="Feature Name"
                className="flex-1 mr-2.5 w-[374px] h-[45px] p-2 mb-2.5 border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
              {isEditing && (
                <motion.input
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Location"
                  type="number"
                  className="flex-1 mr-2.5 w-[374px] h-[45px] p-2 mb-2.5 border border-gray-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              )}
            </div>
            <div className="flex justify-center gap-2.5 pb-5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseModal}
                className="bg-white text-[#0F224C] border border-black w-[120px] font-semibold text-[15px] h-[45px] cursor-pointer hover:bg-gray-100 transition-colors duration-300"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-orange-500 text-white border-0 w-[120px] h-[45px] font-semibold text-[15px] cursor-pointer hover:bg-orange-600 transition-colors duration-300"
              >
                {isEditing ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tags;
