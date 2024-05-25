import PropTypes from 'prop-types';
import Card from './Card/Card';

function List({ listing }) {
    // Ensure that listing is always treated as an array
    if (!Array.isArray(listing)) {
        return <p>No listings available.</p>;
    }

    return (
        <div className='flex flex-col gap-10'>
            {listing.length > 0 ? (
                listing.map(item => (
                    <Card key={item.id} listing={item} />
                ))
            ) : (
                <p>No listings to display.</p>
            )}
        </div>
    );
}

List.propTypes = {
    listing: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        // Add other required prop types for listing here
    })).isRequired
};

export default List;