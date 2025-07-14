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


const PostDeleteModal = ({ open, onOpenChange, post, setPosts, setFilteredPosts }) => {

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "posts", post.id)); // 🔁 corrected collection to "posts"
            // Update UI
            setPosts(prev => prev.filter(p => p.id !== post.id));
            setFilteredPosts(prev => prev.filter(p => p.id !== post.id));
            toast.success("Post is deleted successfully!");
            onOpenChange(false);

        } catch (error) {
            console.error("Error deleting post:", error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Warning className="mr-2 text-red-500" /> Confirm Delete
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete <strong>{post?.title}</strong> post? This action cannot be undone.
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

export default PostDeleteModal
