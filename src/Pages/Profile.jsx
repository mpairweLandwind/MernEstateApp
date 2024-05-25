import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faFileLines, faChartSimple, faScrewdriverWrench, faMessage, faUserGear, faCirclePlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import List from '../components/List';
import "./Profile.scss"
import Chat from '../components/chat/Chat';


export default function Profile() {
  
  const { currentUser } = useSelector((state) => state.user); 
    const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const landlordImage = "./ceo.jpg";

  const handleShowListings = useCallback(async () => {
    try {
      setShowListingsError(false);
      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();
      if (!data || data.length === 0) {
        setUserListings([]);
        setShowListingsError('No listings found.');
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError('Failed to fetch listings.');
    }
  }, [currentUser._id]);  // Dependencies for useCallback

  useEffect(() => {
    handleShowListings();
  }, [handleShowListings]);  // Dependency array includes handleShowListings

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const SidebarItem = ({ icon, text, to, onClick }) => (
    <li className={`flex items-center py-2 px-3 rounded-md hover:bg-gray-800  'bg-gray-800 text-white' : 'text-gray-300'}`}>
      <FontAwesomeIcon icon={icon} className='text-lg text-white' />
      <Link to={to} className='ml-2 text-base text-white' onClick={onClick}>
        {text}
      </Link>
    </li>
  );

  SidebarItem.propTypes = {
    icon: PropTypes.object.isRequired,
    text: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  };

  const sidebarItems = [
    { icon: faCirclePlus, text: 'Add Property', to: '/create-listing' },
    { icon: faHouse, text: 'Manage Property', to:'/Manage Property' },
    { icon: faUsers, text: 'Tenant Management', to: '/tenant-management' },
    { icon: faFileLines, text: 'Lease Management', to: '/lease-management' },
    { icon: faChartSimple, text: 'Financial Dashboard', to: '/financial-dashboard' },
    { icon: faScrewdriverWrench, text: 'Maintenance Requests', to: '/maintenance-requests' },
    { icon: faMessage, text: 'Communication Center', to: '/communication-center' },
    { icon: faUserGear, text: 'Profile Management', to: '/profile-management' },
  ];

  return (
    <div className='flex'>
      <div className='w-1/5 h-screen bg-slate-500'>
      <div className='p-3 flex items-center justify-center'>
          <img src={landlordImage} alt="Landlord" className='rounded-full h-14 w-14 object-cover' />
        </div>
        <ul className='space-y-1'>
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </div>
      <div className="profilePage p-6">
            <div className="details">
                <div className="wrapper">
                    <div className="title">
                        <h1><b> User Information </b></h1>
                        {/* <button>Update Profile</button> */}
                    </div>
                    <div className="info">
                        <span>
                            Photo:
                            <img
                                src="./landlord.png" className='bg-white'
                                alt="lee"
                            />
                        </span>
                        <span>Username: <b>{currentUser.username}</b></span>
                        <span>E-mail: <b>{currentUser.email}</b></span>
                    </div>
                    <div className="title">
                    <h1>My List</h1>
                     <button>Create New Post</button>
                           </div>
                    {/* Pass userListings to the List component */}
                      <List listing={userListings} />

                    <div className="title">
                        <h1>Saved List</h1>
                    </div>

                    {!showListingsError && userListings.length === 0 ? (
                       <p className='text-gray-600'>No listings available. Add some properties to manage.</p>
                     ) : null}
                    {userListings.length > 0 ? (
                                 <List listing={userListings} />
                                                     ) : (
                           <p>Loading listings or no listings available.</p>
                                                     )}
   
                </div>
            </div>
            <div className="chatContainer">
                <div className="wrapper">
                {userListings && userListings.length > 0 && (
  <div className='flex flex-col gap-4'>
    <h1 className='text-center mt-7 text-2xl font-semibold'>Property List</h1>
    {userListings.map((listing) => (
      <div
        key={listing._id}
        className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
      >
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls[0]}
            alt='Listing cover'
            className='h-16 w-16 rounded-full object-cover'
          />
        </Link>
        <Link
          className='text-slate-700 font-semibold hover:underline truncate flex-1'
          to={`/listing/${listing._id}`}
        >
          <p>{listing.name}</p>
        </Link>
        <div className='flex flex-col items-center'>
        <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-500 uppercase flex items-center gap-2 bg-red-100 p-2 rounded mb-2 hover:bg-red-200 transition-colors duration-300 ease-in-out'
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
          <Link to={`/update-listing/${listing._id}`}>
          <button className='text-green-500 uppercase flex items-center gap-2 bg-green-100 p-2 rounded hover:bg-green-200 transition-colors duration-300 ease-in-out'>
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}

                </div>
                <Chat />
            </div>
        </div>
 
      
      
        
      </div>   
      
  );

}
