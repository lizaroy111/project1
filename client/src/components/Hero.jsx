import { curve, heroBackground, robot } from "../assets";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { ScrollParallax } from "react-just-parallax";
import { useRef, useState } from "react";

import { FaUserAstronaut } from "react-icons/fa";
import { PiListNumbersFill } from "react-icons/pi";
import { LiaCashRegisterSolid } from "react-icons/lia";
import Header from "./Header";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { useContext } from "react";
import { AuthContext } from "../App";
import { useEffect } from "react";
import axios from "axios";
import env from "../config.js"


const Hero = () => {
  const { userData } = useContext(AuthContext);
  const parallaxRef = useRef(null);

  const [data, setData] = useState({})

  useEffect(() => {
    if (userData && userData._id) {
      axios
        .post(`${env.backendHost}/getUserData`, { _id: userData._id })
        .then((response) => {
          console.log(response.data)
          setData(response.data)
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userData]);


  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Section
          className="pt-[12rem] -mt-[5.25rem]"
          crosses
          crossesOffset="lg:translate-y-[5.25rem]"
          customPaddings
          id="hero"
        >
          <div className="container relative" ref={parallaxRef}>
            <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
              <h1 className="h1 mb-6">
                Your {` `}
                <span className="inline-block relative">
                  Profile{" "}
                  <img
                    src={curve}
                    className="absolute top-full left-0 w-full xl:-mt-2"
                    width={624}
                    height={28}
                    alt="Curve"
                  />
                </span>
              </h1>
            </div>
            <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
              <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                <div className="relative bg-n-8 rounded-[1rem]">
                  <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                  <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                    <img
                      src={robot}
                      className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                      width={1024}
                      height={490}
                      alt="AI"
                    />

                    {/* <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" /> */}

                    <ScrollParallax isAbsolutelyPositioned>
                      <ul className="absolute px-1 py-1 bg-n-9/40 backdrop-blur border border-n-1/10 rounded-2xl flex-col justify-center items-center">
                        <li className="p-4 sm:p-5 flex min-w-60 sm:min-w-72 justify-between">
                          <span className="flex mt-1 sm:mt-2 mr-4 sm:mr-8">
                            <FaUserAstronaut className="mr-1 sm:mr-2 mt-[1px] sm:mt-[2px]" />
                            <h1 className="text-base sm:text-lg md:text-xl">Name</h1>
                          </span>
                          <h1 className="text-lg sm:text-xl md:text-2xl"> {data.name} </h1>
                        </li>
                        <li className="p-4 sm:p-5 flex min-w-60 sm:min-w-72 justify-between">
                          <span className="flex mt-1 sm:mt-2 mr-4 sm:mr-8">
                            <PiListNumbersFill className="mr-1 sm:mr-2 mt-[1px] sm:mt-[3px]" />
                            <h1 className="text-base sm:text-lg md:text-xl">Semester</h1>
                          </span>
                          <h1 className="text-lg sm:text-xl md:text-2xl">{data.current_sem}</h1>
                        </li>
                        <li className="p-4 sm:p-5 flex min-w-60 sm:min-w-72 justify-between">
                          <span className="flex mt-1 sm:mt-2 mr-4 sm:mr-8">
                            <LiaCashRegisterSolid className="mr-1 sm:mr-2 mt-[1px] sm:mt-[3px]" />
                            <h1 className="text-base sm:text-lg md:text-xl">Registration-Number</h1>
                          </span>
                          <h1 className="text-lg sm:text-xl md:text-2xl">{data.registrationNumber}</h1>
                        </li>
                      </ul>

                    </ScrollParallax>

                  </div>
                </div>

                <Gradient />
              </div>
              <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
                <img
                  src={heroBackground}
                  className="w-full"
                  width={1440}
                  height={1800}
                  alt="hero"
                />
              </div>

              <BackgroundCircles />
            </div>
          </div>

          <BottomLine />
        </Section>
      </div>
      <ButtonGradient />
    </>

  );
};

export default Hero;
