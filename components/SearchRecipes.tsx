import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SearchRecipes = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Navigation Bar */}
      <nav className="mb-8 flex items-center justify-between">
        <div className="text-xl font-bold">Kanapka AI</div>
        <div className="flex gap-4">
          <Button variant="default">WYSZUKAJ RECEPTURY</Button>
          <Button variant="outline">LOGOWANIE</Button>
          <Button variant="outline">REJESTRACJA</Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex gap-4">
        {/* Left Section - Textarea */}
        <div className="w-2/5">
          <Textarea
            className="min-h-[400px]"
            placeholder="Wpisz składniki..."
          />
          <div className="mt-4 flex justify-between">
            <Button variant="outline">Wyczyść</Button>
            <Button>Szukaj</Button>
          </div>
        </div>

        {/* Right Section - Table */}
        <div className="w-3/5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAZWA RECEPTURY</TableHead>
                <TableHead>TRUDNOŚĆ POTRAWY</TableHead>
                <TableHead>ŁĄCZNY CZAS PRZYGOTOWANIA</TableHead>
                <TableHead>SZCZEGÓŁY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Table content will be added dynamically */}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
