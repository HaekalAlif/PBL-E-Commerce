"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ROLES } from "../../types";

interface UserFiltersProps {
  searchTerm: string;
  roleFilter: number | null;
  statusFilter: boolean | null;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: number | null) => void;
  onStatusFilterChange: (value: boolean | null) => void;
  onClearFilters: () => void;
}

export default function UserFilters({
  searchTerm,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onClearFilters,
}: UserFiltersProps) {
  const showClearButton =
    searchTerm || roleFilter !== null || statusFilter !== null;

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, email or username..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          {/* Role filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Role
                {roleFilter !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {ROLES[roleFilter as keyof typeof ROLES]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={roleFilter === null}
                onCheckedChange={() => onRoleFilterChange(null)}
              >
                All Roles
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilter === 1}
                onCheckedChange={() => onRoleFilterChange(1)}
              >
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roleFilter === 2}
                onCheckedChange={() => onRoleFilterChange(2)}
              >
                User
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Filter className="h-4 w-4" />
                Status
                {statusFilter !== null && (
                  <Badge variant="secondary" className="ml-1">
                    {statusFilter ? "Active" : "Inactive"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter === null}
                onCheckedChange={() => onStatusFilterChange(null)}
              >
                All Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === true}
                onCheckedChange={() => onStatusFilterChange(true)}
              >
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === false}
                onCheckedChange={() => onStatusFilterChange(false)}
              >
                Inactive
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear filters button */}
          {showClearButton && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Filter badge indicators */}
      <div className="flex flex-wrap gap-2 mt-2">
        {showClearButton && (
          <div className="text-sm text-muted-foreground">
            Filters applied:
            {searchTerm && (
              <Badge variant="outline" className="ml-2">
                Search: {searchTerm}
              </Badge>
            )}
            {roleFilter !== null && (
              <Badge variant="outline" className="ml-2">
                Role: {ROLES[roleFilter as keyof typeof ROLES]}
              </Badge>
            )}
            {statusFilter !== null && (
              <Badge variant="outline" className="ml-2">
                Status: {statusFilter ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
