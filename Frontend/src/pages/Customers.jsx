// import "../assets/css/customers.css";
// import { useNavigate } from "react-router-dom";

// export const Customers = () => {

//     const navigate = useNavigate();

//     const handleAddCustomer = () => {
//         navigate("/addCustomer");
//     };

//     const handleViewHistory = (id) => {
//         navigate(`/customerHistory/${id}`);
//     };

//     return (
//         <>
//             <div className="container">

//                 <div className="table-header">
//                     <input
//                         type="text"
//                         placeholder="Search by name..."
//                         className="search-input"
//                     />
//                     <button className="add-customer" type="button" onClick={handleAddCustomer} aria-label="Add customer">
//                         <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
//                             <line x1="12" y1="5" x2="12" y2="19" />
//                             <line x1="5" y1="12" x2="19" y2="12" />
//                         </svg>
//                         Add Customer
//                     </button>
//                 </div>

//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Email</th>
//                             <th>Mobile Number</th>
//                             <th>Joined Date</th>
//                             <th>History</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             <td>Jane Doe</td>
//                             <td>jane.doe@example.com</td>
//                             <td>+1 555 123 4567</td>
//                             <td>2024-05-01</td>
//                             <td>
//                                 <button className="history-btn" onClick={() => handleViewHistory(1)}>
//                                     View History
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td>John Smith</td>
//                             <td>john.smith@example.com</td>
//                             <td>+1 555 987 6543</td>
//                             <td>2023-12-15</td>
//                             <td>
//                                 <button className="history-btn" onClick={() => handleViewHistory(2)}>
//                                     View History
//                                 </button>
//                             </td>
//                         </tr>
//                         <tr>
//                             <td>Mary Johnson</td>
//                             <td>mary.johnson@example.com</td>
//                             <td>+1 555 765 4321</td>
//                             <td>2022-08-30</td>
//                             <td>
//                                 <button className="history-btn" onClick={() => handleViewHistory(3)}>
//                                     View History
//                                 </button>
//                             </td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     )
// };
