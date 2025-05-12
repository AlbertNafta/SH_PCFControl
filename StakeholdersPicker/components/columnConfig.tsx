// columnConfig.ts
import * as React from "react";
import { IColumn } from "@fluentui/react/lib/DetailsList";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { IStakeholder } from "./types";

export const getStakeholderColumns = (): IColumn[] => {
  return [
    {
      key: "select",
      name: "",
      minWidth: 40,
      maxWidth: 40,
      onRender: (item: IStakeholder) => <Checkbox checked={item.isSelected} />,
      isMultiline: false,
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
      key: "phone",
      name: "Phone",
      fieldName: "phone",
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
};