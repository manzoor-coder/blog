import React, { useEffect, useRef, useState } from 'react';
import { getDocs, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../Authentication/firebase_config';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Button, Tooltip } from '@mui/material';
import ViewModal from './AdminModals/ViewModal';
import DeleteModal from './AdminModals/DeleteModal';


const Users = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);



  const fetchAllUsers = async () => {
    const usersRef = collection(db, "users");

    // Sort by `createdAt` in descending order
    const q = query(usersRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return users;
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const loadUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    loadUsers();
  }, []);




  return (
    <div className="w-full mx-auto p-6 bg-gray-200 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registered Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y bg-white divide-gray-200 text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-xl text-[16px] ">Name</th>
              <th className="px-6 py-3 text-left font-xl text-[16px] ">Email</th>
              <th className="px-6 py-3 text-left font-xl text-[16px] ">Role</th>
              <th className="px-6 py-3 text-left font-xl text-[16px] ">Joined</th>
              <th className="px-6 py-3 text-left font-xl text-[16px] ">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  {user.createdAt?.seconds
                    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB')
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Tooltip title="View User Details" arrow placement="top">
                    <button className="text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsOpen(true);
                      }}
                    ><RemoveRedEyeIcon sx={{
                      fontSize: 20,
                      color: 'green',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'darkgreen', // or any color you like
                        transform: 'scale(1.2)', // optional animation effect
                      },
                      transition: 'all 0.2s ease-in-out', // smooth transition
                    }}
                      /></button>
                  </Tooltip>
                  <Tooltip title="Delete User" arrow placement="top">
                    <button className="text-red-600 hover:underline"
                      onClick={() => {
                        setUserToDelete(user);
                        setDeleteDialogOpen(true);
                      }}
                    > <DeleteIcon sx={{
                      color: 'red', cursor: 'pointer',
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Next
          </button>
        </div>


        <ViewModal open={isOpen} onOpenChange={setIsOpen} user={selectedUser} />
        <DeleteModal
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
          userToDelete={userToDelete}
          setUsers={setUsers}
        />

      </div>
    </div>
  );
};

export default Users;
