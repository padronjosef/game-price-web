import { Suspense } from "react";
import { HomeTemplate } from "../components/home/templates/HomeTemplate";
import { HomeSkeleton } from "../components/home/atoms/HomeSkeleton";

const Home = () => {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeTemplate />
    </Suspense>
  );
};

export default Home;
