import './App.css'
import ProjectsPage from './pages/ProjectsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PurchasePage from './pages/PurchasePage';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
function App() {
  return (
    <>
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProjectsPage/>}/>
          <Route path="/purchase/:title/:bookID" element={<PurchasePage/>}/>
          <Route path='/cart' element={<CartPage/>}/>
        </Routes>
      </Router>
    </CartProvider>
    </>
  )
}

export default App
