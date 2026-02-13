import { Link } from "react-router-dom";
import "./card.scss";

function Card({ item, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault(); // Prevent navigation to single page
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(item.id);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">₹ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom}</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
            {onDelete && (
              <div className="icon" onClick={handleDelete} title="Delete Property">
                <img src="/delete.png" alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

