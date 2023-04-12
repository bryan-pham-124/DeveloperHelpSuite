import { faHourglassEmpty, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@remix-run/react";
import GenericButton from "~/components/GenericButton";
import Navbar from "~/components/Navbar";
import binoculars from "~/images/binoculars-solid.svg";


// ./app/routes/index.tsx
export default function Index() {
  return (
    <div className="bg-[#212121] pb-4 md:py-5 md:min-h-[95vh] ">
        <div className="h-full wrapper flex align-middle items-center flex-col p-5 md:pt-0">

            <div className="h-full w-full flex items-center">
              <div className="wrapper w-full leading-loose text-center my-[15vh] mx-7 md:mx-0 ">
                <span className="text-left text-white text-4xl xl:text-5xl">  Get the help you need for your </span>
                <span className="text-left text-sky-400	ml-[3.5px] text-4xl xl:text-5xl">technical issue</span>
              </div>
            </div>

            <div className="h-full flex flex-col justify-center items-center pr-8 gap-y-10 md:flex-row md:gap-y-10 md:gap-x-7 xl:gap-7-3">
              <div className="wrapper bg-sky-500 w-full py-6 px-6 flex flex-col gap-y-3 max-w-[350px] rounded-xl md:w-[400px]  md:h-[230px]">
                <div className="w-full mx-auto ">
                  <img src={binoculars} className={"h-[100px] text-white mx-auto md:h-[60px]"}   alt="binoculars"/>
                </div>
                <h3 className="text-white text-center font-medium text-md my-3">Browse the knowledge base</h3>
                <div className="flex justify-center">
                  <GenericButton to ={"#"} text="Browse" buttonType="blackFilled"  />
                </div>
              </div>

              <div className="wrapper bg-white w-full py-6 px-6 flex flex-col gap-y-3 max-w-[350px] rounded-xl md:w-[400px] md:h-[230px]">
                <div className="w-full flex justify-center text-center">
                   <FontAwesomeIcon className="h-[100px] text-center text-sky-500 md:h-[60px]" icon={faQuestionCircle} />
                </div>
                <h3 className="text-sky-500 text-center font-medium text-md   my-3">See Questions and Answers</h3>
                <div className="flex justify-center">
                  <GenericButton to ={"#"} text="Explore"  buttonType="skyBlue"  />
                </div>
              </div>

            </div>
        </div>

    </div>
  )
}