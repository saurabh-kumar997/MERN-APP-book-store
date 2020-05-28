import React, { useState } from "react";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { addCategory } from "./helper/adminapicall";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = isAuthenticated();
  const handleChange = (name) => (event) => {
    setError(false);
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addCategory(user._id, token, { name })
      .then((data) => {
        // console.log(data.error);
        if (data.error) {
          setError(true);
          setSuccess(false);
        } else {
          setError(false);
          setName("");
          setSuccess(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success"
        style={{ display: success ? "" : "none" }}
      >
        New Category Created
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        Failed to create a category...
      </div>
    );
  };

  const addCategoryForm = () => {
    return (
      <form>
        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={handleChange("category")}
            autoFocus
            required
            placeholder="For ex. Thriller"
          />
        </div>
        <button
          className="btn btn-lg btn-outline-success btn-block"
          onClick={handleSubmit}
        >
          Create Category
        </button>
      </form>
    );
  };

  return (
    <Base
      title="Add Category"
      description="Here you can add categories for products"
      className="container bg-info p-4"
    >
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-md-2 p-4">
          {successMessage()}
          {errorMessage()}
          {addCategoryForm()}
        </div>
      </div>
      {/* {JSON.stringify(values)} */}
    </Base>
  );
};

export default AddCategory;
