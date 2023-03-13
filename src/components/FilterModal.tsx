import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Modal } from "./core";
import { getRandomUUID } from "../util/uuid";

export type Instrument = {
  instrument_name: string;
  price_change: number;
  mark_price: number;
  volume_notional: number;
};

export type FilterType = {
  id: string;
  name: string;
  assets: string[];
};

type FilterModalProps = {
  instruments: Instrument[];
  filter: FilterType | null;
  open: boolean;
  onClose: () => void;
  onSave: (filter: FilterType) => void;
};

/**
 * Modal to create a new filter or edit an existing filter
 */
export function FilterModal(props: FilterModalProps): JSX.Element {
  const { filter, instruments, open, onClose, onSave } = props;
  const [name, setName] = useState<string>(filter?.name ?? "");
  const [assets, setAssets] = useState<string[]>(filter?.assets ?? []);

  // TODO - Handle errors and validation later
  /*
  const [nameError, setNameError] = useState<string | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);

  const checkErrors = useCallback(() => {
    if (name === "") {
      setNameError("Filter name cannot be empty.");
    } else if (!filter?.id && getFilter(name) !== null) {
      setNameError(
        `Filter name ${name} already exists. Please use a different name.`
      );
    } else {
      setNameError(null);
    }

    if (assets.length === 0) {
      setAssetError("Please select atleast one asset to create a filter.");
    } else {
      setAssetError(null);
    }

    return nameError === null && assetError === null;
  }, [assetError, assets, filter?.id, name, nameError]);
  */

  useEffect(() => {
    if (open) {
      setName(filter?.name ?? "");
      setAssets(filter?.assets ?? []);
    }
  }, [filter, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      onSave={() =>
        onSave({
          id: filter?.id ?? getRandomUUID(),
          name,
          assets,
        })
      }
      title="Create Filter"
    >
      <TextField
        className="filter-name"
        label="Filter Name"
        placeholder="Filter Name"
        size="small"
        value={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setName(event.target.value);
        }}
      />
      <Autocomplete
        multiple
        options={instruments.map((instrument) => instrument.instrument_name)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Assets"
            placeholder="Select Asset"
            size="small"
          />
        )}
        value={assets}
        onChange={(event, newValue: string[]) => {
          setAssets(newValue);
        }}
      />
    </Modal>
  );
}
