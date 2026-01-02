"use client";

import React, { useState, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";

const fetchPhotosFromAPI = async (category) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/pinterest/${category}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function Inspirecomponent({ categories, data }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [photos, setPhotos] = useState(data, []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce effect: runs 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000); // 1 second delay

    return () => clearTimeout(handler); // cancel previous timeout if still typing
  }, [searchQuery]);

  // API call only when debouncedQuery changes
  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery.trim() === "") {
        setPhotos(data);
        return;
      }

      const modifiedQuery = `${debouncedQuery} isFromSearch`;

      setIsLoading(true);
      const res = await fetchPhotosFromAPI(modifiedQuery);
      setPhotos(res);
      setIsLoading(false);
    };

    fetchData();
  }, [debouncedQuery]);

  async function categoryClicked(category) {
    setSelectedCategory(category);
    setIsLoading(true);
    setSelectedPhoto(null);
    const res = await fetchPhotosFromAPI(category);
    setPhotos(res);
    setIsLoading(false);
  }

  return (
    <>
      <div className="min-h-screen py-10 px-4 md:px-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-2">
          Explore Categories
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select a category to see more images.
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              imageUrl={category.imageUrl}
              isActive={selectedCategory === category.id}
              onClick={() => categoryClicked(category.id)}
            />
          ))}
        </div>

        {/* make me a search card */}
        <div className="mt-10 mb-5">
          <h2 className="text-2xl font-semibold mb-4">Search for</h2>
          <input
            type="text"
            placeholder="Search for images..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchQuery(`${e.target.value}`)}
          />
          <button
            onClick={() => {
              setIsLoading(true);
              fetchPhotosFromAPI(searchQuery).then((res) => {
                setPhotos(res);
                setIsLoading(false);
              });
            }}
            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        <hr className="my-10" />

        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <PhotoGrid photos={photos} onPhotoClick={setSelectedPhoto} />
            {/* <GenerateAICTA /> */}
          </>
        )}
      </div>

      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}

const CategoryCard = ({ name, imageUrl, onClick, isActive }) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-lg cursor-pointer border-2 shadow-md transition-transform duration-300 hover:scale-105 ${
      isActive ? "border-blue-500" : "border-transparent"
    }`}
  >
    <img
      src={imageUrl}
      alt={name}
      className="h-40 w-full object-cover transform transition-transform duration-300 hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/40 hover:bg-black/50 flex items-center justify-center backdrop-blur-sm p-2">
      <h3 className="text-white text-sm font-bold text-center uppercase">
        {name}
      </h3>
    </div>
  </div>
);

const PhotoGrid = ({ photos, onPhotoClick }) => {
  const [loaded, setLoaded] = useState({});

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="break-inside-avoid rounded overflow-hidden shadow transition cursor-pointer relative"
          onClick={() => onPhotoClick(photo)}
        >
          {!loaded[photo.id] && (
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded" />
          )}
          <img
            src={photo.urls.thumb}
            alt={photo.description}
            className={`w-full object-cover transition-opacity duration-300 ${
              loaded[photo.id]
                ? "opacity-100"
                : "opacity-0 absolute top-0 left-0"
            }`}
            onLoad={() => setLoaded((prev) => ({ ...prev, [photo.id]: true }))}
          />
        </div>
      ))}
    </div>
  );
};

const GenerateAICTA = () => (
  <div className="text-center my-10 p-6 bg-white rounded shadow max-w-xl mx-auto">
    <h4 className="text-xl font-medium mb-2">
      Still not satisfied with these images?
    </h4>
    <p className="text-gray-500 mb-4">Generate a unique one with AI.</p>
    <a
      href="/generate"
      className="bg-blue-600 text-white px-5 py-3 rounded text-lg hover:bg-blue-700 transition"
    >
      Generate with AI
    </a>
  </div>
);

const PhotoModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full md:w-2/3 bg-black flex items-center justify-center"
          style={{
            backgroundImage: `url(${photo.urls.full})`,
            backgroundSize: "cover",
          }}
        >
          <img
            src={photo.urls.full}
            alt={photo.description}
            className="object-contain w-full h-full max-h-[80vh] rounded backdrop-blur-lg"
          />
        </div>
        <div className="w-full md:w-1/3 flex flex-col justify-between p-6 overflow-y-auto">
          <div>
            <h5 className="text-xl font-bold">{photo.user.name}</h5>
            <p className="text-gray-600">{photo.description}</p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <a
              href={photo.urls.full}
              download={`casemandu-image-${new Date().toISOString()}.png`}
              target="_blank"
              // rel="noopener noreferrer"
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              <AiOutlineDownload className="mr-2" />
              Save
            </a>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Inspirecomponent };
