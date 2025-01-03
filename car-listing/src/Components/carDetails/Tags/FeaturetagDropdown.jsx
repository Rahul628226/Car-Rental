import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeatureTags,
  updateFeatureTag,
  deleteFeatureTag,
} from '../../../Redux/Slicer/Vendor/CarDetails/FeatureTag/FeatureTag';
import { FaTrash } from 'react-icons/fa';

const FeaturetagDropdown = ({ productId }) => {
  const dispatch = useDispatch();
  const featureTags = useSelector((state) => state.featureTag.featureTags);
  const status = useSelector((state) => state.featureTag.status);
  const [selectedFeatureTagId, setSelectedFeatureTagId] = useState('');
  const [relatedFeatureTags, setRelatedFeatureTags] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchFeatureTags())
        .unwrap()
        .catch((error) => console.error('Failed to fetch feature tags:', error));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (productId) {
      const filteredTags = featureTags.filter((tag) =>
        tag.products.some((product) => product._id === productId)
      );
      setRelatedFeatureTags(filteredTags);
    } else {
      setRelatedFeatureTags([]);
    }
  }, [productId, featureTags]);

  const handleUpdate = async () => {
    if (!selectedFeatureTagId || !productId) {
      alert('Please select a feature tag and enter a product ID');
      return;
    }

    try {
      const selectedFeatureTag = featureTags.find((tag) => tag._id === selectedFeatureTagId);
      if (!selectedFeatureTag) return;

      const updatedProducts = [...selectedFeatureTag.products, { _id: productId }];
      await dispatch(
        updateFeatureTag({
          id: selectedFeatureTagId,
          updatedFeatureTag: { ...selectedFeatureTag, products: updatedProducts },
        })
      ).unwrap();

      alert('Product ID added successfully');
      dispatch(fetchFeatureTags());
    } catch (error) {
      console.error('Error updating feature tag:', error);
    }
  };

  const handleDeleteProduct = async (tagId, productId) => {
    try {
      await dispatch(deleteFeatureTag({ tagId, productId })).unwrap();
      dispatch(fetchFeatureTags());
    } catch (error) {
      console.error('Error deleting product from feature tag:', error);
    }
  };

  return (
    <div className="pt-5 flex flex-col items-center sm:items-start">
      <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-5 w-full sm:w-auto">
        <label htmlFor="feature-tag-select" className="mr-2.5">
          Featured Categories:
        </label>
        <select
          id="feature-tag-select"
          value={selectedFeatureTagId}
          onChange={(e) => setSelectedFeatureTagId(e.target.value)}
          className="p-2 w-full sm:w-[200px] h-[45px] border border-black bg-white rounded-md text-black"
        >
          <option value="" disabled>
            Select Feature Tag
          </option>
          {featureTags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.featureName}
            </option>
          ))}
        </select>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-orange-600 text-white rounded-md border-none cursor-pointer w-full sm:w-[120px] h-[45px]"
        >
          Update
        </button>
      </div>
      <div className="w-full max-w-[520px]">
        {relatedFeatureTags.map((tag) => (
          <div
            key={tag._id}
            className="flex items-center justify-between bg-white shadow-md p-4 mb-2 rounded-lg text-black"
          >
            <p className="m-0 flex-grow">{tag.featureName}</p>
            <FaTrash
              onClick={() => handleDeleteProduct(tag._id, productId)}
              className="text-[#D31818] cursor-pointer text-xl ml-2.5 hover:opacity-80 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturetagDropdown;
