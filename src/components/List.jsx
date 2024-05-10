import PropTypes from 'prop-types';
import Card from './Card/Card';

function List({ listing }) {
    // Check if listing is undefined or null and return a message or null component
    if (!listing) {
        return <p>No listings available.</p>; // You can adjust this message or render nothing as needed
    }

    return (
        <div className='flex flex-col gap-10'>
            {listing.length > 0 ? (
                listing.map(item => (
                    <Card key={item.id} listing={item} />
                ))
            ) : (
                <p>No listings to display.</p> // Handle empty arrays gracefully
            )}
        </div>
    );
}

List.propTypes = {
    listing: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        // Add other required prop types for listing here
    }))
};

export default List;
