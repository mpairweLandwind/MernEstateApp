import { useState } from 'react';
// import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'rent',              // Default to 'rent', ensure the value matches an enum from ListingType
    property: 'apartment',      // Default, assuming you want a default
    status: 'AVAILABLE',        // Default status, ensure this matches an enum from PropertyStatus
    description: '',
    address: '',
    regularPrice: 50,           // Default set, adjust as necessary
    discountPrice: 0,           // Default set, adjust as necessary
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
    latitude: '',               // Optional
    longitude: '',              // Optional
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError(error.message);
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (

    <main className='p-3 max-w-6xl mx-auto bg-slate-700 text-white'>
  <h1 className='text-3xl font-semibold text-center my-7'>
    Add Property
  </h1>
  <form onSubmit={handleSubmit} className='space-y-12 text-white'>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3">
      <h2 className="text-base font-semibold leading-7 text-white text-center">Property Details</h2>
      <p className="mt-1 text-sm leading-6 text-white text-center">
        Provide details about the property you are listing.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Property Name */}
        <div>
        <div className="sm:col-span-4">
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-white">
            Property Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Enter property name"
            className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="form-group">
              <label htmlFor="property" className="font-medium">Property Type</label>
              <select id="property" required onChange={handleChange} value={formData.property} className="select">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

        {/* Description */}
        <div className="sm:col-span-4">
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            placeholder="Describe the property"
            className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            onChange={handleChange}
            value={formData.description}
          />
        </div>

        </div>

        {/* Address */}
        <div>
        <div className="sm:col-span-4">
          <label htmlFor="address" className="block text-sm font-medium leading-6 text-white">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            required
            placeholder="Enter property address"
            className="mt-2 block w-full rounded-md border border-gray-300 py-1.5 text-gray-900  shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm"
            onChange={handleChange}
            value={formData.address}
          />
        </div>

        <div className='sm:col-span-4'>
  <label htmlFor="status" className="block font-semibold">Status</label>
  <select
    id="status"
    className="input"
    value={formData.status}
    onChange={handleChange}
    required
  >
    <option value="AVAILABLE">Available</option>
    <option value="OCCUPIED">Occupied</option>
    <option value="UNDER_CONTRACT">Under Contract</option>
    <option value="FOR_SALE">For Sale</option>
    <option value="UNDER_RENOVATION">Under Renovation</option>
    <option value="PENDING_APPROVAL">Pending Approval</option>
    <option value="SOLD">Sold</option>
    <option value="TERMINATED">Terminated</option>
    <option value="PENDING_AVAILABILITY">Pending Availability</option>
    <option value="INACTIVE">Inactive</option>
  </select>
</div>
    


      </div>



         </div>

        {/* Property Options */}
        <div className="sm:col-span-6 flex flex-wrap gap-6">
          {['sale', 'rent', 'parking', 'furnished', 'offer'].map((type) => (
            <div key={type} className='flex items-center gap-2'>
              <input
                type='checkbox'
                id={type}
                className='w-5 h-5'
                onChange={handleChange}
                checked={formData[type]}
              />
              <label htmlFor={type} className='text-sm text-white capitalize'>
                {type} {type === 'offer' ? '50% off' : ''}
              </label>
            </div>
          ))}

          {/* Bedrooms, Bathrooms, Prices */}
          {['bedrooms', 'bathrooms', 'regularPrice', 'discountPrice'].map((field) => (
            <div key={field} className='flex items-center gap-2'>
              <input
                type='number'
                id={field}
                min='1'
                max='10000000'
                required={field !== 'discountPrice' || formData.offer}
                className='p-2 border border-gray-300 rounded-lg text-gray-900 '
                onChange={handleChange}
                value={formData[field]}
              />
              <label htmlFor={field} className='text-sm text-white capitalize'>
                {field.replace(/([A-Z])/g, ' $1').toLowerCase()} {formData.type === 'rent' && field.includes('Price') ? '($ / month)' : ''}
              </label>
            </div>
          ))}
        </div>
     
    </div>

    {/* Image Upload Section */}
    <div className='flex flex-col flex-1 gap-4'>
      <p className='font-semibold'>
        Images:
        <span className='font-normal text-white ml-2'>
          The first image will be the cover (max 6)
        </span>
      </p>
      <div className='flex gap-4'>
        <input
          onChange={(e) => setFiles(e.target.files)}
          className='p-3 border border-gray-300 rounded w-full'
          type='file'
          id='images'
          accept='image/*'
          multiple
        />
        <button
          type='button'
          disabled={uploading}
          onClick={handleImageSubmit}
          className='p-3 text-white border border-white rounded uppercase hover:shadow-lg disabled:opacity-80'
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
      {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
        <div key={url} className='flex justify-between p-3 border items-center'>
          <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
          <buttun
            type='button'
            onClick={() => handleRemoveImage(index)}
            className='p-3 text-white rounded-lg uppercase hover:opacity-75'
          >
            Delete
          </buttun>
        </div>
      ))}
      <button
        type="submit"
        disabled={loading || uploading}
        className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {loading ? 'Creating...' : 'Create listing'}
      </button>
      {error && <p className='text-red-700 text-sm'>{error}</p>}
    </div>
  </form>
</main>

    
  );
}
