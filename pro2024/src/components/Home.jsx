import React from "react";
import ImageSlider from "./ImageSlider";
// import AboutUs from "./AboutUs";

const Home = () => {
  return (
    <div className="bg-gray-800" style={{ overflowX: "hidden" }}>
      <ImageSlider />
      {/* <AboutUs /> */}
    </div>
  );
};

export default Home;
