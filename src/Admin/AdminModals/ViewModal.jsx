import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog"; // Replace this path with the actual one if different
import PersonIcon from '@mui/icons-material/Person';
import { Email } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';


const ViewModal = ({ open, onOpenChange, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[250px] h-[300px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">



          {/* Right Side: Image and Info */}
          <div className="w-full bg-white flex flex-col justify-center items-center p-4 text-center">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden border border-gray-300 shadow">
              <img
                src={user.imageUrl || "https://via.placeholder.com/150"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-[#9d1b53] font-bold text-lg mt-3">{user.name || 'Your Name'}</h2>
            <p className="text-sm text-gray-500">{user.role || 'Job Position'}</p>
          </div>

          {/* Left Side: Contact Info */}
          <div className="w-full h-[100%] bg-[#9d1b53] text-white flex flex-col justify-center items-start px-5 space-y-4 text-sm">
            <div className="flex items-center space-x-2">

              <PersonIcon />
              <span>{user.name}</span>
            </div>


            <div className="flex items-center space-x-2">
              <Email />
              <span>{user.email || 'lorem@ipsum.com'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LoginIcon />
              <span>{user.createdAt?.seconds
                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB')
                : 'N/A'}</span>
            </div>


          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
};


export default ViewModal;
