// StakeholderManagement.tsx
import * as React from "react";
import { useState, useEffect } from "react";
import { TextField } from "@fluentui/react/lib/TextField";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import {
  DetailsList,
  SelectionMode,
  IColumn,
  Selection,
} from "@fluentui/react/lib/DetailsList";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { mockStakeholders } from "./mockStakeholders";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const SimplePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <DefaultButton
        text="<"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
      />
      <span style={{ padding: "5px" }}>
        {currentPage} / {totalPages}
      </span>
      <DefaultButton
        text=">"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
      />
    </Stack>
  );
};

interface StakeholderManagementProps {
  context: ComponentFramework.Context<IInputs>;
  opportunityId: string;
  notifyOutputChanged: () => void;
}

interface StakeholderManagementProps {
  context: ComponentFramework.Context<IInputs>;
  opportunityId: string;
  notifyOutputChanged: () => void;
}

interface IStakeholder {
  stakeholderId: string;
  name: string;
  email: string;
  company: string;
  role: string;
  isSelected: boolean;
}

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
  const selection = new Selection({
    onSelectionChanged: () => {
      const selectedItems = selection.getSelection() as IStakeholder[];
      const updatedLinkedStakeholders = linkedStakeholders.map(
        (stakeholder) => {
          return {
            ...stakeholder,
            isSelected: selectedItems.some(
              (item) => item.stakeholderId === stakeholder.stakeholderId
            ),
          };
        }
      );
      setLinkedStakeholders(updatedLinkedStakeholders);
    },
  });

  const stackTokens: IStackTokens = { childrenGap: 10 };

  // Columns for the DetailsList
  const columns: IColumn[] = [
    {
      key: "select",
      name: "",
      minWidth: 40,
      maxWidth: 40,
      onRender: (item: IStakeholder) => <Checkbox checked={item.isSelected} />,
    },
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "email",
      name: "Email",
      fieldName: "email",
      minWidth: 150,
      isResizable: true,
    },
    {
      key: "company",
      name: "Company",
      fieldName: "company",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "role",
      name: "Role",
      fieldName: "role",
      minWidth: 100,
      isResizable: true,
    },
  ];
  const useMockData = true;
 const allStakeholdersResponse = {
    entities: mockStakeholders
  };

  // Load stakeholders and linked stakeholders when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load all stakeholders
        //  allStakeholdersResponse = await context.webAPI.retrieveMultipleRecords(
        //   "cre97_stakeholder", // Assuming stakeholders are contacts
        //   "?$select=cre97_stakeholderid,cre97_name,cre97_email,cre97_phone,cre97_role&$filter=contains(cre97_name, '" + searchText + "')"
        // );

        // const allStakeholdersTest = await context.webAPI.retrieveMultipleRecords("cre97_stakeholder", "?$top=5");
        // console.log("Test",allStakeholdersTest);

        // console.log("TestII",allStakeholdersResponse);

        const allStakeholdersData = allStakeholdersResponse.entities.map(
          (entity) => ({
            stakeholderId: entity.cre97_stakeholderid,
            name: entity.cre97_name || "",
            email: entity.cre97_email || "",
            company: entity.cre97_phone || "",
            role: entity.cre97_role || "",
            isSelected: false,
          })
        );

        setStakeholders(allStakeholdersData);

        // Load linked stakeholders for this opportunity

        if (opportunityId) {
          const relationshipName = "opportunity_contact"; // Update with your actual N:N relationship name

          const linkedResponse = await context.webAPI.retrieveMultipleRecords(
            "cre97_stakeholder",
            `?$select=cre97_stakeholderid,cre97_name,cre97_email,cre97_phone,cre97_role&$filter=opportunity_contact/any(o:o/opportunityid eq ${opportunityId})`
          );

          const linkedData = linkedResponse.entities.map((entity) => ({
            stakeholderId: entity.cre97_stakeholderid,
            name: entity.cre97_name || "",
            email: entity.cre97_email || "",
            company: entity.cre97_phone || "",
            role: entity.cre97_role || "",
            isSelected: false,
          }));

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

  // Filter stakeholders based on search text
  useEffect(() => {
    const filtered = stakeholders.filter(
      (stakeholder) =>
        stakeholder.name.toLowerCase().includes(searchText.toLowerCase()) ||
        stakeholder.email.toLowerCase().includes(searchText.toLowerCase()) ||
        stakeholder.company.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredStakeholders(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchText, stakeholders]);

  // Handle search input change
  const handleSearchChange = (newValue?: string) => {
    setSearchText(newValue || "");
  };

  // Add stakeholder to opportunity
  const addStakeholder = async (stakeholder: IStakeholder) => {
    try {
      // Check if stakeholder is already linked
      if (
        linkedStakeholders.some(
          (s) => s.stakeholderId === stakeholder.stakeholderId
        )
      ) {
        setError("This stakeholder is already linked to this opportunity.");
        return;
      }

      setIsLoading(true);

      // Create association between opportunity and stakeholder
      await context.webAPI.createRecord("opportunity_contact", {
        opportunityid: { entityType: "opportunity", id: opportunityId },
        cre97_stakeholderid: {
          entityType: "contact",
          id: stakeholder.stakeholderId,
        },
      });

      // Update state to include the newly linked stakeholder
      setLinkedStakeholders([
        ...linkedStakeholders,
        { ...stakeholder, isSelected: false },
      ]);
      setError(null);
      notifyOutputChanged();
    } catch (error) {
      console.error("Error adding stakeholder:", error);
      setError("Failed to add stakeholder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove selected stakeholders from opportunity
  const removeSelectedStakeholders = async () => {
    try {
      const selectedStakeholders = linkedStakeholders.filter(
        (s) => s.isSelected
      );

      if (selectedStakeholders.length === 0) {
        setError("Please select at least one stakeholder to remove.");
        return;
      }

      setIsLoading(true);

      // Delete associations for all selected stakeholders
      for (const stakeholder of selectedStakeholders) {
        await context.webAPI.deleteRecord(
          "opportunity_contact",
          `(opportunityid=${opportunityId},cre97_stakeholderid=${stakeholder.stakeholderId})`
        );
      }

      // Update state to remove the unlinked stakeholders
      const updatedLinkedStakeholders = linkedStakeholders.filter(
        (s) => !s.isSelected
      );
      setLinkedStakeholders(updatedLinkedStakeholders);
      setError(null);
      notifyOutputChanged();
    } catch (error) {
      console.error("Error removing stakeholders:", error);
      setError("Failed to remove stakeholders. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
    <div className="stakeholder-management">
      <Stack tokens={stackTokens}>
        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => setError(null)}
            dismissButtonAriaLabel="Close"
          >
            {error}
          </MessageBar>
        )}

        <h2>Linked Stakeholders</h2>
        {isLoading && linkedStakeholders.length === 0 ? (
          <Spinner
            size={SpinnerSize.medium}
            label="Loading linked stakeholders..."
          />
        ) : (
          <>
            <DetailsList
              items={linkedStakeholders}
              columns={columns}
              selection={selection}
              selectionMode={SelectionMode.multiple}
              selectionPreservedOnEmptyClick={true}
              compact={true}
            />

            <PrimaryButton
              text="Remove Selected Stakeholders"
              onClick={removeSelectedStakeholders}
              disabled={
                isLoading ||
                linkedStakeholders.filter((s) => s.isSelected).length === 0
              }
            />
          </>
        )}

        <h2>Add Stakeholders</h2>
        <SearchBox
          placeholder="Search stakeholders by name, email, or company"
          onChange={(_, newValue) => handleSearchChange(newValue)}
          value={searchText}
        />

        {isLoading && searchText ? (
          <Spinner
            size={SpinnerSize.medium}
            label="Searching stakeholders..."
          />
        ) : (
          <>
            <DetailsList
              items={currentItems}
              columns={columns.filter((col) => col.key !== "select")}
              selectionMode={SelectionMode.none}
              compact={true}
              onItemInvoked={addStakeholder}
            />

            {filteredStakeholders.length > itemsPerPage && (
              <SimplePagination
                currentPage={currentPage}
                totalPages={Math.ceil(
                  filteredStakeholders.length / itemsPerPage
                )}
                onChange={paginate}
              />
            )}
          </>
        )}
      </Stack>
    </div>
  );
};
