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
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeleteCategory = ({ open, onOpenChange, cat, setCategories }) => {

  const {fetchCategories} = useOutletContext();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "categories", cat.id));
      if (setCategories) {
        setCategories(prev => prev.filter(c => c.id !== cat.id));
      }
      onOpenChange(false);
      fetchCategories();
      toast.success("Category is deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><Warning className='text-red-500'/> Confirm Delete</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete category <strong>{cat?.name}</strong>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outlined"
            onClick={() => onOpenChange(false)}
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

export default DeleteCategory;
