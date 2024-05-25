import { useState } from 'react';
import PropTypes from 'prop-types';
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
    <form onSubmit={handleSubmit} className='space-y-12'>
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold text-center text-white">Property Details</h2>
        <p className="mt-1 text-md text-white text-center">
          Provide details about the property you are Creating.
        </p>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-6 mt-10">
  <InputField label="Property Name" id="name" type="text" value={formData.name} onChange={handleChange} />
  <SelectField label="Property Type" id="property" options={['Apartment', 'House', 'Condo', 'Land']} value={formData.property} onChange={handleChange} />
  <TextareaField label="Description" id="description" value={formData.description} onChange={handleChange} />
  <InputField label="Address" id="address" type="text" autoComplete="street-address" value={formData.address} onChange={handleChange} />
  <InputField label="Latitude" id="latitude" type="text" value={formData.latitude} onChange={handleChange} placeholder="Enter latitude" />
  <InputField label="Longitude" id="longitude" type="text" value={formData.longitude} onChange={handleChange} placeholder="Enter longitude" />
  <SelectField label="Status" id="status" options={['Available', 'Occupied', 'Under Contract', 'For Sale', 'Under Renovation', 'Pending Approval', 'Sold', 'Terminated', 'Pending Availability', 'Inactive']} value={formData.status} onChange={handleChange} />
</div>
      </div>

      {/* Property Options */}
      <PropertyOptions formData={formData} handleChange={handleChange} />

      {/* Image Upload Section */}
      <ImageUploadSection 
        setFiles={setFiles} 
        handleImageSubmit={handleImageSubmit} 
        handleRemoveImage={handleRemoveImage} 
        uploading={uploading} 
        formData={formData} 
        loading={loading} 
        error={error} 
        imageUploadError={imageUploadError}
      />
    </form>
  </main>  

    
  );
}

function PropertyOptions({ formData, handleChange }) {
  const propertyOptions = ['sale', 'rent', 'parking', 'furnished', 'offer'];
  const propertyFields = ['bedrooms', 'bathrooms', 'regularPrice', 'discountPrice'];

  return (
    <div className="sm:col-span-6 flex flex-wrap gap-6">
      {propertyOptions.map((type) => (
        <CheckboxField key={type} id={type} label={`${type} ${type === 'offer' ? '50% off' : ''}`} checked={formData[type]} onChange={handleChange} />
      ))}
      {propertyFields.map((field) => (
        <InputField key={field} type="number" id={field} min="1" max="10000000" required={field !== 'discountPrice' || formData.offer} value={formData[field]} onChange={handleChange} label={`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} ${formData.type === 'rent' && field.includes('Price') ? '($ / month)' : ''}`} />
      ))}
    </div>
  );
}

function ImageUploadSection({ setFiles, handleImageSubmit, handleRemoveImage, uploading, formData, loading, error, imageUploadError }) {
  return (
    <div className='flex flex-col flex-1 gap-4'>
      <p className='font-semibold'>Images:<span className='font-normal ml-2'>The first image will be the cover (max 6)</span></p>
      <div className='flex gap-4'>
        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
        <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 border border-white rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload'}</button>
      </div>
      {imageUploadError && <p className='text-red-700 text-sm'>{imageUploadError}</p>}
      {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
        <div key={url} className='flex justify-between p-3 border items-center'>
          <img src={url} alt='listing' className='w-20 h-20 object-contain rounded-lg' />
          <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 rounded-lg uppercase hover:opacity-75'>Delete</button>
        </div>
      ))}
      <button type="submit" disabled={loading || uploading} className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{loading ? 'Creating...' : 'Create Property'}</button>
      {error && <p className='text-white text-md'>{error}</p>}
    </div>
  );
}

// Reusable input, select, and textarea components to reduce redundancy
function InputField({ label, id, type = 'text', autoComplete = 'off', placeholder = '', min, max, required = false, value, onChange }) {
  return (
    <div className={`sm:col-span-${type === 'number' ? '2' : '4'}`}>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <input type={type} name={id} id={id} autoComplete={autoComplete} placeholder={placeholder} min={min} max={max} required={required} className="mt-2 block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" onChange={onChange} value={value} />
    </div>
  );
}

function SelectField({ label, id, options, value, onChange }) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <select id={id} name={id} className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm" onChange={onChange} value={value}>
        {options.map(option => <option key={option} value={option.toUpperCase()}>{option}</option>)}
      </select>
    </div>
  );
}

function TextareaField({ label, id, value, onChange }) {
  return (
    <div className="sm:col-span-4">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <textarea id={id} name={id} autoComplete="off" placeholder="Describe the property" className="mt-2 block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm" onChange={onChange} value={value} />
    </div>
  );
}

function CheckboxField({ id, label, checked, onChange }) {
  return (
    <div className='flex items-center gap-2'>
      <input type='checkbox' id={id} className='w-5 h-5' onChange={onChange} checked={checked} />
      <label htmlFor={id} className='text-sm text-white capitalize'>{label}</label>
    </div>
  );
}


ImageUploadSection.propTypes = {
  setFiles: PropTypes.func.isRequired,
  handleImageSubmit: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
  formData: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  imageUploadError: PropTypes.string
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired
};

InputField.defaultProps = {
  type: 'text',
  autoComplete: 'off',
  placeholder: '',
  required: false
};

PropertyOptions.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    property: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string,
    regularPrice: PropTypes.number,
    discountPrice: PropTypes.number,
    bathrooms: PropTypes.number,
    bedrooms: PropTypes.number,
    furnished: PropTypes.bool,
    parking: PropTypes.bool,
    offer: PropTypes.bool,
    latitude: PropTypes.string,
    longitude: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  handleChange: PropTypes.func.isRequired
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

CheckboxField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

TextareaField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};