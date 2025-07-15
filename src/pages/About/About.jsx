import React from 'react';
import { Container } from '@mui/material';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container maxWidth="md">
        <div className="bg-white p-8 rounded shadow-md">
          <h1 className="text-4xl font-bold mb-6 text-center text-green-700">About This Blog</h1>

          <p className="text-gray-700 text-lg mb-4">
            Welcome to my blog! This platform is built to share knowledge, insights, and ideas across a range of topics —
            from web development and tech trends to tutorials and personal experiences in the coding journey.
          </p>

          <p className="text-gray-700 text-lg mb-4">
            This blog was developed using modern web technologies like <strong>React.js</strong>, <strong>Firebase</strong>,
            <strong> Cloudinary</strong>, and <strong>Tailwind CSS</strong>. It features a dynamic admin dashboard,
            rich text editing, image uploads, and post management with real-time updates.
          </p>

          <p className="text-gray-700 text-lg mb-4">
            Whether you're a fellow developer, a student, or someone curious about tech — I hope you find the content
            valuable and inspiring.
          </p>

          <p className="text-gray-700 text-lg">
            Thanks for visiting! Feel free to explore the latest posts, leave comments, or reach out through the contact page.
          </p>
        </div>
      </Container>
    </div>
  );
};

export default About;
