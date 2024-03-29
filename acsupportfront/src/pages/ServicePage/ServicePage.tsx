import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  TablePagination,
  TextField,
} from '@mui/material';

import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Chat from 'components/Chat/Chat';
import ServiceDetailsForm from 'components/Forms/ServiceDetailsForm/ServiceDetialsForm';
import UserAccount from 'components/UserAccount/UserAccount';
import BuildingService from 'services/BuildingService';
import BuildingType from 'types/BuildingType';
import AuthService from 'services/auth/AuthService';
import OfferDetailsForm from 'components/Forms/OfferDetailsForm/OfferDetailsForm';
import ServiceType from 'types/ServiceType';
import ServiceService from 'services/ServiceService';

import './ServicePage.scss';
import { Icon } from '@iconify/react';

export function ServicePage() {
  const [userId, setUserId] = useState<number>(0);
  const [userBuildings, setUserBuildings] = useState<BuildingType[]>([]);
  const [servicePage, setServicePage] = useState<ServiceType[]>([]);
  const flatProps = {
    options: userBuildings
      .sort((a, b) => a.id - b.id)
      .map((option) => ({
        label:
          option.name +
          ', ' +
          option.street +
          ' ' +
          option.city +
          ', ' +
          option.postCode +
          ', ' +
          option.region,
        id: option.id,
      })),
  };
  const [chosenBuilding, setChosenBuilding] = useState<any>('');
  const [chosenBuildingId, setChosenBuildingId] = useState<number>(0);
  const [serviceFormOpen, setServiceFormOpen] = useState<boolean>(false);
  const [servicePageNumber, setServicePageNumber] = useState(0);
  const [serviceRowsPerPage, setServiceRowsPerPage] = useState<number>(1);
  const [serviceRowsPerPageOption] = useState([1]);
  const [servicePageAllElements, setServicePageAllElements] =
    useState<number>(0);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setServiceRowsPerPage(parseInt(event.target.value, 10));
    setServicePageNumber(0);
  };

  const handleGetingUserBuildings = async (userId: number) => {
    await BuildingService.getUserBuildings(userId).then((response) => {
      setUserBuildings(response.data.content);
    });
  };

  const handleGettingBuildingServices = async (
    buildingId: number,
    servicePageNumber: number,
    serviceRowsPerPage: number,
  ) => {
    await ServiceService.getFindServiceByBuildingId(
      buildingId,
      servicePageNumber,
      serviceRowsPerPage,
    ).then((response) => {
      setServicePage(response.data.content);
      setServicePageAllElements(response.data.totalElements);
    });
  };

  const handleClickOpen = () => {
    setServiceFormOpen(true);
  };

  const handleClose = () => {
    setServiceFormOpen(false);
  };

  useEffect(() => {
    setUserId(AuthService.getCurrentUserId());
  }, []);

  useEffect(() => {
    handleGetingUserBuildings(userId);
  }, [userId]);

  useEffect(() => {
    handleGettingBuildingServices(
      chosenBuildingId,
      servicePageNumber,
      serviceRowsPerPage,
    );
  }, [chosenBuildingId, servicePageNumber, serviceRowsPerPage]);

  return (
    <>
      <Navbar />
      <UserAccount />
      <div id="building-autocomplete">
        <text id="choose-building-header">Wybierz budynek:</text>
        <Autocomplete
          {...flatProps}
          autoComplete
          disablePortal
          autoHighlight
          id="combo-box-demo"
          sx={{ width: 1000 }}
          value={chosenBuilding}
          onChange={(event, newValue) => {
            setChosenBuilding(newValue);
            setChosenBuildingId(newValue.id);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Buildings" id={params.id} />
          )}
        />
      </div>
      <div className="add-service-button">
        <Icon
          className="return-icon"
          icon="mdi:file-document-plus-outline"
          color="#4e4e4e"
          height="21"
        />
        <Button
          sx={{
            color: '#ffffff',
          }}
          onClick={handleClickOpen}
        >
          Dodaj zamówienie
        </Button>
      </div>
      <text id="service-details-header">Dane dotyczące zamówienia:</text>
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
      {servicePage.map((data) => {
        return (
          <div id={`${data.id}`} className="service-details-component">
            <ServiceDetailsForm
              id={data.id}
              date={data.date}
              buildingId={chosenBuildingId}
              description={data.description}
              mustCreate={false}
              handleFormClose={() => {
                return false;
              }}
            />
          </div>
        );
      })}
      <div id="chat-component">
        {chosenBuildingId !== 0 ? (
          <Chat buildingId={chosenBuildingId} userId={userId} />
        ) : null}
      </div>
      {servicePage.map((data) => {
        return (
          <div id={`${data.id}`} className="offer-details-component">
            <OfferDetailsForm serviceId={data.id} isEditable={false} />
          </div>
        );
      })}
      <Footer />
      <Dialog
        sx={{
          width: '1152px',
          height: '612px',
          alignItems: 'center',
          marginLeft: '193px',
          marginTop: '20px',
        }}
        open={serviceFormOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            padding: '0',
            backgroundColor: '#90ff38',
            alignItems: 'center',
          }}
        >
          <ServiceDetailsForm
            id={0}
            date={''}
            buildingId={chosenBuildingId}
            description={''}
            mustCreate={true}
            handleFormClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
