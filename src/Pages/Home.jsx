import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import CountUp from 'react-countup';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
     <section className="relative bg-gray-500 text-white overflow-hidden">
  <div className="container mx-auto px-4 lg:px-24 py-16 flex flex-wrap items-center justify-between">
    
    <div className="w-full lg:w-2/3 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-transparent to-transparent opacity-50 z-0"></div>
      <div className="relative z-10">
        <div className="relative">
          <div className="w-16 h-16 bg-orange-500 rounded-full z-20 relative"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-xl transform scale-125"></div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6 mt-8">
          Effortlessly Rent and Manage Your Dream Property with Our Seamless Online Platform
        </h1>
        <p className="text-lg mb-6">
          Find a variety of properties that suit you very easily.<br />
          Forget all difficulties in finding a residence for you.
        </p>
      <div className="mb-6">
        <Link to={'/search'}  className="text-blue-500 text-lg font-bold hover:underline">
          Lets get started...
        </Link>
      </div>
      <div className="flex">
      <div className="mr-8">
          <span className="text-3xl font-bold"><CountUp start={8800} end={9000} duration={4} /></span>
          <span className="text-orange-500 text-xl">+</span>
          <span className="block">Premium Products</span>
        </div>
        <div className="mr-8">
          <span className="text-3xl font-bold"><CountUp start={1950} end={2000} duration={4} /></span>
          <span className="text-orange-500 text-xl">+</span>
          <span className="block">Happy Customers</span>
        </div>
        <div>
          <span className="text-3xl font-bold"><CountUp end={28} /></span>
          <span className="text-orange-500 text-xl">+</span>
          <span className="block">Award Winnings</span>
        </div>
       
      </div>
    </div>
    </div>
    <div className="w-full lg:w-1/3 flex justify-end">
      <div className="relative">
        <div className="absolute inset-0 bg-black opacity-70 rounded-lg shadow-lg"></div>
        <img src="./hero.jpg" alt="Hero" className="relative rounded-lg shadow-lg" />
      </div>
    </div>

  </div>

  <div className="absolute inset-0 z-minus1 bg-black opacity-50"></div>
</section>       
    

      {/* swiper */}
<Swiper navigation>
  {offerListings &&
    offerListings.length > 0 &&
    offerListings.map((listing) => (
      <SwiperSlide key={listing._id}> {/* Added key prop here */}
        <div
          style={{
            background: `url(${listing.imageUrls[0]}) center no-repeat`,
            backgroundSize: 'cover',
          }}
          className='h-[500px]'
        ></div>
      </SwiperSlide>
    ))}
</Swiper>


      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent offers</h2>
              <Link className='text-sm text-white hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent places for rent</h2>
              <Link className='text-sm text-white hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-white'>Recent places for sale</h2>
              <Link className='text-sm text-white hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}