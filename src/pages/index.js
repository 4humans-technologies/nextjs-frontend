import Head from "next/head";
import Header from "../components/Mainpage/Header";
import SecondHeader from "../components/Mainpage/SecondHeader";
import Sidebar from "../components/Mainpage/Sidebar";
import Boxgroup from "../components/Mainpage/Boxgroup";
import { useState, useEffect } from "react";
// import Mainbox from "../components/Mainbox";
import { useSidebarUpdate, useSidebarStatus } from "../app/Sidebarcontext";
import Footer from "../components/Mainpage/Footer"
import useFetchInterceptor from "../hooks/useFetchInterceptor";

/**
 * just for development not for production 👇👇
 */
const data = Array(8).fill("").map(_empty => ({
  _id: "614849fb4e489436f8670b0f",
  onCall: [true, false][Math.floor(Math.random() * 10) % 2],
  isStreaming: [true, false][Math.floor(Math.random() * 10) % 2],
  name: "Vikas Kumawat",
  age: 22,
  gender: "Male",
  dob: 1999,
  languages: ["Marwadi"],
  rating: 5,
  profileImage: "https://png.pngtree.com/png-clipart/20190614/original/pngtree-female-avatar-vector-icon-png-image_3725439.jpg",
  rootUserId: "614849fb4e489436f8670b11",
  userName: "rohitkumar9133@gmail.com",
  userType: "Model"
}))

const Home = () => {
  const { ctx } = useFetchInterceptor()
  const sidebarStatus = useSidebarStatus();
  const [boxGroupsData, setBoxGroupData] = useState([
    {
      title: "Test Webcams",
      data: data
    },
    {
      title: "Category Two",
      data: data.slice(0, 4)
    },
    {
      title: "Category Three",
      data: data.slice(0, 4)
    }
  ])

  useEffect(() => {
    // fetch all live streams
    debugger
    if (ctx.loadedFromLocalStorage && ctx.fetchIntercepted) {
      fetch("/api/website/compose-ui/get-ranking-online-models")
        .then((res) => res.json())
        .then((data) => {
          debugger
          const transformedData = data.resultDocs.map(model => {
            return {
              ...model,
              profileImage: "https://png.pngtree.com/png-clipart/20190614/original/pngtree-female-avatar-vector-icon-png-image_3725439.jpg",
              age: new Date().getFullYear() - new Date(model.dob).getFullYear(),
              languages: model.languages.join(","),
              rootUserId: model.rootUser._id,
              userName: model.rootUser.username,
              userType: model.rootUser.userType,
              currentStream: model.rootUser.currentStream || 1
            }
          })
          setBoxGroupData(prev => {
            return [
              ...prev,
              { title: "Online Models | Either onCall or onStream", data: transformedData }
            ]
          });
        })
        .catch(error => {
          console.error(error);
          alert(error)
        })
    }
  }, [ctx.loadedFromLocalStorage, ctx.fetchIntercepted]);

  return (
    <div className="tw-min-h-screen">
      <Head>
        <title>DreamGirl Live Online Video Vhat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="tw-h-32"></div>
      <Header />
      <SecondHeader />
      <div className="tw-flex">
        <Sidebar />
        <div className="">
          {boxGroupsData.map((data, index) => {
            return <Boxgroup groupTitle={data.title} data={data.data} key={`${index}_boxGroup_&^HJK`} />
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home