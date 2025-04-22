// SimplePagination.tsx
import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { PaginationProps } from "./types";

export const SimplePagination: React.FC<PaginationProps> = ({
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