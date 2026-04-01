import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./badge";

interface TableActionsProps {
  sets: { reps: number; weight: number }[];
  prevSets?: { reps: number; weight: number }[];
}

export function TableActions({ sets = [], prevSets = [] }: TableActionsProps) {
  const nextSetIndex = sets.length;
  const prevSet = prevSets[nextSetIndex];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Set</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...sets].reverse().map((set, reversedIndex) => {
          const originalIndex = sets.length - 1 - reversedIndex;
          return (
            <TableRow key={originalIndex}>
              <TableCell className="font-medium">
                <Badge variant="default">{originalIndex + 1}</Badge>
              </TableCell>
              <TableCell>{set.reps}</TableCell>
              <TableCell>{set.weight}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
        {prevSet && (
          <TableRow className="opacity-60 bg-muted/30">
            <TableCell className="font-medium">
              <Badge variant="secondary">Prev {nextSetIndex + 1}</Badge>
            </TableCell>
            <TableCell>{prevSet.reps}</TableCell>
            <TableCell>{prevSet.weight}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" className="size-8" disabled>
                <MoreHorizontalIcon className="opacity-50" />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
