import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const RecipesTable = () => {
  return (
    <div className="w-full md:w-3/5 mt-4 md:mt-0">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>RECIPE NAME</TableHead>
            <TableHead>DIFFICULTY</TableHead>
            <TableHead>PREPARATION TIME</TableHead>
            <TableHead>DETAILS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{/* From database */}</TableBody>
      </Table>
    </div>
  );
};
