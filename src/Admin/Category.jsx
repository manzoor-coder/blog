import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import DeleteCategory from './AdminModals/DeleteCategory';

const Category = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const {
    categories,
    setCategories,
    handleAddCategory,
    handleDeleteCategory,
    categoryName,
    setCategoryName,
    editMode,
    handleEditCategory,
    handleUpdateCategory,
  } = useOutletContext();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      handleUpdateCategory();
    } else {
      handleAddCategory(categoryName);
      setCategoryName('');
    }
  };



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {editMode ? 'Update Category' : 'Add New Category'}
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {editMode ? (
            <Tooltip title="Update Category" arrow placement='top'>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition"
              >
                Update
              </button>
            </Tooltip>
          ) : (
            <Tooltip title="Add Category" arrow placement='top'>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-sm hover:bg-blue-700 transition"
              >
                Add
              </button>
            </Tooltip>
          )}




        </form>
      </div>

      {categories.length > 0 && (
        <div className="mt-10 w-full  mx-auto">
          <h3 className="text-xl font-semibold text-gray-500 mb-4">Category List</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-blue-600 text-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Category Name</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50 ">
                    <td className="px-4 py-2 ">{index + 1}</td>
                    <td className="px-4 py-2 font-semibold text-gray-600">{cat.name}</td>
                    <td className="px-4 py-2">
                      {/* <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button> */}

                      <Tooltip title="Edit Category" arrow placement="top">
                        <button className="text-blue-600 hover:underline mr-4"
                          onClick={() => handleEditCategory(cat.id, cat.name)}
                        ><EditSquareIcon sx={{ color: '#0EA5E9', cursor: 'pointer',
                        '&:hover': {
                            color: '#0277bd', // or any color you like
                            transform: 'scale(1.2)', // optional animation effect
                          },
                          transition: 'all 0.2s ease-in-out',
                         }} /></button>
                      </Tooltip>

                      <Tooltip title="Delete Category" arrow placement="top">
                        <button className="text-blue-600 hover:underline"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setDeleteDialogOpen(true);
                          }}
                        ><DeleteIcon sx={{ color: 'red', cursor: 'pointer',
                        '&:hover': {
                            color: 'lightred', // or any color you like
                            transform: 'scale(1.2)', // optional animation effect
                          },
                          transition: 'all 0.2s ease-in-out',
                         }} /></button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DeleteCategory
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cat={selectedCategory}
        setCategories={setCategories}
      />
    </div>
  );
};

export default Category;
