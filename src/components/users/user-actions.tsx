'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil } from 'lucide-react';
import { User } from '@/types/user';
import Link from 'next/link';
// import { BaseAPIResponse } from "@/types/common"

interface UserActionsProps {
    user: User;
}

export function UserActions({ user }: UserActionsProps) {
    console.log(user);
    //   const handleDelete = async () => {
    //     if (!confirm("Are you sure you want to delete this user?")) return

    //     try {
    //       const response = await fetch(`/api/users/${user.user_id}`, {
    //         method: "DELETE",
    //       })
    //       const data: BaseAPIResponse<null> = await response.json()

    //       if (data.error) {
    //         throw new Error(data.error)
    //       }

    //       // Refresh the page or update the table
    //       window.location.reload()
    //     } catch (error) {
    //       console.error(error)
    //     }
    //   }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/dashboard/u/${user.user_id}`}>
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </Link>
                {/* <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
