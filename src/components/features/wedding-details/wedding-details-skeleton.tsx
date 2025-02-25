import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeddingDetailsSkeleton() {
    return (
        <Card className="w-full mx-auto">
            <CardHeader>
                <CardTitle>Wedding Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-6">
                    {/* Photos Section */}
                    <div className="col-span-2 grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-[200px] w-full rounded-lg" />
                        </div>
                    </div>

                    {/* Left Column */}
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={`left-${i}`} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={`right-${i}`} className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
