import React from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import DeleteIcon from '@mui/icons-material/Delete';
import trashIcon from '../trash.svg';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div>
        <div style={{ color: 'white' }} className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    );
  }

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index });
  };

  const handleCheckOut = async () => {
    try {
      let userEmail = localStorage.getItem("userEmail");
      let response = await fetch("http://localhost:5000/api/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log("Response Data:", responseData);
      dispatch({ type: "DROP" });
  
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle error here, e.g., show error message to user
    }
  };
  

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div>
      <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
        <table className='table table-hover'>
          <thead style={{ color: 'white' }} className='fs-4'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Option</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody style={{ color: 'white' }}>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td><button style={{ color: 'white' }} type="button" className="btn p-0" onClick={() => handleRemove(index)}><img style={{ color: 'white' }} src={trashIcon} alt="delete" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div><h1 style={{ color: 'white' }} className='fs-2'>Total Price: {totalPrice}/-</h1></div>
        <div>
          <button style={{ color: 'white' }} className='btn text-center bg-success mt-5' onClick={handleCheckOut}>Check Out</button>
        </div>
      </div>
    </div>
  );
}
