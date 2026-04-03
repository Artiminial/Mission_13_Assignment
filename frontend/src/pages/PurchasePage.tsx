import { useLocation, useNavigate, useParams } from "react-router-dom";
import WelcomeBand from "../components/WelcomeBand";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/CartItem";
import { useState } from "react";

const CONTINUE_SHOPPING_SESSION_KEY = "book-project-continue-shopping";

function PurchasePage(){
    const navigate = useNavigate();
    const location = useLocation();
    const {title, bookID} = useParams();
    const {addToCart} = useCart();
    const [quantity, setQuantity] = useState<number>(1);
    const returnTo = location.state?.returnTo;
    const unitPrice = Number(location.state?.unitPrice ?? 0);

    const handleAddToCart = () => {
        const newItem: CartItem = {
            BookID: Number(bookID),
            Title: title || "No Title Found",
            UnitPrice: unitPrice,
            Quantity: Math.max(1, quantity),
        };

        // Keep continue-shopping destination across page transitions in this session.
        sessionStorage.setItem(CONTINUE_SHOPPING_SESSION_KEY, JSON.stringify(returnTo ?? { path: "/" }));
        addToCart(newItem);
        navigate('/cart', { state: { returnTo } });
    };

    return(
        <>
            <WelcomeBand/>
            <div className="container py-4">
                {/* Bootstrap breadcrumb gives contextual navigation for this step */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <button
                                className="btn btn-link p-0"
                                onClick={() => navigate(returnTo?.path ?? "/", { state: { browseState: returnTo?.browseState } })}
                            >
                                Catalog
                            </button>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">Purchase</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h2 className="h3 mb-3">Purchase {title}</h2>
                                <p className="mb-3"><strong>Unit Price:</strong> ${unitPrice.toFixed(2)}</p>

                                <div className="mb-3">
                                    <label htmlFor="quantityInput" className="form-label">Quantity</label>
                                    <input
                                        id="quantityInput"
                                        type="number"
                                        min={1}
                                        className="form-control"
                                        value={quantity}
                                        onChange={(x) => setQuantity(Number(x.target.value))}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn btn-success" onClick={handleAddToCart}>Add to cart</button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate(returnTo?.path ?? "/", { state: { browseState: returnTo?.browseState } })}
                                    >
                                        Back to catalog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default PurchasePage;