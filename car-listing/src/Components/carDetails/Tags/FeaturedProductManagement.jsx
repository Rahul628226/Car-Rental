import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturetagDropdown from './FeaturetagDropdown';
import { Spin, List, Select, Input, Empty, Button } from 'antd';
import { getProducts } from '../../../Store/Slicer/Dashboard/Product/GetProducts';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers } from '../../../Store/Slicer/Dashboard/AccessRight/AccessList';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchFeatureTags } from '../../../Store/Slicer/Dashboard/FeatureTag/FeatureTag';

const { Option } = Select;
const { Search } = Input;

const FeaturedProductManagement = () => {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { products, loading } = useSelector((state) => state.getProducts);
  const featureTags = useSelector((state) => state.featureTag.featureTags);
  const dispatch = useDispatch();
  const { usersLoading, users } = useSelector((state) => state.accessList);
  const [selectedVendorIds, setSelectedVendorIds] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedFeatureTag, setSelectedFeatureTag] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(fetchFeatureTags())
  }, [dispatch]);

  // Get store names with all associated userIds
  const storeOptions = users?.reduce((stores, user) => {
    if (user.store?.storeName) {
      const existingStore = stores.find(store => store.storeName === user.store.storeName);
      if (existingStore) {
        existingStore.userIds.push(user.userId);
      } else {
        stores.push({
          storeName: user.store.storeName,
          userIds: [user.userId]
        });
      }
    }
    return stores;
  }, []);

  const handleStoreChange = (value) => {
    const selectedStoreData = storeOptions.find(store => store.storeName === value);
    if (selectedStoreData) {
      setSelectedStore(value);
      setSelectedVendorIds(selectedStoreData.userIds);
      selectedStoreData.userIds.forEach(vendorId => {
        dispatch(getProducts({ vendor_id: vendorId }));
      });
    }
  };

  const handleRefresh = () => {
    setSearchText('');
    setSortBy('name');
    setSelectedFeatureTag(null);
    if (selectedStore) {
      const selectedStoreData = storeOptions.find(store => store.storeName === selectedStore);
      selectedStoreData.userIds.forEach(vendorId => {
        dispatch(getProducts({ vendor_id: vendorId }));
      });
    }
  };

  // Filter and sort products
  const filteredProducts = products
    ?.filter(product => {
      const matchesVendorAndSearch = selectedVendorIds.includes(product.vendor_id) &&
        (product.name.toLowerCase().includes(searchText.toLowerCase()) ||
         product.sku.toLowerCase().includes(searchText.toLowerCase()));

      if (selectedFeatureTag) {
        const featureTag = featureTags.find(tag => tag._id === selectedFeatureTag);
        return matchesVendorAndSearch && featureTag?.products.some(p => p._id === product._id);
      }
      
      return matchesVendorAndSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sku':
          return a.sku.localeCompare(b.sku);
        case 'stock':
          return b.available_stock - a.available_stock;
        default:
          return 0;
      }
    });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-50 rounded-lg shadow-sm"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Featured Product Management
      </motion.h2>

      <div className="mb-8 p-6 bg-white rounded-lg ">
        <div className="flex items-center gap-4">
          <Select
            placeholder="Select a store"
            onChange={handleStoreChange}
            value={selectedStore}
            style={{ width: '25%', height: '45px' }}
            className="border border-black"
            bordered={false}
          >
            {storeOptions?.map((store, index) => (
              <Option key={index} value={store.storeName}>
                {store.storeName}
              </Option>
            ))}
          </Select>

          <Search
            placeholder="Search by product name or SKU"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            style={{ width: '25%', height: '45px' }}
            className="border border-black"
            bordered={false}
          />

          <Select
            placeholder="Filter by Feature Tag"
            allowClear
            onChange={(value) => setSelectedFeatureTag(value)}
            value={selectedFeatureTag}
            style={{ width: '20%', height: '45px' }}
            className="border border-black"
            bordered={false}
          >
            {featureTags?.map((tag) => (
              <Option key={tag._id} value={tag._id}>
                {tag.featureName}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Sort by"
            onChange={(value) => setSortBy(value)}
            value={sortBy}
            style={{ width: '20%', height: '45px' }}
            defaultValue="name"
            className="border border-black"
            bordered={false}
          >
            <Option value="name">Name</Option>
            <Option value="sku">SKU</Option>
          </Select>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className="flex items-center justify-center h-[45px] bg-orange-600 text-white hover:bg-orange-700"
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm "
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Products</h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin size="large" />
            </div>
          ) : !selectedStore ? (
            <Empty description="Please select a store to view products" />
          ) : (
            <AnimatePresence>
              <List
                className="max-h-[600px] overflow-y-auto custom-scrollbar"
                dataSource={filteredProducts}
                pagination={{
                  pageSize: 5,
                  size: 'small',
                  className: 'mt-4'
                }}
                renderItem={(product) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <List.Item
                      className={`cursor-pointer p-4 hover:bg-orange-50 rounded-md transition-all duration-300  mb-2 ${
                        selectedProductId === product._id ? 'bg-orange-100 border-orange-200' : ''
                      }`}
                      onClick={() => setSelectedProductId(product._id)}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.images?.[0] || 'https://cdn3d.iconscout.com/3d/premium/thumb/product-3d-icon-download-in-png-blend-fbx-gltf-file-formats--tag-packages-box-marketing-advertisement-pack-branding-icons-4863042.png?f=webp'} 
                          alt="image"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="text-sm text-gray-600">
                            <p>SKU: {product.sku}</p>
                            <p>Brand: {product.brand || 'N/A'}</p>
                            <p>Stock: {product.available_stock}</p>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  </motion.div>
                )}
              />
            </AnimatePresence>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm "
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Feature Tag Management</h3>
          
          <AnimatePresence>
            {selectedProductId ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FeaturetagDropdown productId={selectedProductId} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-8"
              >
                Select a product from the list to manage feature tags
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturedProductManagement;
