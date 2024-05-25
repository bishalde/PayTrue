import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const navbar = () => {
  return (
    <>
      <div className="navbar">
        <div className="logoimage">
          <img src="/images/paytrue.svg" />
        </div>

        <div className="navlinks">
          <Link to="/">Home</Link>
          <a href="#">Mutual Funds</a>
          <Link to="/budgetanalyze">Budget Analyzer</Link>
          <Link to="/expensemanager">Expense Manager</Link>
        </div>


        <div className="navButtons">
          <a href="#">Login</a>
          <a className="btn" href="#">Get Started</a>
        </div>  
      </div>
    </>
  );
};

export default navbar;
