import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { getAllCategories, createProduct } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";
// import { Redirect } from "react-router-dom";

const AddProduct = () => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    photo: "",
    author: "",
    categories: [],
    category: "",
    loading: false,
    error: "",
    createdProduct: "",
    getRedirect: false,
    formData: "",
  });

  const { user, token } = isAuthenticated();

  const {
    name,
    description,
    price,
    stock,
    error,
    photo,
    author,
    categories,
    category,
    loading,
    createdProduct,
    getRedirected,
    formData,
  } = values;

  const preload = () => {
    getAllCategories().then((data) => {
      //   console.log(data);
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, categories: data, formData: new FormData() });
        // console.log(categories);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    createProduct(user._id, token, formData)
      .then((data) => {
        console.log(data);
        if (data.error) {
          setValues({ ...values, error: data.error, loading: true });
        } else {
          setValues({
            ...values,
            name: "",
            description: "",
            photo: "",
            createdProduct: data.name,
            stock: "",
            price: "",
            author: "",
            categories: [],
            loading: false,
            getRedirected: true,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // const doRedirect = () => {
  //   if (getRedirected) {
  //     if (user && user.role === 1) {
  //       return <Redirect to="/admin/dashboard" />;
  //     } else {
  //       return <Redirect to="/admin/create/product" />;
  //     }
  //   }
  // };

  const successMessage = () => {
    return (
      <div
        className="alert alert-success"
        style={{ display: createdProduct ? "" : "none" }}
      >
        New Product Created
      </div>
    );
  };

  const errorMessage = () => {
    return (
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        Failed to add Product...
      </div>
    );
  };

  const createProductForm = () => (
    <form>
      <div className="form-group">
        <input
          onChange={handleChange("name")}
          name="photo"
          className="form-control"
          placeholder="Name"
          value={name}
          required
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("author")}
          name="author"
          className="form-control"
          placeholder="Author"
          value={author}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          onChange={handleChange("description")}
          name="photo"
          className="form-control"
          placeholder="Description"
          value={description}
          required
        />
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("price")}
          type="number"
          className="form-control"
          placeholder="Price"
          value={price}
          required
        />
      </div>
      <div className="form-group">
        <select
          onChange={handleChange("category")}
          className="form-control"
          placeholder="Category"
        >
          <option>Select</option>
          {categories &&
            categories.map((cate, index) => {
              return (
                <option key={index} value={cate._id}>
                  {cate.name}
                </option>
              );
            })}
        </select>
      </div>
      <div className="form-group">
        <input
          onChange={handleChange("stock")}
          type="number"
          name="stock"
          className="form-control"
          placeholder="Quantity"
          value={stock}
          required
        />
      </div>
      <span>Post photo</span>
      <div className="form-group">
        <label className="btn btn-block btn-info mb-3">
          <input
            onChange={handleChange("photo")}
            type="file"
            name="photo"
            accept="image"
            placeholder="Choose a file"
            required
          />
        </label>
      </div>

      <button
        type="submit"
        onClick={onSubmit}
        className="btn btn-outline-success btn-lg btn-block"
      >
        Create Product
      </button>
    </form>
  );
  return (
    <Base title="Add Product" className="container bg-info p-4">
      <div className="row bg-white rounded">
        <div className="col-md-8 offset-2 p-4 mb-4">
          {successMessage()}
          {errorMessage()}
          {createProductForm()}
        </div>
      </div>
    </Base>
  );
};

export default AddProduct;
