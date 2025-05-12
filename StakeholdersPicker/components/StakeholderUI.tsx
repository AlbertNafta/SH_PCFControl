// StakeholderUI.tsx
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { DetailsList, SelectionMode, Selection } from "@fluentui/react/lib/DetailsList";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { Stack, IStackTokens } from "@fluentui/react/lib/Stack";
import { SimplePagination } from "./SimplePagination";
import { getStakeholderColumns } from "./columnConfig";
import { IStakeholder } from "./types";

interface StakeholderUIProps {
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  linkedStakeholders: IStakeholder[];
  currentItems: IStakeholder[];
  filteredStakeholders: IStakeholder[];
  itemsPerPage: number;
  currentPage: number;
  paginate: (page: number) => void;
  handleSearchChange: (value?: string) => void;
  searchText: string;
  addStakeholder: (stakeholder: IStakeholder) => void;
  removeSelectedStakeholders: () => void;
  linkSelectedStakeholders: () => void;
  addSelection: Selection;
  selection: Selection;
}

export const StakeholderUI: React.FC<StakeholderUIProps> = ({
  isLoading,
  error,
  setError,
  linkedStakeholders,
  currentItems,
  filteredStakeholders,
  itemsPerPage,
  currentPage,
  paginate,
  handleSearchChange,
  searchText,
  addStakeholder,
  removeSelectedStakeholders,
  linkSelectedStakeholders,
  addSelection,
  selection,
}) => {
  const columns = getStakeholderColumns();
  const stackTokens: IStackTokens = { childrenGap: 10 };

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
            <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", paddingRight: 8 }}>
              <DetailsList
                items={linkedStakeholders}
                columns={columns.filter((col) => col.key !== "select")}
                selection={selection}
                selectionMode={SelectionMode.multiple}
                compact={true}
              />
            </div>

            <PrimaryButton
              text="Remove Selected Stakeholders"
              onClick={removeSelectedStakeholders}
              disabled={isLoading}
            />
          </>
        )}

        <h2>Add Stakeholders</h2>
        <SearchBox
          placeholder="Search stakeholders by name, email, or phone"
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
              selectionMode={SelectionMode.multiple}
              selection={addSelection}
              selectionPreservedOnEmptyClick={true}
              compact={true}
              onItemInvoked={addStakeholder}
            />
            <PrimaryButton
              text="Link Selected Stakeholders"
              onClick={linkSelectedStakeholders}
              disabled={isLoading}
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