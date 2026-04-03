import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../types/CartItem";

const CONTINUE_SHOPPING_SESSION_KEY = "book-project-continue-shopping";

function CartPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const {cart, removeFromCart, updateQuantity, getLineSubtotal, getCartTotal} = useCart();
    const returnToFromRoute = location.state?.returnTo;
    const returnToFromSession = sessionStorage.getItem(CONTINUE_SHOPPING_SESSION_KEY);
    const continueShoppingTarget =
        returnToFromRoute ??
        (returnToFromSession ? JSON.parse(returnToFromSession) : { path: "/" });

    return(
        <div className="container py-4">
            {/* Bootstrap breadcrumb gives a clear path back to the catalog. */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <button
                            className="btn btn-link p-0"
                            onClick={() =>
                                navigate(continueShoppingTarget.path ?? "/", {
                                    state: { browseState: continueShoppingTarget.browseState },
                                })
                            }
                        >
                            Catalog
                        </button>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Cart</li>
                </ol>
            </nav>

            <h2 className="mb-3">Your Cart</h2>

            <div className="row g-4">
                <section className="col-12 col-lg-8">
                    {cart.length === 0 ? (
                        <div className="alert alert-info">Your cart is empty.</div>
                    ) : (
                        // Bootstrap Accordion (new component): each book expands for details/actions.
                        <div className="accordion" id="cartAccordion">
                            {cart.map((item: CartItem) => (
                                <div className="accordion-item" key={item.BookID}>
                                    <h2 className="accordion-header" id={`heading-${item.BookID}`}>
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${item.BookID}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-${item.BookID}`}
                                        >
                                            {item.Title} - Subtotal ${getLineSubtotal(item).toFixed(2)}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${item.BookID}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${item.BookID}`}
                                        data-bs-parent="#cartAccordion"
                                    >
                                        <div className="accordion-body">
                                            <p className="mb-2">Unit price: ${item.UnitPrice.toFixed(2)}</p>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <label htmlFor={`qty-${item.BookID}`} className="form-label mb-0">Quantity</label>
                                                <input
                                                    id={`qty-${item.BookID}`}
                                                    type="number"
                                                    min={1}
                                                    className="form-control"
                                                    style={{ maxWidth: "110px" }}
                                                    value={item.Quantity}
                                                    onChange={(e) => updateQuantity(item.BookID, Number(e.target.value))}
                                                />
                                            </div>
                                            <p className="mb-3">Line subtotal: ${getLineSubtotal(item).toFixed(2)}</p>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => removeFromCart(item.BookID)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <aside className="col-12 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="h5">Order Summary</h3>
                            <p className="mb-3">Total: <strong>${getCartTotal().toFixed(2)}</strong></p>
                            <div className="d-grid gap-2">
                                <button className="btn btn-success">Checkout</button>
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={() =>
                                        navigate(continueShoppingTarget.path ?? "/", {
                                            state: { browseState: continueShoppingTarget.browseState },
                                        })
                                    }
                                >
                                    Continue Browsing
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>

    );

}

export default CartPage