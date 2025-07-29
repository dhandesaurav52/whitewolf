
"use client";

import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleTableRowProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const CollapsibleTableRow: React.FC<CollapsibleTableRowProps> = ({ children, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  // The first child is the expand icon, the rest are the main row cells
  const rowCells = React.Children.toArray(children);

  return (
    <>
      <TableRow onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <TableCell className="w-8">
            <Button variant="ghost" size="icon" className="h-8 w-8">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
        </TableCell>
        {rowCells}
      </TableRow>
      {isOpen && (
        <TableRow>
          <TableCell colSpan={React.Children.count(children) + 1}>
            {content}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default CollapsibleTableRow;
