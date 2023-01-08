import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TablePagination } from '@mui/material';

import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import UserAccount from 'components/UserAccount/UserAccount';
import Chat from 'components/Chat/Chat';
import AuthService from 'services/auth/AuthService';
import OfferDetailsForm from 'components/Forms/OfferDetailsForm/OfferDetailsForm';
import ServiceService from 'services/ServiceService';
import ServiceType from 'types/ServiceType';
import ServiceDetailsForm from 'components/Forms/ServiceDetailsForm/ServiceDetialsForm';

import './OperatorServiceAndOfferPage.scss';

export function OperatorServiceAndOfferPage() {
  const [userId, setUserId] = useState<number>(0);
  const [servicePage, setServicePage] = useState<ServiceType[]>([]);
  const [servicePageNumber, setServicePageNumber] = useState(0);
  const [serviceRowsPerPage, setServiceRowsPerPage] = useState<number>(1); //5
  const [serviceRowsPerPageOption] = useState([1]); //const [serviceRowsPerPageOption] = useState([1, 2, 5, 10, 15]);
  const [servicePageAllElements, setServicePageAllElements] =
    useState<number>(0);
  const { buildingId } = useParams();

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(event.target.value);
    setServiceRowsPerPage(parseInt(event.target.value, 10));
    setServicePageNumber(0);
  };

  const handleGettingBuildingServices = async (
    buildingId: number,
    servicePageNumber: number,
    serviceRowsPerPage: number
  ) => {
    await ServiceService.getFindServiceByBuildingId(
      buildingId,
      servicePageNumber,
      serviceRowsPerPage
    ).then((response) => {
      console.log(response.data);
      console.log(response.data.content);
      console.log(response.data.totalElements);
      setServicePage(response.data.content);
      setServicePageAllElements(response.data.totalElements);
    });
  };

  useEffect(() => {
    setUserId(AuthService.getCurrentUserId());
  }, []);

  useEffect(() => {
    console.log(servicePageNumber);
    if (buildingId) {
      handleGettingBuildingServices(
        Number(buildingId),
        servicePageNumber,
        serviceRowsPerPage
      );
    }
  }, [buildingId, servicePageNumber, serviceRowsPerPage]);

  return (
    <>
      <UserAccount />
      <Navbar />
      <div id="pagination-operator-service">
        <TablePagination
          component="div"
          count={servicePageAllElements}
          page={servicePageNumber}
          rowsPerPageOptions={serviceRowsPerPageOption}
          onPageChange={(_, newPage) => setServicePageNumber(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPage={serviceRowsPerPage}
          labelRowsPerPage={'Liczba elementów na stronie:'}
        />
      </div>
      {servicePage
        // .sort((a, b) => a.id - b.id)
        // .slice(
        //   servicePageNumber * serviceRowsPerPage,
        //   servicePageNumber * serviceRowsPerPage + serviceRowsPerPage
        // )
        .map((data) => {
          console.log(data);
          return (
            <div id={`${data.id}`} className="service-details-component">
              <ServiceDetailsForm
                id={data.id}
                date={data.date}
                buildingId={Number(buildingId)}
                description={data.description}
                mustCreate={false}
                handleFormClose={() => {
                  return false;
                }}
              />
            </div>
          );
        })}
      {buildingId ? (
        <div id="chat-operator">
          <Chat userId={userId} buildingId={Number(buildingId)} />
        </div>
      ) : null}
      {servicePage.map((data) => {
        return (
          <div id={`${data.id}`} className="offer-details-component">
            <OfferDetailsForm serviceId={data.id} />
          </div>
        );
      })}
      <Footer />
    </>
  );
}
