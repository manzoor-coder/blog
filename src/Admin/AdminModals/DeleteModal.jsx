import React from 'react'
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
import { toast } from 'react-toastify';

const DeleteModal = ({ deleteDialogOpen, setDeleteDialogOpen, userToDelete, setUsers }) => {
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));   
      setDeleteDialogOpen(false);
      toast.success("User is deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><Warning className='text-red-500'/> Confirm Delete</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
            This action cannot be undone.
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
            onClick={handleDelete}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
