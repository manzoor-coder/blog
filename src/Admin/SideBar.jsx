import { CategoryOutlined, Dashboard, Edit, Message, PostAdd, Settings } from '@mui/icons-material';
import Person2Icon from '@mui/icons-material/Person2';
import { Icon } from 'lucide-react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import EditDocumentIcon from '@mui/icons-material/EditDocument';

const SideBar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const links = [
        { name: 'Dashboard', path: '/admin', Icon: <Dashboard /> },
        { name: 'New Post', path: '/admin/new-post', Icon: <PostAdd /> },
        { name: 'Posts', path: '/admin/posts', Icon: <EditDocumentIcon />},
        // { name: 'Edit Post', path: '/admin/editpost/:postId', Icon: <Edit /> },
        { name: 'Comments', path: '/admin/comments', Icon: <Message/> },
        {name: 'Category', path: '/admin/category', Icon: <CategoryOutlined/>},
        { name: 'Users', path: '/admin/users', Icon: <Person2Icon /> },
        // { name: 'Settings', path: '/admin/settings', Icon: <Settings /> },
        { name: 'Profile', path: '/admin/profile', Icon: <Person2Icon /> },
    ];
  return (
    <>
       {/* Sidebar */}
      <aside className="w-64 hidden md:block h-full  top-0 bg-transparent left-0">
        <div className="p-6 text-xl font-bold text-blue-600">Admin Panel</div>
        <nav className="mt-4">
          <ul className="space-y-2 text-gray-700">
            {links.map((link) => (
              <Link to={link.path} key={link.name}>
              
                <li className={`px-6 py-2 hover:bg-blue-100 hover:text-black cursor-pointer flex gap-4 ${currentPath === link.path ? 'bg-blue-600 hover:bg-blue-700 hover:text-blue-100 text-white font-semibold' : ''}`}>
                 {link.Icon} {link.name}
                </li>
                </Link>
            ))}
            {/* Add more links as needed */}
          </ul>
        </nav>
      </aside>
    </>
  )
}

export default SideBar
