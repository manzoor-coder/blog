import React, {useEffect, useState} from 'react'
import InstagramIcon from '@mui/icons-material/Instagram';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Zoom } from '@mui/material';
import { animateScroll as scroll } from 'react-scroll';


const Footer = () => {
  const [visible, setVisible] = useState(false);

  // Show button after scrolling 200px
  const handleScroll = () => {
    setVisible(window.scrollY > 100);
  };

  // Smooth scroll to top
const scrollToTop = () => {
  scroll.scrollToTop({
    duration: 800,
    smooth: true,
  });
};



  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <footer className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/about-2.jpg')" }}>
  {/* Slanted top bar */}
  <div className="relative h-16 w-full">
  {/* Left Green Triangle */}
  <div className="absolute top-0 left-0 w-1/2 h-full bg-green-600 clip-left z-10"></div>

  {/* Right Green Triangle */}
  <div className="absolute top-0 right-0 w-1/2 h-full bg-green-600 clip-right z-10"></div>

  {/* Black Strip Underneath */}
  <div className="absolute top-0 left-0 w-full h-full bg-white z-0"></div>
</div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

  {/* Content */}
  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
    
    {/* WEEKLY MARKETS */}
    <div>
      <h3 className="text-lg font-bold border-b border-dashed border-gray-400 pb-2 mb-4 uppercase">Weekly Markets</h3>
      <p><span className="font-semibold">Tuesday:</span> Hythe</p>
      <p><span className="font-semibold">Wednesday:</span> Bournemouth Square</p>
      <p><span className="font-semibold">Thursday:</span> Devizes</p>
      <p><span className="font-semibold">Saturday:</span> Amesbury</p>
      <p className="italic mt-2 text-sm">– Closed Sundays, Mondays, and Fridays –</p>
    </div>

    {/* HOME DELIVERY */}
    <div>
      <h3 className="text-lg font-bold border-b border-dashed border-gray-400 pb-2 mb-4 uppercase">Home Delivery</h3>
      <p><span className="font-semibold">Tuesday:</span> No deliveries</p>
      <p><span className="font-semibold">Wednesday:</span> Foodbank deliveries</p>
      <p><span className="font-semibold">Thursday:</span> No deliveries</p>
      <p><span className="font-semibold">Friday:</span> SP postcode deliveries</p>
      <p><span className="font-semibold">Saturday:</span> No deliveries</p>
    </div>

    {/* INSTAGRAM */}
    <div>
      <h3 className="text-lg font-bold border-b border-dashed border-gray-400 pb-2 mb-4 uppercase">Instagram</h3>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-4">
        <InstagramIcon /> Follow on Instagram
      </a>
    </div>

    {/* CONTACT US */}
    <div>
      <h3 className="text-lg font-bold border-b border-dashed border-gray-400 pb-2 mb-4 uppercase">Contact Us</h3>
      <p className="mb-2">Tel. 07741 252 862 (Matt Sherman)</p>
      <p className="text-sm">E-mail: info@centralfruits.co.uk</p>
    </div>
  </div>
</footer>

   {/* Scroll to Top Button */}
      <Zoom in={visible}>
        <Fab
          onClick={scrollToTop}
          size="small"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            backgroundColor: '#4caf50',
            color: 'white',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  )
}

export default Footer
