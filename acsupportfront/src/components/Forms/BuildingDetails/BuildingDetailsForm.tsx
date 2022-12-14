import React from "react";
import { Select, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";

import "./BuildingDetailsForm.scss";

export type buildingDetailsFormProp = {
  id: number;
  name: string;
  type: string;
  street: string;
  postCode: string;
  city: string;
  region: string;
  additionalInfo: string;
};

const styles = makeStyles({
  notchedOutline: { borderColor: "#f0f !important" },
});

export function BuildingDetailsForm({
  id,
  name,
  type,
  street,
  postCode,
  city,
  region,
  additionalInfo,
}: buildingDetailsFormProp) {
  const exampleBuilding = require("../../../images/exampleBuilding.jpg");
  const style = styles();

  console.log(name)
  console.log(street)
  console.log(postCode)
  return (
    <>
      <div className="building-details-form">
        <div className="building-name-form">
          <text className="building-form-header">Nazwa budynku</text>
          <TextField
            label="Nazwa budynku"
            variant="filled"
            fullWidth
            value={name}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="building-type">
          <text className="building-form-header">Typ budynku</text>
          <Select id="building-type-text" size="small" />
        </div>
        <div className="building-street">
          <text className="building-form-header">Ulica</text>
          <TextField
            className="building-form-header"
            label="Ulica"
            variant="filled"
            fullWidth
            value={street}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="building-post-code">
          <text className="building-form-header">Kod pocztowy</text>
          <TextField
            className="building-form-header"
            label="Kod pocztowy"
            variant="filled"
            fullWidth
            value={postCode}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="building-city">
          <text className="building-form-header">Miasto</text>
          <TextField
            className="building-form-header"
            label="Miasto"
            variant="filled"
            fullWidth
            value={city}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="building-region">
          <text className="building-form-header">Wojew??dztwo</text>
          <TextField
            id="building-region-text"
            label="Wojew??dztwo"
            variant="filled"
            fullWidth
            value={region}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="building-form-img">
          <img
            src={exampleBuilding}
            width="280"
            height="170"
            className="building-form-image"
          />
        </div>
        <div className="building-additional-info">
          <text className="building-form-header">
            Dodatkowe informacje o budynku
          </text>
          <TextField
            className="building-form-header"
            label="Dodatkowe informacje o budynku"
            variant="filled"
            fullWidth
            multiline
            value={additionalInfo}
            inputProps={{
              readOnly: true,
              style: {
                height: "122px",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
