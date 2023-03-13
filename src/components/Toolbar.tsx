import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import classNames from "classnames";
import { Button } from "./core";
import {
  CheckIcon,
  CreateIcon,
  DeleteIcon,
  EditIcon,
  FilterIcon,
} from "./icons";
import { FilterType, FilterModal, Instrument } from "./FilterModal";
import {
  addFilter,
  deleteFilter,
  getActiveFilter,
  getFilter,
  getFilters,
  setActiveFilter,
} from "../util/localStorage";

import "./Toolbar.css";

type FilterItemProps = {
  onDelete: () => void;
  onEdit: () => void;
  selected: boolean;
  text: string;
};

/**
 * Filter Menu item for custom filters
 */
function FilterItem(props: FilterItemProps): JSX.Element {
  const { onDelete, onEdit, selected, text } = props;

  const checkIcon = useMemo((): React.ReactNode => {
    return selected ? (
      <CheckIcon className="filter-menu-selected-icon" fontSize="small" />
    ) : (
      <></>
    );
  }, [selected]);

  const actionButtons = useMemo((): React.ReactNode => {
    return (
      <div>
        <IconButton className="filter-menu-custom-action" onClick={onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton className="filter-menu-custom-action" onClick={onDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    );
  }, [onDelete, onEdit]);

  return (
    <>
      {checkIcon}
      <ListItemText
        className={classNames("filter-menu-custom", {
          "filter-menu-custom-selected": selected,
        })}
        disableTypography={true}
        inset
      >
        {text}
        {actionButtons}
      </ListItemText>
    </>
  );
}

type ToolbarProps = {
  instruments: Instrument[];
  updateFilter: (assets: string[]) => void;
};

/**
 * Toolbar containing the Filter menu/button
 */
export function Toolbar(props: ToolbarProps): JSX.Element {
  const { instruments, updateFilter } = props;

  const [filters, setFilters] = useState<FilterType[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [filter, setFilter] = useState<FilterType | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    getActiveFilter()
  );

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => setModalOpen(false);

  // TODO - Consider moving Menu to Button (say <Button menu={...}>), so some of this overloaded component can be simplified.

  const selectActiveFilter = useCallback(
    function (name: string) {
      setActiveFilter(name);
      setSelectedFilter(name);
      updateFilter(getFilter(name)?.assets ?? []);
    },
    [updateFilter]
  );

  const openMenu = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const selectMenuItem = useCallback(
    (name: string) => {
      selectActiveFilter(name);
      setAnchorEl(null);
    },
    [selectActiveFilter]
  );

  const handleNewFilter = useCallback(() => {
    setFilter(null);
    setModalOpen(true);
    setAnchorEl(null);
  }, []);

  const handleEdit = useCallback((name: string) => {
    setFilter(getFilter(name));
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((name: string) => {
    deleteFilter(name);
    setFilters(getFilters);
  }, []);

  const handleFilterSave = useCallback(
    (filter: FilterType): void => {
      addFilter(filter);
      setFilters(getFilters());
      setModalOpen(false);
      selectActiveFilter(filter.name);
    },
    [selectActiveFilter]
  );

  useEffect(() => {
    setFilters(getFilters());
  }, []);

  const divider = useMemo(
    (): React.ReactNode => (filters.length > 0 ? <Divider /> : null),
    [filters.length]
  );

  const newFilter = useMemo((): React.ReactNode => {
    return (
      <MenuItem onClick={handleNewFilter}>
        <CreateIcon fontSize="small" />
        New Filter
      </MenuItem>
    );
  }, [handleNewFilter]);

  return (
    <div className="filter-toolbar">
      <Button icon={<FilterIcon />} onClick={openMenu}>
        Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        className="filter-menu"
        open={open}
        onClose={closeMenu}
      >
        {filters.map(({ name }) => (
          <MenuItem key={name} onClick={() => selectMenuItem(name)}>
            <FilterItem
              onDelete={() => handleDelete(name)}
              onEdit={() => handleEdit(name)}
              selected={selectedFilter === name}
              text={name}
            />
          </MenuItem>
        ))}
        {divider}
        {newFilter}
      </Menu>

      <FilterModal
        instruments={instruments}
        filter={filter}
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleFilterSave}
      />
    </div>
  );
}
