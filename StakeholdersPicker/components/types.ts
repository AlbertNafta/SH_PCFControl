// types.ts
import { IColumn, Selection } from "@fluentui/react/lib/DetailsList";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export interface StakeholderManagementProps {
  context: ComponentFramework.Context<IInputs>;
  opportunityId: string;
  notifyOutputChanged: () => void;
}

export interface IStakeholder {
  stakeholderId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isSelected: boolean;
}