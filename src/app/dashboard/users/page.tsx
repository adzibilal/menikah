'use client';
import { UsersTable } from '@/components/users/users-table';
import { User } from '@/types/user';
import { useEffect, useState } from 'react';
import { BaseAPIResponse } from '@/types/common';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const page = Number(searchParams.get('page')) || 1;
    const per_page = Number(searchParams.get('per_page')) || 10;
    const search = searchParams.get('search') || '';

    const fetchUsers = async () => {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(per_page),
            ...(search && { search }),
        });

        const response = await fetch(`/api/users?${params}`);
        const data: BaseAPIResponse<User[]> = await response.json();

        if (data.data) {
            setUsers(data.data);
            setTotal(data.total || 0);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, per_page, search]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-2">Users Management</h1>
            <UsersTable
                users={users}
                total={total}
                currentPage={page}
                perPage={per_page}
                onPageChange={handlePageChange}
                onSearch={handleSearch}
                searchTerm={search}
                refetch={() => fetchUsers()}
            />
        </div>
    );
}
