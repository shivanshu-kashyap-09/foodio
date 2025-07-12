import React from "react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-white w-full">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
          type="video/mp4"
          media="(min-width: 768px)"
        />
        <source
          src="https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095925.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
      </video>

      <div className="relative text-center bg-opacity-50 p-8 rounded-lg">
        <h2 className="text-5xl font-bold text-white mb-6">
          Your city's flavors, <br /> now just a click away.
        </h2>

        <div className="z-50 bg-white mx-auto flex w-fit max-w-screen-lg items-center justify-center gap-8 rounded-2xl border px-4 py-3 shadow-md mt-10 lg:rounded-[32px] lg:px-7 lg:py-6 2xl:gap-12 2xl:mt-14">
          {/* Restaurants */}
          <div className="flex items-center">
            <div>
              <div className="text-2xl font-bold text-gray-800 lg:text-3xl 2xl:text-4xl">
                300+
              </div>
              <div className="text-gray-600 md:text-base lg:text-lg">restaurants</div>
            </div>
            <img
              src="https://b.zmtcdn.com/data/o2_assets/d19ec60986487a77bcb026e5efc3325f1742908200.png"
              alt="restaurant icon"
              className="ml-4 max-h-10 lg:max-h-14 2xl:ml-8"
            />
          </div>

          <div className="h-9 lg:h-12 xl:h-16 w-px border-l border-gray-300"></div>

          {/* Cities */}
          <div className="flex items-center">
            <div>
              <div className="text-2xl font-bold text-gray-800 lg:text-3xl 2xl:text-4xl">
                100+
              </div>
              <div className="text-gray-600 md:text-base lg:text-lg">cities</div>
            </div>
            <img
              src="https://b.zmtcdn.com/data/o2_assets/e7533c4081d6140da37b9f430cb7b8051743006192.png"
              alt="location icon"
              className="ml-4 max-h-10 lg:max-h-14 2xl:ml-8"
            />
          </div>

          <div className="h-9 lg:h-12 xl:h-16 w-px border-l border-gray-300"></div>

          {/* Orders */}
          <div className="flex items-center">
            <div>
              <div className="text-2xl font-bold text-gray-800 lg:text-3xl 2xl:text-4xl">
                5000+
              </div>
              <div className="text-gray-600 md:text-base lg:text-lg">orders delivered</div>
            </div>
            <img
              src="https://b.zmtcdn.com/data/o2_assets/713443cc5944ce4284d7e49e75e2aacf1742466222.png"
              alt="delivery icon"
              className="ml-4 max-h-10 lg:max-h-14 2xl:ml-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
