import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";


const CartSummary = () => {
    const navigate = useNavigate();
    const {getCartCount, getCartTotal} = useCart();

    return(
        <div className="card mt-4">
            <div className="card-body">
                <h5 className="card-title">Cart Summary</h5>
                <p className="mb-1">Items: <strong>{getCartCount()}</strong></p>
                <p className="mb-3">Total: <strong>${getCartTotal().toFixed(2)}</strong></p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/cart')}>
                    View Cart
                </button>
            </div>
        </div>
    );
};

export default CartSummary;