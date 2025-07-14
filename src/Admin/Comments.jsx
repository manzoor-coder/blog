import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import { Tooltip } from '@mui/material';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../Authentication/firebase_config';
import DeleteComment from './AdminModals/DeleteComment';
import { toast } from 'react-toastify';

const Comments = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  // const [comments, setComments] = useState();
  const { comments = [], fetchComments } = useOutletContext();
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;

const totalPages = Math.ceil(comments.length / commentsPerPage);
const indexOfLastComment = currentPage * commentsPerPage;
const indexOfFirstComment = indexOfLastComment - commentsPerPage;
const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);


  const handleApprove = async (id) => {
    try {
      const commentRef = doc(db, "comments", id);
      await updateDoc(commentRef, {
        isapproved: true

      });

      toast.success("Comment approved successfully!");

      // fetchComments(); 
      fetchComments();
    } catch (error) {
      console.error("Error approving comment:", error);
      alert("Failed to approve comment");
    }
  };



  return (
    <div className="w-full bg-gray-200 shadow-md mx-auto p-6 rounded-md">
      <h3 className="text-2xl font-semibold mb-6">Comments </h3>

      {/* Comments List */}
      <div className="space-y-6 mb-10">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-blue-600 text-[16px] text-left text-white font-semibold">
              <th className="py-4 px-4 border-b">Name</th>
              <th className="py-4 px-4 border-b">Email</th>
              <th className="py-4 px-4 border-b">Comment</th>
              <th className="py-4 px-4 border-b">Date</th>
              <th className="py-4 px-4 border-b">Approve</th>
              <th className="py-4 px-4 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentComments?.map((c, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{c.name}</td>
                <td className="py-2 px-4 border-b">{c.email}</td>
                <td className="py-2 px-4 border-b">{c.comment}</td>
                <td className="py-2 px-4 border-b">
                  {c.createdAt
                    ? new Date(c.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    : "Unknown"}
                </td>
                <td className={`py-2 px-4 border-b ${c.isapproved ? "text-green-500" : "text-red-500"}`}>{c.isapproved ? 'Approved' : 'Pending'}</td>
                <td className="py-2 px-4 border-b text-center space-x-2">
                  <Tooltip title="Approve Comment" arrow placement='top'>
                    <BeenhereIcon
                      sx={{ color: 'green', cursor: 'pointer',
                      '&:hover': {
                            color: 'darkgreen', // or any color you like
                            transform: 'scale(1.2)', // optional animation effect
                          },
                          transition: 'all 0.2s ease-in-out',
                       }}
                      onClick={() => handleApprove(c.id)} />
                  </Tooltip>

                  <Tooltip title="Delete Comment" arrow placement='top'>
                    <DeleteIcon
                      sx={{ color: 'red', cursor: 'pointer',
                      '&:hover': {
                            color: 'lightred', // or any color you like
                            transform: 'scale(1.2)', // optional animation effect
                          },
                          transition: 'all 0.2s ease-in-out',
                       }}
                      onClick={() => {
                        setCommentToDelete(c.id);
                        setDeleteDialogOpen(true);
                      }} />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-400"
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>

      </div>

      <DeleteComment
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        commentToDelete={commentToDelete}
      />
    </div>
  );
};

export default Comments;
