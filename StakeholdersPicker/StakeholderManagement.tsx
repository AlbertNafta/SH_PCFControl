// StakeholderManagement.tsx
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Selection } from "@fluentui/react/lib/DetailsList";
import { IStakeholder, StakeholderManagementProps } from "./components/types";
import { StakeholderUI } from "./components/StakeholderUI";
import { StakeholderDataService } from "./components/dataService";
import { StakeholderOperations } from "./components/stakeholderOperations";

export const StakeholderManagement: React.FC<StakeholderManagementProps> = (
  props
) => {
  const { context, opportunityId, notifyOutputChanged } = props;

  const [stakeholders, setStakeholders] = useState<IStakeholder[]>([]);
  const [linkedStakeholders, setLinkedStakeholders] = useState<IStakeholder[]>(
    []
  );
  const [filteredStakeholders, setFilteredStakeholders] = useState<
    IStakeholder[]
  >([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);

  // Selection for multi-select functionality
  const addSelection = useRef<Selection>(new Selection()).current;
  const selection = useRef<Selection>(new Selection()).current;

  // Create services
  const dataService = new StakeholderDataService(context);
  const stakeholderOps = new StakeholderOperations(
    dataService,
    opportunityId,
    setIsLoading,
    setError,
    notifyOutputChanged
  );

  // Load stakeholders and linked stakeholders when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all stakeholders
        const allStakeholdersData = await dataService.loadAllStakeholders(searchText);
        setStakeholders(allStakeholdersData);

        // Load linked stakeholders for this opportunity
        if (opportunityId) {
          const linkedData = await dataService.loadLinkedStakeholders(opportunityId);
          setLinkedStakeholders(linkedData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load stakeholders. Please try again.");
        setIsLoading(false);
      }
    };

    loadData();
  }, [opportunityId, context.webAPI]);

  // Filter stakeholders based on search text and linked stakeholder
  useEffect(() => {
    const filtered = stakeholders
      .filter(
        (stakeholder) =>
          stakeholder.name.toLowerCase().includes(searchText.toLowerCase()) ||
          stakeholder.email.toLowerCase().includes(searchText.toLowerCase()) ||
          stakeholder.phone.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter(
        (s) => !linkedStakeholders.some((l) => l.stakeholderId === s.stakeholderId)
      );

    setFilteredStakeholders(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchText, stakeholders, linkedStakeholders]);

  // Handle search input change
  const handleSearchChange = (newValue?: string) => {
    setSearchText(newValue || "");
  };

  // Add stakeholder to opportunity
  const addStakeholder = async (stakeholder: IStakeholder) => {
    await stakeholderOps.addStakeholderToOpportunity(
      stakeholder,
      linkedStakeholders,
      setLinkedStakeholders
    );
  };

  // Remove selected stakeholders from opportunity
  const removeSelectedStakeholders = async () => {
    await stakeholderOps.removeSelectedStakeholders(
      selection,
      linkedStakeholders,
      setLinkedStakeholders
    );
  };

  // Link selected stakeholders to opportunity
  const linkSelectedStakeholders = async () => {
    await stakeholderOps.linkSelectedStakeholders(
      addSelection,
      linkedStakeholders,
      setLinkedStakeholders
    );
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStakeholders.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <StakeholderUI
      isLoading={isLoading}
      error={error}
      setError={setError}
      linkedStakeholders={linkedStakeholders}
      currentItems={currentItems}
      filteredStakeholders={filteredStakeholders}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      paginate={paginate}
      handleSearchChange={handleSearchChange}
      searchText={searchText}
      addStakeholder={addStakeholder}
      removeSelectedStakeholders={removeSelectedStakeholders}
      linkSelectedStakeholders={linkSelectedStakeholders}
      addSelection={addSelection}
      selection={selection}
    />
  );
};