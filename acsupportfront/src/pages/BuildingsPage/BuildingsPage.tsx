import React, { useEffect, useState } from "react";

import Navbar from "components/Navbar/Navbar";
import Footer from "components/Footer/Footer";
import BuildingTile from "components/BuildingTile/BuildingTile";
import UserAccount from "components/UserAccount/UserAccount";
import AuthService from "services/auth/AuthService";
import BuildingType from "types/BuildingType";
import BuildingService from "services/BuildingService";

import "./BuildingsPage.scss";

export function BuildingsPage() {
  const [userBuildings, setUserBuildings] = useState<BuildingType[]>([]);
  const [userId, setUserId] = useState<number>();

  const handleGetingUserBuildings = async (userId: number) => {
    await BuildingService.getUserBuildings(userId).then((response) => {
      console.log(response.data);
      console.log(response.data.content);
      setUserBuildings(response.data.content);
    });
  };

  useEffect(() => {
    setUserId(AuthService.getCurrentUserId());
  }, []);

  useEffect(() => {
    handleGetingUserBuildings(userId!);
    const interval = setInterval(() => {
      handleGetingUserBuildings(userId!);
    }, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const buildingsTable = userBuildings
    .sort((a, b) => a.id - b.id)
    //.slice(page * elementsPerPage, page * elementsPerPage + elementsPerPage)
    .map((data) => {
      return (
        <BuildingTile
          id={data.id}
          name={data.name}
          city={data.city}
          street={data.street}
        />
      );
    });

  return (
    <>
      <Navbar />
      <UserAccount />
      <div className="buildings">{buildingsTable}</div>
      <Footer />
    </>
  );
}
