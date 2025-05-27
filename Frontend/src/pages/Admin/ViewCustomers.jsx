import React, { useState } from 'react';
import '../../assets/css/ViewCustomers.css';


export const ViewCustomers = () => {
  

  return (
    <div className="container">

                <div className="table-header">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="search-input"
                    />                 
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile Number</th>
                            <th>Joined Date</th>
                            <th>History</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Jane Doe</td>
                            <td>jane.doe@example.com</td>
                            <td>+1 555 123 4567</td>
                            <td>2024-05-01</td>
                            <td>
                                <button className="history-btn" onClick={() => handleViewHistory(1)}>
                                    View History
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>John Smith</td>
                            <td>john.smith@example.com</td>
                            <td>+1 555 987 6543</td>
                            <td>2023-12-15</td>
                            <td>
                                <button className="history-btn" onClick={() => handleViewHistory(2)}>
                                    View History
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>Mary Johnson</td>
                            <td>mary.johnson@example.com</td>
                            <td>+1 555 765 4321</td>
                            <td>2022-08-30</td>
                            <td>
                                <button className="history-btn" onClick={() => handleViewHistory(3)}>
                                    View History
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
  );
};

