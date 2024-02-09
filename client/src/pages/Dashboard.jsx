import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Dashboard = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  const createUrl = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/url/create",
        { originalUrl },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOriginalUrl("");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const getUrl = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/url/analytics/data",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setList(res.data.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/url/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      getUrl();
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getUrl();
  }, [originalUrl]);

  const logOut = () => {
    localStorage.clear("token");
    window.location.reload();
  };

  return (
    <div>
      <div className="p-2 flex justify-end">
        <button
          className="bg-transparent hover:bg-amber-800 text-black font-semibold hover:text-white py-2 px-4 border border-amber-200 hover:border-transparent rounded"
          onClick={logOut}
        >
          Log Out
        </button>
      </div>
      <div className="flex items-center flex-col">
        <h1 className="text-3xl font-bold p-3">Create Short Url</h1>
        <div className="p-3 flex gap-3 w-96">
          <input
            type="text"
            className="rounded-md p-3 w-full"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter Your Url..."
          />
          <button
            className="bg-red-400 rounded-md p-2 font-medium"
            onClick={createUrl}
          >
            Create
          </button>
        </div>
        <table className="text-left text-sm font-light max-w-xl bg-white rounded-md">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" className="px-6 py-4">
                Original Url
              </th>
              <th scope="col" className="px-6 py-4">
                ShortUrl
              </th>
              <th scope="col" className="px-6 py-4">
                Clicks
              </th>
              <th scope="col" className="px-6 py-4">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              return (
                <tr className="border-b dark:border-neutral-500" key={item._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.redirectUrl}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <a
                      href={`http://localhost:3000/api/url/${item.shortId}`}
                      target="_blank"
                      className=" text-blue-900 font-semibold text-lg"
                    >
                      {item.shortId}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{item.clicks}</td>
                  <td
                    className="whitespace-nowrap px-6 py-4 cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
