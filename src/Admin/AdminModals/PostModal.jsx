import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";

const PostModal = ({ open, onOpenChange, post }) => {
    if (!post) return null;

    const stripHtml = (html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
                {/* Title */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                        {post.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mb-4">
                        By {post.author || "Unknown Author"} &middot;{" "}
                        {post.createdAt?.toDate?.().toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        }) || "Unknown Date"}
                    </DialogDescription>
                </DialogHeader>

                {/* Image */}
                {post.featuredImage && (
                    <div className="mb-4">
                        <img
                            src={post.featuredImage}
                            alt="Post"
                            className="w-full h-64 object-cover rounded"
                        />
                    </div>
                )}

                {/* Post Content */}
                <p className="line-clamp-12 text-gray-600 my-4">
                    {stripHtml(post.content)}
                </p>

            </DialogContent>
        </Dialog>
    );
};

export default PostModal;
