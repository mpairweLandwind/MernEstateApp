import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faHeart, faCommentDots, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './Card.scss';


//Card Component
function Card({ listing }) {
    // Check if listing is undefined or null
    if (!listing) {
        return <div>Loading...</div>; // Or any other loading indicator or message
    }

    return (
        <div className='card'>
            <Link to={`/listing/${listing._id}`} className="imageContainer">
                <img src={listing.imageUrls[0]} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/listing/${listing._id}`} >
                        {listing.name}
                    </Link>
                </h2>
                <p className="adress">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {listing.address}
                </p>
                <span className="price">${listing.offer ? listing.discountPrice : listing.regularPrice}</span>
                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <FontAwesomeIcon icon={faBed} />
                            <span>{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}</span>
                        </div>
                        <div className="feature">
                            <FontAwesomeIcon icon={faBath} />
                            <span>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</span>
                        </div>
                    </div>
                    <div className="icons">
                        <button className="icon">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6" />
                        </button>
                        <button className="icon">
                            <FontAwesomeIcon icon={faCommentDots} className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

Card.propTypes = {
    listing: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        offer: PropTypes.bool,
        discountPrice: PropTypes.number,
        regularPrice: PropTypes.number.isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
    })
};

export default Card;

