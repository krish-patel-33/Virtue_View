import { Link, useNavigate } from "react-router-dom";
import "./card.scss";

function Card({ item, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(item.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="imageContainer">
        <img src={item.images[0]} alt="" />
      </div>
      <div className="textContainer">
        <h2 className="title">{item.title}</h2>
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
          <div className="icons" onClick={handleIconClick}>
            <div className="icon">
              <img src="/save.png" alt="" />
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

