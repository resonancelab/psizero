import { Check, ChevronsUpDown, Building } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { useState } from "react";

export function OrganizationSwitcher() {
  const [open, setOpen] = useState(false);
  const { 
    organizations, 
    currentOrganization, 
    setCurrentOrganization,
    isLoading 
  } = useOrganizationContext();

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[200px] justify-between" disabled>
        <div className="flex items-center">
          <Building className="mr-2 h-4 w-4" />
          Loading...
        </div>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center">
            <Building className="mr-2 h-4 w-4" />
            {currentOrganization ? currentOrganization.name : "Select organization..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>
              <div className="p-2 text-center">
                <p className="text-sm text-muted-foreground mb-2">No organizations found.</p>
                <CreateOrganizationDialog>
                  <Button size="sm" className="w-full">
                    Create Organization
                  </Button>
                </CreateOrganizationDialog>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {organizations.map((organization) => (
                <CommandItem
                  key={organization.id}
                  value={organization.name}
                  onSelect={() => {
                    setCurrentOrganization(organization);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentOrganization?.id === organization.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{organization.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{organization.role}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {organizations.length > 0 && (
              <CommandGroup>
                <CreateOrganizationDialog>
                  <CommandItem asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      Create Organization
                    </Button>
                  </CommandItem>
                </CreateOrganizationDialog>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}