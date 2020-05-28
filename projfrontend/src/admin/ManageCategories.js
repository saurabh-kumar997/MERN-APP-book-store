import React, { useState, useEffect, useReducer } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { getAllCategories, deleteACategory } from "./helper/adminapicall";
import { isAuthenticated } from "../auth/helper";

const ManageCategories = ({ match }) => {
  const [categories, setCategories] = useState([]);
  const { user, token } = isAuthenticated();

  const preload = () => {
    getAllCategories()
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
        } else {
          setCategories(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    preload();
  }, []);

  const deleteCategory = (categoryId) => {
    deleteACategory(categoryId, user._id, token).then((data) => {
      console.log(data);
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base title="Welcome admin" description="Manage categories here">
      <Link className="btn btn-info" to={`/admin/dashboard`}>
        <span className="">Admin Home</span>
      </Link>
      <h2 className="mb-4">All categories</h2>

      <div className="row">
        <div className="col-12">
          <h2 className="text-center text-white my-3">
            Total {categories.length} categories
          </h2>
          <div className="row text-center text-white mb-2">
            <div className="col-12">
              <table className="table text-white">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Category</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                {categories.map((category, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <th scope="row">{index + 1}</th>

                        <td>{category.name}</td>
                        <td>
                          <Link
                            className="btn btn-success"
                            to={`/admin/category/update/${category._id}`}
                          >
                            <span className="">Update</span>
                          </Link>
                          <button
                            onClick={() => {
                              deleteCategory(category._id);
                            }}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
