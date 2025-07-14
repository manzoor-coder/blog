import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../components/ui/dialog"; // adjust if needed
import { Button } from '@mui/material';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Authentication/firebase_config';
import { Warning } from '@mui/icons-material';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteComment = ({ deleteDialogOpen, setDeleteDialogOpen, commentToDelete }) => {
    const { fetchComments } = useOutletContext();

   const handleDelete = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      fetchComments(); 
      toast.success("Comment is deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    } finally {
      setDeleteDialogOpen(false);
    }
  };


    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle><Warning className='text-red-500'/> Confirm Delete</DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete this comment?
                        

                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-3 mt-4">
                    <Button
                        variant="outlined"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                       onClick={() => handleDelete(commentToDelete)}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteComment;
