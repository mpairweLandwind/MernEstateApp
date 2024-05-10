import { Link } from "react-router-dom";
import './Card.scss';
import PropTypes from 'prop-types';
//import ListingItem from "../ListingItem";

function Card({ listing }) {
    return (
        <div className='card'>
            <Link to={`/${listing._id}`} className='imageContainer'>
                <img src={listing.imageUrls[0]} alt="" />
            </Link>
            <div className="textContainer">
                <h2 className="title">
                    <Link to={`/${listing._id}`}>{listing.name}</Link>
                </h2>
                <p className="adress">
                    <img src="/pin.png" alt="" />
                    <span>{listing.address}</span>
                </p>
                <p className="price">$ {listing.offer ? listing.discountPrice : listing.regularPrice}</p>
                <div className="bottom">
                    <div className="features">
                        <div className="feature">
                            <img src="/bed.png" alt="" />
                            <span>{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}</span>
                        </div>
                        <div className="feature">
                            <img src="/bath.png" alt="" />
                            <span>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</span>
                        </div>
                    </div>
                    <div className="icons">
                        <div className="icon">
                            <img src="/save.png" alt="" />
                        </div>
                        <div className="icon">
                            <img src="/chat.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
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


export default Card