import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-6 w-[200px]" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-[250px]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </CardContent>
        </Card>
    );
}
