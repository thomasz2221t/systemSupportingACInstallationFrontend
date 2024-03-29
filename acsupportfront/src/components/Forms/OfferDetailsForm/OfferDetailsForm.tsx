import React, { useEffect, useState } from 'react';
import { Autocomplete, Button, Checkbox, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import OfferService from 'services/OfferService';
import { UserType } from 'types/UserType';
import OfferType from 'types/OfferType';
import InstallerEquipmentType from 'types/InstallerEquipmentType';
import { OfferStatusType } from 'enums/OfferStatusType';
import InstallerEquipmentService from 'services/InstallerEquipmentService';
import AuthService from 'services/auth/AuthService';

import './OfferDetailsForm.scss';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export type OfferDetailsFormPropType = {
  serviceId: number;
  isEditable: boolean;
  handleFormClose?: () => void;
};

export default function OfferDetailsForm({
  serviceId,
  isEditable,
}: OfferDetailsFormPropType) {
  let today = new Date();

  let defaultDateBeginning =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0') +
    'T' +
    String(today.getHours()).padStart(2, '0') +
    ':' +
    String(today.getMinutes()).padStart(2, '0');

  let defaultDateEnd =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0') +
    'T' +
    String(today.getHours() + 1).padStart(2, '0') +
    ':' +
    String(today.getMinutes()).padStart(2, '0');

  const [currentUserId, setCurrentUserId] = useState<number>(0);
  const [offerBody, setOfferBody] = useState<OfferType>({
    id: 0,
    cost: 0,
    datesBegining: defaultDateBeginning,
    datesEnd: defaultDateEnd,
    statusType: '',
  });
  const [userBody, setUserBody] = useState<UserType>({
    id: 0,
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
  });
  const [equipmentPage, setEquipmentPage] = useState<InstallerEquipmentType[]>(
    [],
  );
  const [equipmentUnit, setEquipmentUnit] = useState<any>([]);
  const [didOfferStateChanged, setDidOfferStateChanged] =
    useState<boolean>(false);

  const handleGettingUserById = async (offerId: number) => {
    return await OfferService.getFindUserAssignedToOffer(offerId).then(
      (response) => {
        setUserBody(response.data);
      },
    );
  };

  const handleGettingOfferEquipment = async (offerId: number) => {
    return await OfferService.getFindAllEquipmentInOffer(offerId).then(
      (response) => {
        setEquipmentUnit(response.data.content);
      },
    );
  };

  const handleGettingOfferData = async (serviceId: number) => {
    await OfferService.getFindOfferByServiceId(serviceId).then((response) => {
      setOfferBody(response.data);
      const offerId = response.data.id;
      handleGettingOfferEquipment(offerId).then(() => {
        handleGettingUserById(offerId);
      });
    });
  };

  const handleGettingAllInstallerEquipment = async () => {
    return await InstallerEquipmentService.getFindAllInstallerEquipment().then(
      (response) => {
        setEquipmentPage(response.data.content);
      },
    );
  };

  const handleChangingOfferStatus = async (
    serviceId: number,
    statusType: OfferStatusType,
  ) => {
    await OfferService.patchUpdateOfferStatus(serviceId, statusType).then(
      () => {
        setDidOfferStateChanged(!didOfferStateChanged);
      },
    );
  };

  const handleUpdatingOfferUser = async (offerId: number, userId: number) => {
    return await OfferService.patchAssingUserToOffer(offerId, userId);
  };

  const handleUpdatingOfferInstallerEquipment = async (
    offerId: number,
    equipmentId: number,
  ) => {
    return await OfferService.patchAssignEquipmentToOffer(offerId, equipmentId);
  };

  const handleUpdatingOfferBody = async (offerBody: OfferType) => {
    return await OfferService.patchUpdateOffer(offerBody);
  };

  const handleDeletingOldOfferEquipment = async (offerId: number) => {
    return await OfferService.deleteAllOfferEquipment(offerId);
  };

  const updateOffer = () => {
    handleUpdatingOfferBody(offerBody).then(() => {
      handleUpdatingOfferUser(offerBody.id, currentUserId).then(() => {
        handleDeletingOldOfferEquipment(offerBody.id).then(() => {
          equipmentUnit.map(
            (equipment: {
              id: number;
              name: string;
              price: number;
              producer: string;
              description: string;
            }) => {
              handleUpdatingOfferInstallerEquipment(offerBody.id, equipment.id);
            },
          );
        });
      });
      setDidOfferStateChanged(!didOfferStateChanged);
    });
  };

  useEffect(() => {
    setOfferBody({
      id: 0,
      cost: 0,
      datesBegining: defaultDateBeginning,
      datesEnd: defaultDateEnd,
      statusType: '',
    });
    setUserBody({
      id: 0,
      login: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
    });
    setEquipmentUnit([]);
    handleGettingOfferData(serviceId);
    handleGettingAllInstallerEquipment();
  }, [serviceId, didOfferStateChanged]);

  useEffect(() => {
    setCurrentUserId(AuthService.getCurrentUserId());
  }, []);

  return !isEditable ? (
    <>
      <div className="offer-details-form">
        <div className="operator-data-form">
          <text className="offer-form-header">Operator</text>
          <TextField
            label="Operator:"
            variant="filled"
            fullWidth
            value={`${userBody.firstName} ${userBody.lastName}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="components-required-form">
          <text className="offer-form-header">
            Komonenty potrzebne do instalacji
          </text>
          <Autocomplete
            autoComplete
            multiple
            fullWidth
            readOnly
            options={equipmentPage}
            value={equipmentUnit}
            disableCloseOnSelect
            getOptionLabel={(option) => {
              if (option) {
                return option.name;
              }
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Komponenty" />
            )}
          />
        </div>
        <div className="offer-cost-form">
          <text>Szacowany koszt wykonania usługi</text>
          <TextField
            label="Szacowany koszt wykonania usługi"
            variant="filled"
            fullWidth
            value={offerBody.cost}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="offer-date-beginning-form">
          <text>Proponowane rozpoczęcie usługi</text>
          <TextField
            id="datetime-select"
            type="datetime-local"
            value={offerBody.datesBegining}
            inputProps={{ readOnly: true }}
          />
        </div>
        <div className="offer-date-end-form">
          <text>Proponowane zakończenie usługi</text>
          <TextField
            id="datetime-select"
            type="datetime-local"
            value={offerBody.datesEnd}
            inputProps={{ readOnly: true }}
          />
        </div>
        <div className="offer-status-form">
          <text>Status oferty</text>
          <TextField
            label="Status oferty"
            variant="filled"
            fullWidth
            value={offerBody.statusType}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="offer-action-buttons">
          <Button
            sx={{
              width: '300px',
              marginLeft: '10px',
              color: '#ffffff',
              background: '#90FF38',
              borderRadius: 18,
            }}
            onClick={() => {
              handleChangingOfferStatus(serviceId, OfferStatusType.ACCEPTED);
            }}
          >
            Przyjmij oferte
          </Button>
          <Button
            sx={{
              width: '300px',
              marginLeft: '20px',
              color: '#ffffff',
              background: '#FF0707',
              borderRadius: 18,
            }}
            onClick={() => {
              handleChangingOfferStatus(serviceId, OfferStatusType.REJECTED);
            }}
          >
            Odrzuć oferte
          </Button>
          <Button
            sx={{
              width: '300px',
              marginLeft: '20px',
              color: '#ffffff',
              background: '#D6E900',
              borderRadius: 18,
            }}
            onClick={() => {
              handleChangingOfferStatus(
                serviceId,
                OfferStatusType.CHANGES_REQUIRED,
              );
            }}
          >
            Zaproponuj zmiany
          </Button>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="offer-details-form">
        <div className="operator-data-form">
          <text className="offer-form-header">Operator</text>
          <TextField
            label="Operator:"
            variant="filled"
            fullWidth
            value={`${userBody.firstName} ${userBody.lastName}`}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="components-required-form">
          <text className="offer-form-header">
            Komonenty potrzebne do instalacji
          </text>
          <Autocomplete
            autoComplete
            multiple
            fullWidth
            freeSolo
            options={equipmentPage}
            value={equipmentUnit}
            onChange={(event, newValue) => {
              setEquipmentUnit(newValue);
            }}
            disableCloseOnSelect
            getOptionLabel={(option) => {
              if (option) {
                return option.name;
              }
            }}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Komponenty" />
            )}
          />
        </div>
        <div className="offer-cost-form">
          <text>Szacowany koszt wykonania usługi</text>
          <TextField
            label="Szacowany koszt wykonania usługi"
            variant="filled"
            fullWidth
            value={offerBody.cost}
            InputProps={{
              readOnly: false,
            }}
            onChange={(e) =>
              setOfferBody({
                ...offerBody,
                cost: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="offer-date-beginning-form">
          <text>Proponowane rozpoczęcie usługi</text>
          <TextField
            id="datetime-select"
            type="datetime-local"
            value={offerBody.datesBegining}
            inputProps={{ readOnly: false }}
            onChange={(e) =>
              setOfferBody({
                ...offerBody,
                datesBegining: e.target.value,
              })
            }
          />
        </div>
        <div className="offer-date-end-form">
          <text>Proponowane zakończenie usługi</text>
          <TextField
            id="datetime-select"
            type="datetime-local"
            value={offerBody.datesEnd}
            inputProps={{ readOnly: false }}
            onChange={(e) =>
              setOfferBody({
                ...offerBody,
                datesEnd: e.target.value,
              })
            }
          />
        </div>
        <div className="offer-status-form">
          <text>Status oferty</text>
          <TextField
            label="Status oferty"
            variant="filled"
            fullWidth
            value={offerBody.statusType}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="offer-action-buttons">
          <Button
            sx={{
              width: '300px',
              marginLeft: '10px',
              color: '#000000',
              background: '#ffab07',
              borderRadius: 18,
            }}
            onClick={() => {
              setDidOfferStateChanged(!didOfferStateChanged);
            }}
          >
            ODŚWIEŻ OFERTĘ
          </Button>
          <Button
            sx={{
              width: '300px',
              marginLeft: '10px',
              color: '#000000',
              background: '#d6e900',
              borderRadius: 18,
            }}
            onClick={() => {
              updateOffer();
              handleChangingOfferStatus(serviceId, OfferStatusType.NEW_OFFER);
            }}
          >
            WYŚLIJ OFERTĘ
          </Button>
        </div>
      </div>
    </>
  );
}
