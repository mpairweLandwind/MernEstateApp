import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import List from '../components/List';
import "./Profile.scss";
import Chat from '../components/chat/Chat';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card/Card';

export default function Profile() {
  const { currentUser, token } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const handleShowListings = useCallback(async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/?id=${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch listings: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        console.error('Error fetching listings:', data.message);
        return;
      }

      if (!data.listings || !Array.isArray(data.listings)) {
        throw new Error('Data is not an array');
      }

      setUserListings(data.listings);
      console.log('Fetched listings:', data.listings);
    } catch (error) {
      setShowListingsError(true);
      console.error('Error in handleShowListings:', error.message);
    }
  }, [currentUser.id, token]);

  useEffect(() => {
    handleShowListings();
  }, [handleShowListings]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to delete listing: ${res.status} ${res.statusText}`);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }

      const data = await res.json();
      if (data.success === false) {
        console.error('Error deleting listing:', data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
      console.log('Deleted listing:', listingId);
    } catch (error) {
      console.error('Error in handleListingDelete:', error.message);
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
            </div>
            <div className="info">
              <span>
                Photo:
                <img
                  src={currentUser?.avatar || "./landlord.png"}
                  className='bg-white'
                  alt="User"
                />
              </span>
              <span>Username: <b>{currentUser?.username}</b></span>
              <span>E-mail: <b>{currentUser?.email}</b></span>
            </div>
            <div className="title">
              <h1>My List</h1>
           
            </div>
            <List listing={Array.isArray(userListings) ? userListings : []} />
            <div className="title">
              <h1>Saved List</h1>
            </div>
            <List listing={Array.isArray(userListings) ? userListings : []} />
            {userListings && userListings.length > 0 ? (
              userListings.map((listing) => <Card key={listing.id} listing={listing} />)
            ) : (
              <p className='text-red-700 mt-5'>{showListingsError ? 'Error showing listings' : 'No listings found'}</p>
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
                    key={listing.id}
                    className='border rounded-lg p-3 flex justify-between items-center gap-4 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
                  >
                    <Link to={`/listing/${listing.id}`}>
                      <img
                        src={listing.imageUrls[0]}
                        alt='Listing cover'
                        className='h-16 w-16 rounded-full object-cover'
                      />
                    </Link>
                    <Link
                      className='text-slate-700 font-semibold hover:underline truncate flex-1'
                      to={`/listing/${listing.id}`}
                    >
                      <p>{listing.name}</p>
                    </Link>
                    <div className='flex flex-col items-center'>
                      <button
                        onClick={() => handleListingDelete(listing.id)}
                        className='text-red-500 uppercase flex items-center gap-2 bg-red-100 p-2 rounded mb-2 hover:bg-red-200 transition-colors duration-300 ease-in-out'
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                      <Link to={`/update-listing/${listing.id}`}>
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
