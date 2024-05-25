import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import List from '../components/List';
import "./Profile.scss";
import Chat from '../components/chat/Chat';
import Sidebar from '../components/Sidebar';

export default function Profile() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log('Current User:', currentUser);
  console.log('Token:', token);

  const handleShowListings = useCallback(async () => {
    if (!currentUser || !currentUser._id || !token) {
      console.log('User not logged in or missing required fields.');
      setShowListingsError('User is not logged in.');
      setLoading(false);
      return;
    }

    try {
      setShowListingsError(false);
      setLoading(true);
      const response = await fetch(`/api/user/listings/${currentUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data || data.length === 0) {
        setUserListings([]);
        setShowListingsError('No listings found.');
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError('Failed to fetch listings.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, token]);

  useEffect(() => {
    if (currentUser) {
      handleShowListings();
    }
  }, [currentUser, handleShowListings]);

  const handleListingDelete = async (listingId) => {
    if (!currentUser || !token) {
      console.log('User not logged in.');
      return;
    }

    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
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
  return (
    <div className='flex'>
      <Sidebar />
  
      <div className="profilePage p-6">
        <div className="details">
          <div className="wrapper">
            <div className="title">
              <h1><b>User Information</b></h1>
              {/* <button>Update Profile</button> */}
            </div>
            <div className="info">
              <span>
                Photo:
                <img
                  src="./landlord.png" className='bg-white'
                  alt="User"
                />
              </span>
              <span>Username: <b>{currentUser?.username}</b></span>
              <span>E-mail: <b>{currentUser?.email}</b></span>
            </div>
            <div className="title">
              <h1>My List</h1>
              <button>Create New Post</button>
            </div>
            {/* Pass userListings to the List component */}
            <List listing={Array.isArray(userListings) ? userListings : []} />
  
            <div className="title">
              <h1>Saved List</h1>
            </div>
  
            {!showListingsError && userListings.length === 0 && !loading ? (
              <p className='text-gray-600'>No listings available. Add some properties to manage.</p>
            ) : null}
            {loading ? (
              <p>Loading listings...</p>
            ) : showListingsError ? (
              <p>{showListingsError}</p>
            ) : (
              userListings.length > 0 && <List listing={userListings} />
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
